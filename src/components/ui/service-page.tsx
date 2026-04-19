import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowLeft, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatedNavFramer } from "./navigation-menu";
import { HeroFuturistic } from "./hero-futuristic";
import { TextScrollAnimation } from "./text-scroll-animation";
import { LandingAccordionItem } from "./interactive-image-accordion";
import { HoverEffect } from "./hover-effect";
import { Shield, Radio, Activity } from "lucide-react";
import {
  SliderBtnGroup,
  ProgressSlider,
  SliderBtn,
  SliderContent,
  SliderWrapper,
} from "./progressive-carousel";
import { FeatureHighlightCard } from "./feature-highlight-card";
import { Footer } from "./footer";

const IMG_PADDING = 12;

interface ServiceSection {
  imgUrl: string;
  subheading: string;
  heading: string;
  bodyTitle: string;
  bodyText1: string;
  bodyText2: string;
  ctaLabel: string;
}

interface ServicePageProps {
  serviceName: string;
  serviceSlug?: string;
  tagline: string;
  description: string;
  sections: ServiceSection[];
  accentColor?: string;
  lang?: string;
  customHero?: React.ReactNode;
}



export function ServicePage({
  serviceName,
  tagline,
  description,
  sections,
  lang = "es",
  customHero,
}: ServicePageProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "instant" });
    setTimeout(() => window.scrollTo(0, 0), 10);
  };

  const handleCta = () => {
    navigate("/#contact");
  };

  const handleExplore = () => {
    document.getElementById("service-sections")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white min-h-screen">
      {customHero ? customHero : (
        <HeroFuturistic
          serviceName={serviceName}
          tagline={tagline.replace(/\n/g, " ")}
          description={description}
          videoSrc="/herovideo.mp4"
          lang={lang}
          onBackClick={handleBack}
          onCtaClick={handleCta}
          onExploreClick={handleExplore}
        />
      )}

      {/* Replaced sections with TextScrollAnimation */}
      <div id="service-sections">
        <TextScrollAnimation lang={lang} serviceName={serviceName} />
      </div>

      {/* Progressive Carousel Section: methodology */}
      <section className="py-24 px-6 bg-white relative overflow-hidden border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col items-center text-center px-4 md:px-0">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1A1A1A] mb-4">
              {lang === "es" ? "Nuestro" : lang === "en" ? "Our" : lang === "zh" ? "我們的" : lang === "ru" ? "Наш" : lang === "pt" ? "Nosso" : "Our"} <span className="text-sasori-red">{lang === "es" ? "Proceso" : lang === "en" ? "Process" : lang === "zh" ? "流程" : lang === "ru" ? "процесс" : lang === "pt" ? "Processo" : "Process"}</span>
            </h2>
            <div className="w-24 md:w-32 h-1.5 md:h-2 bg-sasori-red rounded-full" />
            <p className="mt-8 text-[#1A1A1A]/50 max-w-2xl text-lg font-medium">
              {lang === "es" 
                ? "Una metodología rigurosa para transformar ideas complejas en realidades tecnológicas de alto impacto."
                : lang === "en" ? "A rigorous methodology to transform complex ideas into high-impact technological realities."
                : lang === "zh" ? "一套嚴謹的方法論，將復雜的想法轉化為高影響力的技術現實。"
                : lang === "ru" ? "Строгая методология для превращения сложных идей в высокоэффективные технологические реальности."
                : lang === "pt" ? "Uma metodología rigurosa para transformar ideias complexas em realidades tecnológicas de alto impacto."
                : "A rigorous methodology to transform complex ideas into high-impact technological realities."}
            </p>
          </div>

          <ProgressSlider vertical={false} activeSlider='step1' className="max-w-6xl mx-auto">
            <SliderContent className="relative rounded-xl overflow-hidden border border-black/5 shadow-2xl bg-[#EDEDED] group">
              {/* Metallic brushed grain overlay */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] transition-opacity duration-500" />
              
              {/* Red Tech Corner Accent */}
              <div className="absolute top-0 left-0 w-16 h-16 bg-sasori-red/10 rotate-45 translate-x-[-50%] translate-y-[-50%] border-r border-b border-sasori-red/30 z-30" />
              
              {[
                {
                  id: 'step1',
                  img: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1552664730-d307ca884978?w=1600&q=80",
                  title: lang === "es" ? "Descubrimiento" : lang === "en" ? "Discovery" : lang === "zh" ? "發現" : lang === "ru" ? "Открытие" : lang === "pt" ? "Descoberta" : "Discovery",
                  desc: lang === "es" ? "Análisis profundo de tus necesidades de negocio para una hoja de ruta clara." : lang === "en" ? "Deep analysis of your business needs for a clear roadmap." : lang === "zh" ? "深入分析您的業務需求，制定清晰的路線圖。" : lang === "ru" ? "Глубокий анализ потребностей вашего бизнеса для создания четкой дорожной карты." : lang === "pt" ? "Análise profunda das suas necesidades de negócio para um roteiro claro." : "Deep analysis of your business needs for a clear roadmap."
                },
                {
                  id: 'step2',
                  img: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1581291518633-83b4ebd1d83e?w=1600&q=80",
                  title: lang === "es" ? "Diseño & Estrategia" : lang === "en" ? "Design & Strategy" : lang === "zh" ? "設計與策略" : lang === "ru" ? "Дизайн и стратегия" : lang === "pt" ? "Design e Estratégia" : "Design & Strategy",
                  desc: lang === "es" ? "Arquitectura técnica robusta y diseño orientado a la experiencia del usuario." : lang === "en" ? "Robust technical architecture and user experience oriented design." : lang === "zh" ? "堅實的技術架構和以用戶體驗為導向的設計。" : lang === "ru" ? "Надежная техническая архитектура и дизайн, ориентированный на пользовательский опыт." : lang === "pt" ? "Arquitetura técnica robusta e design orientado para a experiência do usuário." : "Robust technical architecture and user experience oriented design."
                },
                {
                  id: 'step3',
                  img: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1555066931-4365d14bab8c?w=1600&q=80",
                  title: lang === "es" ? "Desarrollo Agile" : lang === "en" ? "Agile Development" : lang === "zh" ? "敏捷開發" : lang === "ru" ? "Agile-разработка" : lang === "pt" ? "Desenvolvimento Ágil" : "Agile Development",
                  desc: lang === "es" ? "Codificación de alto rendimiento con ciclos de iteración rápidos y eficientes." : lang === "en" ? "High-performance coding with fast and efficient iteration cycles." : lang === "zh" ? "具有快速且高效迭代週期的高性能編碼。" : lang === "ru" ? "Высокопроизводительное кодирование с быстрыми и эффективными циклами итераций." : lang === "pt" ? "Codificação de alto desempenho com ciclos de iteração rápidos e eficientes." : "High-performance coding with fast and efficient iteration cycles."
                },
                {
                  id: 'step4',
                  img: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1460925895917-afdab827c52f?w=1600&q=80",
                  title: lang === "es" ? "Despliegue & Escalado" : lang === "en" ? "Deployment & Scaling" : lang === "zh" ? "部署與擴展" : lang === "ru" ? "Развертывание и масштабирование" : lang === "pt" ? "Implantação e Escalonamento" : "Deployment & Scaling",
                  desc: lang === "es" ? "Lanzamiento a producción con monitoreo activo y optimización continua." : lang === "en" ? "Production launch with active monitoring and continuous optimization." : lang === "zh" ? "在生產環境中發布，並進行主動監控和持續優化。" : lang === "ru" ? "Запуск в эксплуатацию с активным мониторингом и непрерывной оптимизацией." : lang === "pt" ? "Lançamento em produção com monitoramento activo e optimização contínua." : "Production launch with active monitoring and continuous optimization."
                }
              ].map((step, idx) => (
                <SliderWrapper key={idx} value={step.id}>
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img loading="lazy"
                      className='w-full h-full object-cover'
                      src={step.img}
                      alt={step.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 z-20">
                      <h3 className="text-2xl sm:text-3xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2 md:mb-4">{step.title}</h3>
                      <p className="text-sm sm:text-base md:text-xl text-white/70 max-w-xl">{step.desc}</p>
                    </div>
                  </div>
                </SliderWrapper>
              ))}
            </SliderContent>

            <SliderBtnGroup className='mt-12 bg-[#EDEDED] overflow-hidden grid grid-cols-2 md:grid-cols-4 rounded-xl border border-black/5 relative shadow-lg'>
              {/* Metallic brushed grain overlay */}
              <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
              
              {[
                { id: 'step1', title: lang === "es" ? "01. Descubrir" : lang === "en" ? "01. Discover" : lang === "zh" ? "01. 發現" : lang === "ru" ? "01. Открытие" : lang === "pt" ? "01. Descobrir" : "01. Discover" },
                { id: 'step2', title: lang === "es" ? "02. Diseñar" : lang === "en" ? "02. Design" : lang === "zh" ? "02. 設計" : lang === "ru" ? "02. Дизайн" : lang === "pt" ? "02. Projetar" : "02. Design" },
                { id: 'step3', title: lang === "es" ? "03. Desarrollar" : lang === "en" ? "03. Build" : lang === "zh" ? "03. 構建" : lang === "ru" ? "03. Сборка" : lang === "pt" ? "03. Construir" : "03. Build" },
                { id: 'step4', title: lang === "es" ? "04. Desplegar" : lang === "en" ? "04. Deploy" : lang === "zh" ? "04. 部署" : lang === "ru" ? "04. Развертывание" : lang === "pt" ? "04. Implantar" : "04. Deploy" }
              ].map((btn, idx) => (
                <SliderBtn
                  key={idx}
                  value={btn.id}
                  className='text-left cursor-pointer p-4 md:p-8 transition-colors group relative overflow-hidden'
                  progressBarClass='bg-sasori-red/20 h-full border-b-4 border-sasori-red'
                >
                  <span className='block text-[8px] md:text-xs font-black text-sasori-red uppercase tracking-widest mb-1 md:mb-2'>{lang === "es" ? "Etapa" : lang === "en" ? "Phase" : lang === "zh" ? "階段" : lang === "ru" ? "Этап" : lang === "pt" ? "Etapa" : "Phase"}</span>
                  <h3 className='text-xs sm:text-base md:text-xl font-bold text-[#1A1A1A] uppercase tracking-tighter group-hover:text-sasori-red transition-colors relative z-10'>
                    {btn.title}
                  </h3>
                </SliderBtn>
              ))}
            </SliderBtnGroup>
          </ProgressSlider>
        </div>
      </section>

      {/* Added Sub-servicios section below process - per requirement 4 */}
      <section className="py-24 px-6 bg-white relative overflow-hidden border-t border-black/5">
        <LandingAccordionItem 
          title={lang === "es" ? "Nuestros Sub-servicios" : lang === "en" ? "Our Sub-services" : lang === "zh" ? "我們的子服務" : lang === "ru" ? "Наши подуслуги" : lang === "pt" ? "Nossos Sub-serviços" : "Our Sub-services"}
          subtitle={lang === "es" ? "Profundiza en las capacidades específicas que ofrecemos en cada área de especialización." : lang === "en" ? "Deepen into the specific capabilities we offer in each specialized area." : lang === "zh" ? "深入了解我們在每個專業領域提供的特定功能。" : lang === "ru" ? "Узнайте больше о конкретных возможностях, которые мы предлагаем в каждой специализированной области." : lang === "pt" ? "Aprofunde-se nas capacidades específicas que oferecemos em cada área de especialização." : "Deepen into the specific capabilities we offer in each specialized area."}
          items={sections.slice(0, 5).map((s, i) => ({
            id: i,
            title: s.heading,
            imageUrl: s.imgUrl,
            description: s.bodyText1
          }))}
          ctaText={lang === "es" ? "Saber más" : lang === "en" ? "Learn more" : lang === "zh" ? "了解更多" : lang === "ru" ? "Узнать больше" : lang === "pt" ? "Saber mais" : "Learn more"}
          onCtaClick={handleCta}
        />
      </section>

      {/* Enhanced CTA with FeatureHighlightCard */}
      <section className="bg-white py-32 px-6 border-t border-black/5 relative items-center justify-center flex">
        <FeatureHighlightCard 
          imageSrc="https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1557804506-669a67965ba0?w=1200&q=80"
          title={lang === "es" ? "Comienza tu Transformación Digital" : lang === "en" ? "Start Your Digital Transformation" : lang === "zh" ? "開始您的數位轉型" : lang === "ru" ? "Начните свою цифровую трансформацию" : lang === "pt" ? "Comece sua Transformación Digital" : "Start Your Digital Transformation"}
          description={lang === "es" 
            ? "¿Tienes un proyecto en mente? Solicita una consultoría gratuita y descubre cómo Sasorilabs puede llevar tu negocio al siguiente nivel con tecnología de vanguardia."
            : lang === "en" ? "Have a project in mind? Request a free consultation and discover how Sasorilabs can take your business to the next level with cutting-edge technology."
            : lang === "zh" ? "有項目想合作嗎？申請免費諮詢，了解 Sasorilabs 如何利用尖端技術將您的業務提升到新水平。"
            : lang === "ru" ? "Есть проект на примете? Запросите бесплатную консультацию и узнайте, как Sasorilabs может вывести ваш бизнес на новый уровень с помощью передовых технологий."
            : lang === "pt" ? "Tem um projeto em mente? Solicite uma consultoria gratuita e descubra como a Sasorilabs pode levar o seu negócio para o próximo nível com tecnologia de ponta."
            : "Have a project in mind? Request a free consultation and discover how Sasorilabs can take your business to the next level with cutting-edge technology."}
          buttonText={lang === "es" ? "Agendar Consultoría Gratuita" : lang === "en" ? "Schedule Free Consultation" : lang === "zh" ? "安排免費諮詢" : lang === "ru" ? "Запланировать бесплатную консультацию" : lang === "pt" ? "Agendar Consultoria Gratuita" : "Schedule Free Consultation"}
          onButtonClick={handleCta}
        />
      </section>
      <Footer lang={lang} />
    </div>
  );
}
