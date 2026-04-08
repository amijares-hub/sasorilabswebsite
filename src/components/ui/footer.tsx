import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Globe2 } from 'lucide-react';
import { SasoriLogo } from './sasori-logo';
import { TextHoverEffect, FooterBackgroundGradient } from './hover-footer';

export function Footer({ lang = 'es' }: { lang?: string }) {
  const navigate = useNavigate();

  const t = {
    es: {
      desc: "Desarrollo de software premium para marcas de alta gama que buscan la excelencia digital.",
      services: "Servicios",
      company: "Empresa",
      contact: "Contacto",
      rights: "© 2026 SASORILABS. TODOS LOS DERECHOS RESERVADOS.",
      startProject: "INICIAR PROYECTO",
      labels: {
        ai: "Automatización IA",
        web: "Webs Inmersivas",
        mod: "Modernización",
        about: "Sobre Nosotros",
        cases: "Casos de Éxito",
        blog: "Blog",
        contact_btn: "Contacto"
      }
    },
    en: {
      desc: "Premium software development for high-end brands seeking digital excellence.",
      services: "Services",
      company: "Company",
      contact: "Get in touch",
      rights: "© 2026 SASORILABS. ALL RIGHTS RESERVED.",
      startProject: "START PROJECT",
      labels: {
        ai: "AI Automation",
        web: "Immersive Webs",
        mod: "Modernization",
        about: "About Us",
        cases: "Case Studies",
        blog: "Blog",
        contact_btn: "Contact"
      }
    },
    zh: {
      desc: "為尋求卓越數位的優質品牌提供頂級軟件開發服務。",
      services: "服務",
      company: "公司",
      contact: "聯繫我們",
      rights: "© 2026 SASORILABS。版權所有。",
      startProject: "啟動項目",
      labels: {
        ai: "人工智能自動化",
        web: "沉浸式網站",
        mod: "現代化轉型",
        about: "關於我們",
        cases: "成功案例",
        blog: "博客",
        contact_btn: "聯繫方式"
      }
    },
    ru: {
      desc: "Разработка программного обеспечения премиум-класса для брендов, стремящихся к цифровому совершенству.",
      services: "Услуги",
      company: "Компания",
      contact: "Связаться с нами",
      rights: "© 2026 SASORILABS. ВСЕ ПРАВА ЗАЩИЩЕНЫ.",
      startProject: "НАЧАТЬ ПРОЕКТ",
      labels: {
        ai: "ИИ Автоматизация",
        web: "Иммерсивные Веб-сайты",
        mod: "Модернизация",
        about: "О нас",
        cases: "Кейсы",
        blog: "Блог",
        contact_btn: "Контакт"
      }
    },
    pt: {
      desc: "Desenvolvimento de software premium para marcas de alto padrão que buscam excelência digital.",
      services: "Serviços",
      company: "Empresa",
      contact: "Entre em contato",
      rights: "© 2026 SASORILABS. TODOS OS DIREITOS RESERVADOS.",
      startProject: "INICIAR PROJETO",
      labels: {
        ai: "Automação IA",
        web: "Webs Imersivas",
        mod: "Modernização",
        about: "Sobre Nós",
        cases: "Casos de Sucesso",
        blog: "Blog",
        contact_btn: "Contato"
      }
    }
  }[lang as 'es' | 'en' | 'zh' | 'ru' | 'pt'] || {
    desc: "Premium software development for high-end brands seeking digital excellence.",
    services: "Services",
    company: "Company",
    contact: "Get in touch",
    rights: "© 2026 SASORILABS. ALL RIGHTS RESERVED.",
    startProject: "START PROJECT",
    labels: {
      ai: "AI Automation",
      web: "Immersive Webs",
      mod: "Modernization",
      about: "About Us",
      cases: "Case Studies",
      blog: "Blog",
      contact_btn: "Contact"
    }
  };

  return (
    <footer className="relative z-30 pt-24 pb-12 overflow-hidden border-t border-black/5 bg-[#FFFFFF]">
      {/* Subtle metallic texture for footre */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          {/* Logo and Desc */}
          <div className="lg:col-span-2 space-y-8">
            <div 
              onClick={() => { navigate('/'); window.scrollTo(0, 0); }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <SasoriLogo className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
              <span className="text-2xl font-black tracking-tighter text-[#1A1A1A] uppercase italic">SASORILABS</span>
            </div>
            <p className="max-w-xs text-gray-500 text-sm leading-relaxed uppercase tracking-widest font-bold">
              {t.desc}
            </p>
            <button 
              onClick={() => { navigate('/contact'); window.scrollTo(0, 0); }}
              className="px-8 py-3 bg-sasori-red text-white text-[10px] font-black tracking-[0.3em] rounded-full hover:bg-black transition-all duration-500 shadow-[0_0_20px_rgba(226,6,19,0.3)]"
            >
              {t.startProject}
            </button>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[#1A1A1A] text-sm font-bold uppercase tracking-widest mb-6">{t.services}</h4>
            <ul className="space-y-3 text-black/50 text-sm">
              {[
                { label: t.labels.ai, path: '/services/ai-automation' },
                { label: t.labels.web, path: '/services/immersive-webs' },
                { label: t.labels.mod, path: '/services/modernization' }
              ].map(s => (
                <li key={s.path}>
                  <button 
                    onClick={() => {
                      navigate(s.path);
                      window.scrollTo(0, 0);
                    }} 
                    className="hover:text-sasori-red transition-colors text-left uppercase text-[10px] font-black tracking-widest"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[#1A1A1A] text-sm font-bold uppercase tracking-widest mb-6">{t.company}</h4>
            <ul className="space-y-3 text-black/50 text-sm">
              {[
                { label: t.labels.about, href: "/#contact", isScroll: true },
                { label: t.labels.cases, href: "/#contact", isScroll: true },
                { label: t.labels.blog, href: "/blog" },
                { label: t.labels.contact_btn, href: "/contact" }
              ].map(s => (
                <li key={s.label}>
                  <button
                    onClick={() => {
                      if (s.href.startsWith('http')) {
                        window.open(s.href, '_blank');
                      } else if (s.href.startsWith('#')) {
                        const el = document.querySelector(s.href);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          navigate(s.href);
                        }
                      } else {
                        navigate(s.href);
                        window.scrollTo(0, 0);
                      }
                    }}
                    className="hover:text-sasori-red transition-colors uppercase text-[10px] font-black tracking-widest"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    navigate('/dashboard/login');
                    window.scrollTo(0, 0);
                  }}
                  className="hover:text-sasori-red transition-colors uppercase text-[10px] font-black tracking-widest flex items-center gap-2 mt-4 text-black/40"
                  title="Acceso Administrativo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                  ADMIN LOGIN
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#1A1A1A] text-sm font-bold uppercase tracking-widest mb-6">{t.contact}</h4>
            <ul className="space-y-4 text-black/50 text-sm">
              <li className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-sasori-red flex-shrink-0" />
                <a href="mailto:hello@sasorilabs.com" className="hover:text-sasori-red transition-colors uppercase text-[10px] font-black tracking-widest">hello@sasorilabs.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Globe2 className="w-4 h-4 text-sasori-red flex-shrink-0" />
                <a href="#" className="hover:text-sasori-red transition-colors uppercase text-[10px] font-black tracking-widest">sasorilabs.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-sasori-red flex-shrink-0" />
                <span className="uppercase text-[10px] font-black tracking-widest">Ciudad de México</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-black/5" />

        {/* Text Hover Effect (Giant Footer Text) */}
        <div className="w-full h-[20vh] md:h-[40vh] relative flex flex-col items-center justify-center my-8">
           <TextHoverEffect text="SASORILABS" duration={1.5} />
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 text-black/40 text-xs gap-4">
          <div className="flex gap-6">
            {['Twitter', 'LinkedIn', 'GitHub', 'Dribbble'].map(social => (
              <a key={social} href="#" className="hover:text-sasori-red transition-colors uppercase font-bold tracking-widest">{social}</a>
            ))}
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest">
            {t.rights}
          </span>
        </div>
      </div>
    </footer>
  );
}
