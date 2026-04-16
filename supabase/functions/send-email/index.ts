// Supabase Edge Function: send-email
// Deploy with: supabase functions deploy send-email --no-verify-jwt
// This handles: welcome emails + newsletter campaigns
// Uses Resend API with amijares@sasorilabs.io as sender

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL = 'SasoriLabs <amijares@sasorilabs.io>';
const SITE_URL = 'https://sasorilabs.io';

// ── Email Templates ─────────────────────────────────────────
const getWelcomeEmailHTML = (name: string, lang: string, unsubscribeToken: string) => {
  const dict: Record<string, any> = {
    es: {
      subject: '¡Bienvenido a la revolución digital! 🚀',
      greeting: `Hola${name ? ' ' + name : ''}`,
      headline: 'Acabas de unirte a algo extraordinario.',
      body: 'Formas parte de una comunidad de visionarios que están redefiniendo los límites de la tecnología. Te enviaremos las últimas novedades en IA, diseño inmersivo y modernización de negocios.',
      cta: 'EXPLORAR EL BLOG',
      unsubscribe: 'Cancelar suscripción',
      footer: 'SASORILABS — Arquitectando el Futuro',
    },
    en: {
      subject: 'Welcome to the digital revolution! 🚀',
      greeting: `Hello${name ? ' ' + name : ''}`,
      headline: 'You just joined something extraordinary.',
      body: 'You are part of a community of visionaries redefining the boundaries of technology. We will send you the latest news in AI, immersive design, and business modernization.',
      cta: 'EXPLORE THE BLOG',
      unsubscribe: 'Unsubscribe',
      footer: 'SASORILABS — Architecting the Future',
    },
  };

  const t = dict[lang] || dict.es;

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${t.subject}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0a0a; font-family: 'Inter', sans-serif; color: #ffffff; }
  .container { max-width: 600px; margin: 0 auto; }
  .header { background: #0a0a0a; padding: 40px 40px 0; text-align: center; }
  .logo { font-size: 24px; font-weight: 900; letter-spacing: 0.3em; color: #E20613; }
  .hero { background: linear-gradient(135deg, #0a0a0a 0%, #1a0000 100%); padding: 60px 40px; text-align: center; border-top: 1px solid rgba(226,6,19,0.2); }
  .hero-line { width: 60px; height: 3px; background: #E20613; margin: 0 auto 30px; border-radius: 10px; }
  .headline { font-size: 32px; font-weight: 900; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 20px; }
  .body-text { font-size: 16px; color: rgba(255,255,255,0.6); line-height: 1.8; margin-bottom: 40px; }
  .cta-btn { display: inline-block; background: #E20613; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: 900; letter-spacing: 0.3em; padding: 16px 40px; border-radius: 50px; }
  .divider { height: 1px; background: rgba(255,255,255,0.05); margin: 40px; }
  .footer { padding: 40px; text-align: center; }
  .footer-text { font-size: 10px; letter-spacing: 0.2em; color: rgba(255,255,255,0.2); text-transform: uppercase; }
  .unsubscribe { font-size: 10px; color: rgba(255,255,255,0.2); text-decoration: none; letter-spacing: 0.1em; }
  .red-dot { display: inline-block; width: 8px; height: 8px; background: #E20613; border-radius: 50%; margin: 0 8px; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">SASORILABS</div>
  </div>
  <div class="hero">
    <div class="hero-line"></div>
    <h1 class="headline">${t.greeting},<br>${t.headline}</h1>
    <p class="body-text">${t.body}</p>
    <a href="${SITE_URL}/blog" class="cta-btn">${t.cta} →</a>
  </div>
  <div class="divider"></div>
  <div class="footer">
    <p class="footer-text">${t.footer}</p>
    <br>
    <a href="${SITE_URL}/unsubscribe?token=${unsubscribeToken}" class="unsubscribe">
      ${t.unsubscribe}
    </a>
  </div>
</div>
</body>
</html>`;
};

const getCampaignEmailHTML = (
  subject: string,
  content: string,
  lang: string,
  unsubscribeToken: string
) => `
<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${subject}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0a0a; font-family: 'Inter', sans-serif; color: #ffffff; }
  .container { max-width: 600px; margin: 0 auto; }
  .header { padding: 40px 40px 20px; border-bottom: 1px solid rgba(226,6,19,0.2); }
  .logo { font-size: 20px; font-weight: 900; letter-spacing: 0.3em; color: #E20613; }
  .content { padding: 50px 40px; }
  .subject-line { font-size: 28px; font-weight: 900; letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 30px; }
  .body-content { font-size: 16px; color: rgba(255,255,255,0.7); line-height: 1.9; }
  .body-content h2 { color: #E20613; font-size: 20px; font-weight: 900; margin: 30px 0 15px; }
  .body-content p { margin-bottom: 20px; }
  .divider { height: 1px; background: rgba(255,255,255,0.05); margin: 0 40px; }
  .footer { padding: 30px 40px; text-align: center; }
  .footer-logo { font-size: 14px; font-weight: 900; letter-spacing: 0.3em; color: rgba(255,255,255,0.2); }
  .unsubscribe { display: block; margin-top: 15px; font-size: 10px; color: rgba(255,255,255,0.2); text-decoration: none; letter-spacing: 0.1em; }
  .cta-btn { display: inline-block; background: #E20613; color: #fff; text-decoration: none; font-size: 11px; font-weight: 900; letter-spacing: 0.3em; padding: 14px 32px; border-radius: 50px; margin-top: 30px; }
</style>
</head>
<body>
<div class="container">
  <div class="header"><div class="logo">SASORILABS</div></div>
  <div class="content">
    <h1 class="subject-line">${subject}</h1>
    <div class="body-content">${content}</div>
    <a href="${SITE_URL}/blog" class="cta-btn">LEER MÁS →</a>
  </div>
  <div class="divider"></div>
  <div class="footer">
    <div class="footer-logo">SASORILABS</div>
    <a href="${SITE_URL}/unsubscribe?token=${unsubscribeToken}" class="unsubscribe">
      Cancelar suscripción / Unsubscribe
    </a>
  </div>
</div>
</body>
</html>`;

// ── Main Handler ─────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { type, to, name, lang = 'es', unsubscribeToken, subject, content } = body;

    let emailHTML = '';
    let emailSubject = '';

    if (type === 'welcome') {
      emailSubject = lang === 'en' ? 'Welcome to the digital revolution! 🚀' : '¡Bienvenido a la revolución digital! 🚀';
      emailHTML = getWelcomeEmailHTML(name || '', lang, unsubscribeToken);
    } else if (type === 'campaign') {
      emailSubject = subject;
      emailHTML = getCampaignEmailHTML(subject, content, lang, unsubscribeToken);
    } else {
      return new Response(JSON.stringify({ error: 'Unknown email type' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: emailSubject,
        html: emailHTML,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend error:', data);
      return new Response(JSON.stringify({ error: data }), {
        status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
});
