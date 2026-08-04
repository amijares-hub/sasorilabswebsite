import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const I18N_DIR = path.join(__dirname, 'src', 'i18n');

const TARGETS = [
  { file: 'pt.ts', lang: 'pt' },
  { file: 'ru.ts', lang: 'ru' },
  { file: 'zh.ts', lang: 'zh' },
];

const SECTIONS_TO_TRANSLATE = [
  'backend', 'security', 'infrastructure', 'frontend',
  'ipaas', 'aiHardware', 'finops', 'aiAgents',
  'itsmOrchestration', 'dataBi', 'marketingGeo', 'devsecops'
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function translateText(text, targetLang) {
  if (!text || text.trim() === '') return text;
  return new Promise((resolve) => {
    const encoded = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encoded}`;
    const options = {
      hostname: 'translate.googleapis.com',
      path: `/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encoded}`,
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const translated = json[0].map(item => item[0]).join('');
          resolve(translated || text);
        } catch (e) { resolve(text); }
      });
    });
    req.on('error', () => resolve(text));
    req.end();
  });
}

async function translateObject(obj, lang) {
  if (typeof obj === 'string') {
    await sleep(80);
    return await translateText(obj, lang);
  }
  if (Array.isArray(obj)) {
    const r = [];
    for (const i of obj) r.push(await translateObject(i, lang));
    return r;
  }
  if (typeof obj === 'object' && obj !== null) {
    const r = {};
    for (const [k, v] of Object.entries(obj)) {
      r[k] = await translateObject(v, lang);
    }
    return r;
  }
  return obj;
}

function serializeToTS(obj, indent = 0) {
  const sp = '  '.repeat(indent);
  const isp = '  '.repeat(indent + 1);
  if (typeof obj === 'string') {
    return '"' + obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  }
  if (Array.isArray(obj)) {
    if (!obj.length) return '[]';
    return '[\n' + obj.map(i => `${isp}${serializeToTS(i, indent + 1)}`).join(',\n') + '\n' + sp + ']';
  }
  if (typeof obj === 'object' && obj !== null) {
    const e = Object.entries(obj).map(([k, v]) => `${isp}${k}: ${serializeToTS(v, indent + 1)}`);
    return '{\n' + e.join(',\n') + '\n' + sp + '}';
  }
  return String(obj);
}

function extractRawSection(fc, name) {
  const regex = new RegExp(`^([ \t]*)${name}: \\{`, 'm');
  const m = fc.match(regex);
  if (!m) return null;
  const indent = m[1];
  const start = m.index;
  let depth = 0;
  let i = start + m[0].length - 1;
  while (i < fc.length) {
    if (fc[i] === '{') depth++;
    if (fc[i] === '}') {
      depth--;
      if (depth === 0) {
        let end = i + 1;
        if (fc[end] === ',') end++;
        return { content: fc.slice(start, end), indent, startIdx: start, endIdx: end };
      }
    }
    i++;
  }
  return null;
}

async function main() {
  const enContent = fs.readFileSync(path.join(I18N_DIR, 'en.ts'), 'utf8');

  for (const { file, lang } of TARGETS) {
    console.log(`\nProcessing ${file} (${lang})...`);
    const fp = path.join(I18N_DIR, file);
    let fc = fs.readFileSync(fp, 'utf8');

    for (const section of SECTIONS_TO_TRANSLATE) {
      process.stdout.write(`  [${lang}] ${section}... `);
      const enSec = extractRawSection(enContent, section);
      if (!enSec) {
        console.log('not found in en.ts');
        continue;
      }

      let enObj;
      try {
        const raw = enSec.content.replace(new RegExp(`^\\s*${section}:\\s*`), '').replace(/,\s*$/, '');
        const fn = new Function('return (' + raw + ')');
        enObj = fn();
      } catch (e) {
        console.log('parse error: ' + e.message);
        continue;
      }

      const translated = await translateObject(enObj, lang);
      const tgt = extractRawSection(fc, section);

      if (tgt) {
        const ns = `${tgt.indent}${section}: ${serializeToTS(translated, tgt.indent.length / 2)}`;
        fc = fc.slice(0, tgt.startIdx) + ns + fc.slice(tgt.endIdx);
        console.log('OK (replaced)');
      } else {
        const insertPoint = fc.indexOf('promotions:');
        if (insertPoint !== -1) {
          // Find the line before promotions (which is usually the closing bracket of servicesPages)
          const insertIdx = fc.lastIndexOf('    },', insertPoint) + 6; // After the comma
          const ns = `\n      ${section}: ${serializeToTS(translated, 3)},`;
          fc = fc.slice(0, insertIdx) + ns + fc.slice(insertIdx);
          console.log('OK (inserted)');
        } else {
          console.log('not found in target, and could not find insert point, skipping');
        }
      }
    }

    fs.writeFileSync(fp, fc, 'utf8');
    console.log(`Saved ${file}`);
  }

  console.log('\nAll translations done!');
}

main().catch(console.error);
