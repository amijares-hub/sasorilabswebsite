import React, { useEffect } from "react";
import { PremiumContact } from "../components/ui/premium-contact";
import { Footer } from "../components/ui/footer";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ContactPage({ lang = "es" }: { lang?: string }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-black min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sasori-red/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sasori-red/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <button
          onClick={() => {
            navigate("/");
            window.scrollTo(0, 0);
          }}
          className="flex items-center gap-2 px-6 py-3 border border-white/10 rounded-full bg-white/5 backdrop-blur-md hover:bg-sasori-red hover:border-sasori-red transition-all shadow-lg group mb-12"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">{lang === 'es' ? 'Volver al Inicio' : lang === 'en' ? 'Back Home' : lang === 'zh' ? '返回首頁' : lang === 'ru' ? 'На главную' : lang === 'pt' ? 'Voltar ao Início' : 'Back Home'}</span>
        </button>

        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6">
            {lang === 'es' ? 'HAGAMOS ALGO' : lang === 'en' ? 'LET\'S BUILD' : lang === 'zh' ? '讓我們做點' : lang === 'ru' ? 'ДАВАЙТЕ СОЗДАДИМ' : lang === 'pt' ? 'VAMOS FAZER ALGO' : 'LET\'S BUILD'} <span className="text-sasori-red text-glow-red">{lang === 'es' ? 'ÉPICO' : lang === 'en' ? 'EPIC' : lang === 'zh' ? '史詩級的事' : lang === 'ru' ? 'ЭПИЧ諾' : lang === 'pt' ? 'ÉPICO' : 'EPIC'}</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {lang === 'es' 
              ? '¿Listo para llevar tu marca a la próxima generación? Cuéntanos sobre tu proyecto.' 
              : lang === 'en' ? 'Ready to take your brand to the next generation? Tell us about your project.'
              : lang === 'zh' ? '準備好帶領您的品牌進入下一代了嗎？告訴我們您的項目。'
              : lang === 'ru' ? 'Готовы вывести свой бренд на новый уровень? Расскажите нам о своем проекте.'
              : lang === 'pt' ? 'Pronto para levar sua marca para a próxima geração? Conte-nos sobre seu projeto.' : 'Ready to take your brand.'}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-1 md:p-2 backdrop-blur-xl shadow-2xl relative">
            <PremiumContact lang={lang} hideTitle={true} />
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
