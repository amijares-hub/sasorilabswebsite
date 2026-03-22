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
  serviceSlug: string;
  tagline: string;
  description: string;
  sections: ServiceSection[];
  accentColor?: string;
  lang?: string;
}



export function ServicePage({
  serviceName,
  tagline,
  description,
  sections,
  lang = "es",
}: ServicePageProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "instant" });
    setTimeout(() => window.scrollTo(0, 0), 10);
  };

  const handleCta = () => {
    navigate("/contact");
    window.scrollTo({ top: 0, behavior: "instant" });
    setTimeout(() => window.scrollTo(0, 0), 10);
  };

  const handleExplore = () => {
    document.getElementById("service-sections")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-black min-h-screen">
      <HeroFuturistic
        serviceName={serviceName}
        tagline={tagline.replace(/\n/g, " ")}
        description={description}
        videoSrc="/12.mp4"
        lang={lang}
        onBackClick={handleBack}
        onCtaClick={handleCta}
        onExploreClick={handleExplore}
      />

      {/* Replaced sections with TextScrollAnimation */}
      <div id="service-sections">
        <TextScrollAnimation lang={lang} serviceName={serviceName} />
      </div>

      {/* Replaced Cards with Accordion */}
      <section className="py-12 px-6 bg-black relative overflow-hidden border-t border-white/5">
        <LandingAccordionItem 
          title={lang === "es" ? "Sub-servicios Especializados" : lang === "en" ? "Specialized Sub-services" : lang === "zh" ? "專業子服務" : lang === "ru" ? "Специализированные подуслуги" : lang === "pt" ? "Sub-serviços Especializados" : "Specialized Sub-services"}
          subtitle={lang === "es" ? "Explora nuestras soluciones avanzadas impulsadas por inteligencia artificial y tecnología de vanguardia." : lang === "en" ? "Explore our advanced solutions powered by artificial intelligence and cutting-edge technology." : lang === "zh" ? "探索我們由人工智能和尖端技術驅動的高級解決方案。" : lang === "ru" ? "Изучите наши передовые решения на базе искусственного интеллекта и современных технологий." : lang === "pt" ? "Explore nossas soluções avançadas impulsionadas por inteligência artificial e tecnologia de ponta." : "Explore our advanced solutions powered by artificial intelligence and cutting-edge technology."}
          items={sections.slice(0, 5).map((s, i) => ({
            id: i,
            title: s.heading,
            imageUrl: s.imgUrl,
            description: s.bodyText1
          }))}
          ctaText={lang === "es" ? "Solicitar Demo" : lang === "en" ? "Request Demo" : lang === "zh" ? "索取演示" : lang === "ru" ? "Запросить демо" : lang === "pt" ? "Solicitar Demo" : "Request Demo"}
          onCtaClick={handleCta}
        />
      </section>

      {/* Hover Effects Section: Additional Capabilities */}
      <section className="py-24 px-6 bg-black relative overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col items-start px-4 md:px-0 text-left">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">
              {lang === "es" ? "Más allá de la" : lang === "en" ? "Beyond the" : lang === "zh" ? "超越" : lang === "ru" ? "За пределами" : lang === "pt" ? "Além da" : "Beyond the"} <span className="text-sasori-red">{lang === "es" ? "Innovación" : lang === "en" ? "Innovation" : lang === "zh" ? "創新" : lang === "ru" ? "инноваций" : lang === "pt" ? "Inovação" : "Innovation"}</span>
            </h2>
            <div className="w-24 h-1.5 bg-sasori-red rounded-full" />
          </div>

          <HoverEffect 
            items={[
              ...(sections.length >= 6 ? [{
                title: sections[5].heading,
                description: sections[5].bodyText1,
                icon: <Radio className="w-6 h-6" />
              }] : []),
              {
                title: lang === "es" ? "Soporte Experto 24/7" : lang === "en" ? "Expert Support 24/7" : lang === "zh" ? "24/7 專家支持" : lang === "ru" ? "Экспертная поддержка 24/7" : lang === "pt" ? "Suporte Especialista 24/7" : "Expert Support 24/7",
                description: lang === "es" ? "Nuestro equipo de ingeniería está siempre disponible para garantizar la continuidad operativa de tu negocio." : lang === "en" ? "Our engineering team is always available to ensure the operational continuity of your business." : lang === "zh" ? "我們的工程團隊隨時待命，確保您的業務持續運營。" : lang === "ru" ? "Наша инженерная команда всегда готова обеспечить непрерывность работы вашего бизнеса." : lang === "pt" ? "Nossa equipe de engenharia está sempre disponível para garantir a continuidade operacional do seu negócio." : "Our engineering team is always available to ensure the operational continuity of your business.",
                icon: <Shield className="w-6 h-6" />
              },
              {
                title: lang === "es" ? "Arquitectura Escalable" : lang === "en" ? "Scalable Architecture" : lang === "zh" ? "可擴展架構" : lang === "ru" ? "Масштабируемая архитектура" : lang === "pt" ? "Arquitetura Escalável" : "Scalable Architecture",
                description: lang === "es" ? "Diseñamos soluciones que crecen contigo, soportando millones de peticiones sin degradar el rendimiento." : lang === "en" ? "We design solutions that grow with you, supporting millions of requests without degrading performance." : lang === "zh" ? "我們設計隨您共同成長的解決方案，支持數百萬次請求而不會降低性能。" : lang === "ru" ? "Мы проектируем решения, которые растут вместе с вами, поддерживая миллионы запросов без снижения производительности." : lang === "pt" ? "Projetamos soluções que crescem com você, suportando milhões de solicitações sem degradar o desempenho." : "We design solutions that grow with you, supporting millions of requests without degrading performance.",
                icon: <Activity className="w-6 h-6" />
              }
            ]}
          />
        </div>
      </section>



      {/* Progressive Carousel Section: methodology */}
      <section className="py-24 px-6 bg-black relative overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col items-center text-center px-4 md:px-0">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">
              {lang === "es" ? "Nuestro" : lang === "en" ? "Our" : lang === "zh" ? "我們的" : lang === "ru" ? "Наш" : lang === "pt" ? "Nosso" : "Our"} <span className="text-sasori-red">{lang === "es" ? "Proceso" : lang === "en" ? "Process" : lang === "zh" ? "流程" : lang === "ru" ? "процесс" : lang === "pt" ? "Processo" : "Process"}</span>
            </h2>
            <div className="w-24 md:w-32 h-1.5 md:h-2 bg-sasori-red rounded-full" />
            <p className="mt-8 text-white/50 max-w-2xl text-lg font-medium">
              {lang === "es" 
                ? "Una metodología rigurosa para transformar ideas complejas en realidades tecnológicas de alto impacto."
                : lang === "en" ? "A rigorous methodology to transform complex ideas into high-impact technological realities."
                : lang === "zh" ? "一套嚴謹的方法論，將復雜的想法轉化為高影響力的技術現實。"
                : lang === "ru" ? "Строгая методология для превращения сложных идей в высокоэффективные технологические реальности."
                : lang === "pt" ? "Uma metodologia rigorosa para transformar ideias complexas em realidades tecnológicas de alto impacto."
                : "A rigorous methodology to transform complex ideas into high-impact technological realities."}
            </p>
          </div>

          <ProgressSlider vertical={false} activeSlider='step1' className="max-w-6xl mx-auto">
            <SliderContent className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900">
              {[
                {
                  id: 'step1',
                  img: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1552664730-d307ca884978?w=1600&q=80",
                  title: lang === "es" ? "Descubrimiento" : lang === "en" ? "Discovery" : lang === "zh" ? "發現" : lang === "ru" ? "Открытие" : lang === "pt" ? "Descoberta" : "Discovery",
                  desc: lang === "es" ? "Análisis profundo de tus necesidades de negocio para una hoja de ruta clara." : lang === "en" ? "Deep analysis of your business needs for a clear roadmap." : lang === "zh" ? "深入分析您的業務需求，制定清晰的路線圖。" : lang === "ru" ? "Глубокий анализ потребностей вашего бизнеса для создания четкой дорожной карты." : lang === "pt" ? "Análise profunda das suas necessidades de negócio para um roteiro claro." : "Deep analysis of your business needs for a clear roadmap."
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
                  desc: lang === "es" ? "Lanzamiento a producción con monitoreo activo y optimización continua." : lang === "en" ? "Production launch with active monitoring and continuous optimization." : lang === "zh" ? "在生產環境中發布，並進行主動監控和持續優化。" : lang === "ru" ? "Запуск в эксплуатацию с активным мониторингом и непрерывной оптимизацией." : lang === "pt" ? "Lançamento em produção com monitoramento ativo e otimização contínua." : "Production launch with active monitoring and continuous optimization."
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

            <SliderBtnGroup className='mt-12 bg-zinc-950 overflow-hidden grid grid-cols-2 md:grid-cols-4 rounded-3xl border border-white/5'>
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
                  <h3 className='text-xs sm:text-base md:text-xl font-bold text-white uppercase tracking-tighter group-hover:text-sasori-red transition-colors relative z-10'>
                    {btn.title}
                  </h3>
                </SliderBtn>
              ))}
            </SliderBtnGroup>
          </ProgressSlider>
        </div>
      </section>

      {/* Enhanced CTA with FeatureHighlightCard */}
      <section className="bg-black py-32 px-6 border-t border-white/5 relative items-center justify-center flex">
        <FeatureHighlightCard 
          imageSrc="https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1557804506-669a67965ba0?w=1200&q=80"
          title={lang === "es" ? "Comienza tu Transformación Digital" : lang === "en" ? "Start Your Digital Transformation" : lang === "zh" ? "開始您的數位轉型" : lang === "ru" ? "Начните свою цифровую трансформацию" : lang === "pt" ? "Comece sua Transformação Digital" : "Start Your Digital Transformation"}
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
