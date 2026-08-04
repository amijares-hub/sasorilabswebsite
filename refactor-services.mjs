import fs from 'fs';
import path from 'path';
import https from 'https';

const SRC_DIR = path.join(process.cwd(), 'src');
const PAGES_DIR = path.join(SRC_DIR, 'pages');
const I18N_DIR = path.join(SRC_DIR, 'i18n');

const SERVICE_PAGES = {
  'ai-agents-page.tsx': 'aiAgents',
  'ai-hardware-page.tsx': 'aiHardware',
  'backend-relational-page.tsx': 'backend',
  'cybersecurity-page.tsx': 'security',
  'data-bi-page.tsx': 'dataBi',
  'devsecops-page.tsx': 'devsecops',
  'finops-page.tsx': 'finops',
  'frontend-ux-page.tsx': 'frontend',
  'infrastructure-page.tsx': 'infrastructure',
  'ipaas-page.tsx': 'ipaas',
  'itsm-orchestration-page.tsx': 'itsmOrchestration',
  'marketing-geo-page.tsx': 'marketingGeo',
};

const extractedSubtitles = {};

async function refactorPages() {
  console.log('Refactoring service pages...');
  
  for (const [file, i18nKey] of Object.entries(SERVICE_PAGES)) {
    const fp = path.join(PAGES_DIR, file);
    if (!fs.existsSync(fp)) {
      console.log(`File not found: ${file}`);
      continue;
    }
    
    let content = fs.readFileSync(fp, 'utf8');
    
    let subtitleMatch = content.match(/subtitle="([^"]+)"/);
    if (subtitleMatch) {
      extractedSubtitles[i18nKey] = subtitleMatch[1];
      content = content.replace(/subtitle="([^"]+)"/g, 'subtitle={tp.subtitle}');
    } else {
      console.log(`Subtitle not found in ${file}`);
    }
    
    content = content.replace(
      />Resultado Inmediato<\/span>/g, 
      '>{t.common.immediateResult}</span>'
    );
    
    fs.writeFileSync(fp, content, 'utf8');
    console.log(`Updated ${file}`);
  }
  
  console.log('Extracted subtitles:', extractedSubtitles);
  return extractedSubtitles;
}

const LANG_MAP = ['es', 'en', 'pt', 'ru', 'zh'];

async function translateText(text, targetLang) {
  if (targetLang === 'es') return text;
  return new Promise((resolve) => {
    const encoded = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${targetLang}&dt=t&q=${encoded}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const translated = json[0].map(item => item[0]).join('');
          resolve(translated || text);
        } catch (e) { resolve(text); }
      });
    }).on('error', () => resolve(text));
  });
}

async function updateTranslations(subtitles) {
  for (const lang of LANG_MAP) {
    const fp = path.join(I18N_DIR, `${lang}.ts`);
    if (!fs.existsSync(fp)) continue;
    
    let content = fs.readFileSync(fp, 'utf8');
    
    console.log(`Translating for ${lang}...`);
    const immediateRes = await translateText('Resultado Inmediato', lang);
    
    if (!content.includes('immediateResult:')) {
      content = content.replace(/common:\s*\{/, `common: {\n      immediateResult: "${immediateRes}",`);
    }
    
    for (const [key, esSubtitle] of Object.entries(subtitles)) {
      const translatedSub = await translateText(esSubtitle, lang);
      const regex = new RegExp(`(${key}:\\s*\\{)`);
      if (regex.test(content)) {
        if (!content.includes(`subtitle: "${translatedSub}"`)) {
           content = content.replace(regex, `$1\n        subtitle: "${translatedSub}",`);
        }
      }
    }
    
    fs.writeFileSync(fp, content, 'utf8');
    console.log(`Updated ${lang}.ts`);
  }
}

async function main() {
  const subtitles = await refactorPages();
  await updateTranslations(subtitles);
  console.log('Done!');
}

main().catch(console.error);
