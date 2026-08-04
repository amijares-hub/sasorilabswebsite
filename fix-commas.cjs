const fs = require('fs');
const path = require('path');
const I18N_DIR = path.join(process.cwd(), 'src', 'i18n');

['pt.ts', 'ru.ts', 'zh.ts'].forEach(file => {
  const fp = path.join(I18N_DIR, file);
  let fc = fs.readFileSync(fp, 'utf8');
  
  // Find places where a closing brace is followed by a word character and a colon
  fc = fc.replace(/\}(\s+)([a-zA-Z0-9_]+):/g, '},$1$2:');
  
  fs.writeFileSync(fp, fc, 'utf8');
  console.log('Fixed commas in ' + file);
});
