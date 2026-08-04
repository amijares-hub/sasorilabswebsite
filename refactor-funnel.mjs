import fs from 'fs';
import path from 'path';
import https from 'https';

const fp = path.join(process.cwd(), 'src', 'components', 'ui', 'interactive-funnel.tsx');
let content = fs.readFileSync(fp, 'utf8');

const tStrings = {
  step1Title: { es: "¿En qué podemos acelerar tu empresa?", en: "How can we accelerate your business?" },
  step1Subtitle: { es: "Paso 1 de 3 • Selecciona el pilar principal", en: "Step 1 of 3 • Select the main pillar" },
  step2Title: { es: "Cuéntanos sobre tu proyecto", en: "Tell us about your project" },
  step2Subtitle: { es: "Paso 2 de 3 • Guardado automático", en: "Step 2 of 3 • Auto-saving" },
  company: { es: "Empresa (Opcional)", en: "Company (Optional)" },
  website: { es: "Sitio Web (Opcional)", en: "Website (Optional)" },
  techDesc: { es: "Descripción técnica o retos", en: "Technical description or challenges" },
  techDescPlaceholder: { es: "Detalla lo que necesitas construir o solucionar...", en: "Detail what you need to build or solve..." },
  limitExceeded: { es: "Has excedido el límite.", en: "Limit exceeded." },
  step3Title: { es: "¿A dónde enviamos el diagnóstico?", en: "Where do we send the diagnosis?" },
  step3Subtitle: { es: "Paso 3 de 3 • Privacidad garantizada", en: "Step 3 of 3 • Privacy guaranteed" },
  fullName: { es: "Nombre Completo", en: "Full Name" },
  corpEmail: { es: "Correo Corporativo", en: "Corporate Email" },
  guarantee: { es: "Garantía de respuesta en menos de 2 horas laborables. Tus datos están cifrados de extremo a extremo y nunca enviaremos spam.", en: "Guaranteed response in under 2 business hours. Your data is E2E encrypted and we will never send spam." },
  successTitle: { es: "¡Solicitud Recibida!", en: "Request Received!" },
  successDesc: { es: "Nuestro equipo técnico está evaluando tu requerimiento. Recibirás un diagnóstico en tu correo en breve.", en: "Our technical team is evaluating your request. You will receive a diagnosis in your email shortly." },
  whatsapp: { es: "Hablar ahora por WhatsApp", en: "Chat now on WhatsApp" },
  return: { es: "Volver al sitio", en: "Return to site" },
  back: { es: "Atrás", en: "Back" },
  next: { es: "Siguiente", en: "Next" },
  sending: { es: "Enviando...", en: "Sending..." },
  submit: { es: "Enviar Solicitud", en: "Submit Request" },
  errorSubmit: { es: "Error al enviar. Inténtalo de nuevo.", en: "Error sending. Please try again." }
};

const LANG_MAP = ['pt', 'ru', 'zh'];

async function translateText(text, targetLang) {
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

async function run() {
  console.log("Translating dictionary...");
  for (const [key, langs] of Object.entries(tStrings)) {
    for (const lang of LANG_MAP) {
      langs[lang] = await translateText(langs.es, lang);
    }
  }

  // Also translate SERVICES in the content
  // { es: "Frontend & UX/UI", en: "Frontend & UX/UI" }
  let svcs = [
    { es: "Frontend & UX/UI" },
    { es: "Backend & Bases de Datos" },
    { es: "Ciberseguridad" },
    { es: "DevOps & Cloud" },
    { es: "Integración iPaaS" },
    { es: "IA Predictiva" },
    { es: "FinOps & SaaS" },
    { es: "Agentes Autónomos" },
    { es: "ITSM & Automatización" },
    { es: "BI & Gemelos Digitales" },
    { es: "Marketing Generativo" },
    { es: "DevSecOps & Compliance" }
  ];
  
  for (const s of svcs) {
    s.en = await translateText(s.es, 'en');
    s.pt = await translateText(s.es, 'pt');
    s.ru = await translateText(s.es, 'ru');
    s.zh = await translateText(s.es, 'zh');
  }

  // generate the `const t` dictionary string
  let tCode = `  const tDict = {\n`;
  for (const l of ['es', 'en', 'pt', 'ru', 'zh']) {
    tCode += `    ${l}: {\n`;
    for (const [key, langs] of Object.entries(tStrings)) {
      tCode += `      ${key}: ${JSON.stringify(langs[l])},\n`;
    }
    tCode += `    },\n`;
  }
  tCode += `  };\n`;
  tCode += `  const t = tDict[lang as keyof typeof tDict] || tDict.en;\n`;

  // Apply to content
  // Add tCode inside InteractiveFunnel right after const [errorMsg, setErrorMsg] = useState("");
  content = content.replace(/const \[errorMsg, setErrorMsg\] = useState\(""\);/, `const [errorMsg, setErrorMsg] = useState("");\n\n${tCode}`);

  // Replace all the ternaries!
  content = content.replace(/isEs \? "Error al enviar\. Inténtalo de nuevo\." : "Error sending\. Please try again\."/g, 't.errorSubmit');
  content = content.replace(/isEs \? "¿En qué podemos acelerar tu empresa\?" : "How can we accelerate your business\?"/g, 't.step1Title');
  content = content.replace(/isEs \? "Paso 1 de 3 • Selecciona el pilar principal" : "Step 1 of 3 • Select the main pillar"/g, 't.step1Subtitle');
  content = content.replace(/isEs \? "Cuéntanos sobre tu proyecto" : "Tell us about your project"/g, 't.step2Title');
  content = content.replace(/isEs \? "Paso 2 de 3 • Guardado automático" : "Step 2 of 3 • Auto-saving"/g, 't.step2Subtitle');
  content = content.replace(/isEs \? "Empresa \(Opcional\)" : "Company \(Optional\)"/g, 't.company');
  content = content.replace(/isEs \? "Sitio Web \(Opcional\)" : "Website \(Optional\)"/g, 't.website');
  content = content.replace(/isEs \? "Descripción técnica o retos" : "Technical description or challenges"/g, 't.techDesc');
  content = content.replace(/isEs \? "Detalla lo que necesitas construir o solucionar\.\.\." : "Detail what you need to build or solve\.\.\."/g, 't.techDescPlaceholder');
  content = content.replace(/isEs \? "Has excedido el límite\." : "Limit exceeded\."/g, 't.limitExceeded');
  content = content.replace(/isEs \? "¿A dónde enviamos el diagnóstico\?" : "Where do we send the diagnosis\?"/g, 't.step3Title');
  content = content.replace(/isEs \? "Paso 3 de 3 • Privacidad garantizada" : "Step 3 of 3 • Privacy guaranteed"/g, 't.step3Subtitle');
  content = content.replace(/isEs \? "Nombre Completo" : "Full Name"/g, 't.fullName');
  content = content.replace(/isEs \? "Correo Corporativo" : "Corporate Email"/g, 't.corpEmail');
  content = content.replace(/isEs[\s\n]*\?[\s\n]*"Garantía de respuesta en menos de 2 horas laborables\. Tus datos están cifrados de extremo a extremo y nunca enviaremos spam\."[\s\n]*:[\s\n]*"Guaranteed response in under 2 business hours\. Your data is E2E encrypted and we will never send spam\."/g, 't.guarantee');
  content = content.replace(/isEs \? "¡Solicitud Recibida!" : "Request Received!"/g, 't.successTitle');
  content = content.replace(/isEs[\s\n]*\?[\s\n]*"Nuestro equipo técnico está evaluando tu requerimiento\. Recibirás un diagnóstico en tu correo en breve\."[\s\n]*:[\s\n]*"Our technical team is evaluating your request\. You will receive a diagnosis in your email shortly\."/g, 't.successDesc');
  content = content.replace(/isEs \? "Hablar ahora por WhatsApp" : "Chat now on WhatsApp"/g, 't.whatsapp');
  content = content.replace(/isEs \? "Volver al sitio" : "Return to site"/g, 't.return');
  content = content.replace(/isEs \? "Atrás" : "Back"/g, 't.back');
  content = content.replace(/isEs \? "Siguiente" : "Next"/g, 't.next');
  content = content.replace(/isEs \? "Enviando\.\.\." : "Sending\.\.\."/g, 't.sending');
  content = content.replace(/isEs \? "Enviar Solicitud" : "Submit Request"/g, 't.submit');

  // Remove `const isEs = lang === "es";`
  content = content.replace(/const isEs = lang === "es";\n?/, '');

  // update SERVICES array
  for (let i = 0; i < svcs.length; i++) {
    const s = svcs[i];
    // label: { es: "Frontend & UX/UI", en: "Frontend & UX/UI" } => label: { es: "...", en: "...", pt: "...", ru: "...", zh: "..." }
    const regex = new RegExp(`label: \\{ es: "${s.es.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&')}", en: "[^"]+" \\}`);
    const rep = `label: { es: ${JSON.stringify(s.es)}, en: ${JSON.stringify(s.en)}, pt: ${JSON.stringify(s.pt)}, ru: ${JSON.stringify(s.ru)}, zh: ${JSON.stringify(s.zh)} }`;
    content = content.replace(regex, rep);
  }

  // update {isEs ? srv.label.es : srv.label.en}
  content = content.replace(/\{isEs \? srv\.label\.es : srv\.label\.en\}/g, '{srv.label[lang as keyof typeof srv.label] || srv.label.en}');

  fs.writeFileSync(fp, content, 'utf8');
  console.log("Interactive funnel updated successfully!");
}

run();
