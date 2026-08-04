import React, { useEffect } from 'react';
import HeroText from "../components/ui/hero-shutter-text";
import { useNavigate } from "react-router-dom";
import { FeatureHighlightCard } from "../components/ui/feature-highlight-card";
import { TextScrollAnimation } from "../components/ui/text-scroll-animation";
import { ArrowRight, Monitor, Smartphone, Globe, Code, Layers, Sparkles, BrainCircuit, Box, LayoutDashboard, Bot } from 'lucide-react';
import { motion } from "framer-motion";

export function DemosPage({ lang = 'es' }: { lang?: string }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCta = () => {
    navigate("/#contact");
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const demos = [
    {
      title: lang === 'es' ? "Plataforma Educativa AI" : "AI Educational Platform",
      description: lang === 'es' ? "Academia virtual con tutores de Inteligencia Artificial que se adaptan al ritmo del estudiante en tiempo real." : "Virtual academy with AI tutors that adapt to the student's pace in real time.",
      icon: <BrainCircuit className="w-8 h-8" />, 
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
      tags: ["React", "AI", "Education"],
      type: lang === 'es' ? "Plataforma Web" : "Web Platform"
    },
    {
      title: lang === 'es' ? "E-Commerce Inmersivo 3D" : "3D Immersive E-Commerce",
      description: lang === 'es' ? "Tienda online premium donde los usuarios interactúan con modelos 3D de los productos con físicas reales." : "Premium online store where users interact with 3D product models with real physics.",
      icon: <Box className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      tags: ["Three.js", "WebGL", "Store"],
      type: "E-Commerce"
    },
    {
      title: lang === 'es' ? "CRM para Inmobiliarias" : "Real Estate CRM",
      description: lang === 'es' ? "Panel de control inteligente que automatiza el seguimiento de clientes y agendas mediante IA predictiva." : "Intelligent control panel that automates client follow-up and agendas using predictive AI.",
      icon: <LayoutDashboard className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      tags: ["Dashboard", "SaaS", "Real Estate"],
      type: lang === 'es' ? "Panel Administrativo" : "Admin Panel"
    },
    {
      title: lang === 'es' ? "App Móvil de Entrenador Fitness" : "Fitness Trainer Mobile App",
      description: lang === 'es' ? "Aplicación móvil inteligente que genera planes nutricionales y rutinas dinámicas basadas en algoritmos de salud." : "Smart mobile app that generates nutritional plans and dynamic routines based on health algorithms.",
      icon: <Smartphone className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
      tags: ["React Native", "Mobile", "Health"],
      type: lang === 'es' ? "Aplicación Móvil" : "Mobile App"
    },
    {
      title: lang === 'es' ? "Landing Page Cinematográfica" : "Cinematic Landing Page",
      description: lang === 'es' ? "Sitio web experiencial para una marca de lujo con animaciones basadas en scroll y transiciones fluidas." : "Experiential website for a luxury brand with scroll-based animations and fluid transitions.",
      icon: <Sparkles className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
      tags: ["GSAP", "Landing", "Luxury"],
      type: lang === 'es' ? "Sitio Corporativo" : "Corporate Site"
    },
    {
      title: lang === 'es' ? "Asistente AI de Ventas Autónomo" : "Autonomous AI Sales Assistant",
      description: lang === 'es' ? "Bot automatizado que atiende clientes por WhatsApp, negocia precios bajo reglas y cierra ventas de forma natural." : "Automated bot that serves customers via WhatsApp, negotiates prices under rules and closes sales naturally.",
      icon: <Bot className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80",
      tags: ["AI Agent", "WhatsApp", "Sales"],
      type: lang === 'es' ? "Automatización" : "Automation"
    },
    {
      title: "Ecommerce SaaS",
      description: lang === 'es' 
        ? "Es una plataforma basada en la nube diseñada para simplificar la creación, administración y escalado de tiendas en línea. Ofrece herramientas integradas para la gestión de catálogo, control de inventario, procesamiento de pedidos y analíticas de ventas desde un panel centralizado. Con esta solución, los comerciantes pueden optimizar sus operaciones digitales y brindar una experiencia de compra fluida y eficiente a sus clientes." 
        : "A cloud-based platform designed to simplify the creation, management, and scaling of online stores. It offers integrated tools for catalog management, inventory control, order processing, and sales analytics from a centralized dashboard.",
      icon: <Globe className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      tags: ["SaaS", "Ecommerce", "Cloud"],
      type: "SaaS",
      url: "https://e-commerce-saas-sigma.vercel.app/"
    }
  ];

  const t = {
    es: {
      title: "SHOWCASE",
      subtitle: "DE TECNOLOGÍA",
      taglineHighlight: "Demos Interactivos",
      taglineSubtext: "Explora aplicaciones funcionales y casos de éxito reales creados para revolucionar industrias.",
      viewDemo: "Ver Demo en Vivo",
      comingSoon: "Próximamente",
      catalogueTitle: "Portafolio de Innovación",
      catalogueHeadline: "Nuestros Demos",
      ctaTitle: "Lleva tu idea a la realidad",
      ctaDesc: "¿Viste algo que te inspiró? Podemos construir un servicio personalizado para tu negocio con la misma calidad de estos demos.",
      ctaBtn: "Agendar Consultoría Gratuita"
    },
    en: {
      title: "SHOWCASE",
      subtitle: "OF TECHNOLOGY",
      taglineHighlight: "Interactive Demos",
      taglineSubtext: "Explore functional applications and real success cases built to revolutionize industries.",
      viewDemo: "View Live Demo",
      comingSoon: "Coming Soon",
      catalogueTitle: "Innovation Portfolio",
      catalogueHeadline: "Our Demos",
      ctaTitle: "Bring your idea to reality",
      ctaDesc: "Did you see something that inspired you? We can build a personalized service for your business with the same quality as these demos.",
      ctaBtn: "Schedule Free Consultation"
    },
    zh: {
      title: "技术展示",
      subtitle: "科技之美",
      taglineHighlight: "互动演示",
      taglineSubtext: "探索旨在彻底改变行业的各种功能应用程序和真实成功案例。",
      viewDemo: "查看现场演示",
      comingSoon: "即将推出",
      catalogueTitle: "创新作品集",
      catalogueHeadline: "我们的演示",
      ctaTitle: "将您的创意变为现实",
      ctaDesc: "看到了启发您的东西吗？我们可以利用这些演示所具备的高品质，为您的业务构建量身定制的服务。",
      ctaBtn: "预约免费咨询"
    },
    ru: {
      title: "ШОУКЕЙС",
      subtitle: "ТЕХНОЛОГИЙ",
      taglineHighlight: "Интерактивные демо",
      taglineSubtext: "Изучите функциональные приложения и реальные кейсы, созданные для трансформации отраслей.",
      viewDemo: "Смотреть демо",
      comingSoon: "Скоро",
      catalogueTitle: "Портфолио инноваций",
      catalogueHeadline: "Наши демо",
      ctaTitle: "Воплотите свою идею в жизнь",
      ctaDesc: "Увидели то, что вас вдохновило? Мы можем разработать индивидуальную услугу для вашего бизнеса с таким же качеством, как в этих демо.",
      ctaBtn: "Записаться на консультацию"
    },
    pt: {
      title: "SHOWCASE",
      subtitle: "DE TECNOLOGIA",
      taglineHighlight: "Demos Interativas",
      taglineSubtext: "Explore aplicações funcionais e casos de sucesso reais criados para revolucionar indústrias.",
      viewDemo: "Ver Demo ao Vivo",
      comingSoon: "Em breve",
      catalogueTitle: "Portfólio de Inovação",
      catalogueHeadline: "Nossas Demos",
      ctaTitle: "Traga sua ideia para a realidade",
      ctaDesc: "Viu algo que te inspirou? Podemos construir um serviço personalizado para o seu negócio com a mesma qualidade destas demos.",
      ctaBtn: "Agendar Consultoria Gratuita"
    }
  }[lang as 'es'|'en'|'zh'|'ru'|'pt'] || { title: "Demos", subtitle: "Explore our demos", viewDemo: "View Demo", comingSoon: "Coming Soon" };

  return (
    <div className="bg-white min-h-screen text-[#1A1A1A] font-sans selection:bg-sasori-red selection:text-white">
      {/* 1. Hero Section */}
      <HeroText text={t.title} subtitle={t.subtitle} />

      {/* Tagline Section */}
      <section className="relative z-20">
        <TextScrollAnimation 
          lang={lang} 
          customText={lang === 'es' ? "Explora nuestros " : "Explore our "} 
          customHighlight={t.taglineHighlight} 
          customSubtext={t.taglineSubtext}
        />
      </section>

      {/* 2. Demos Grid Section */}
      <section className="py-24 px-6 bg-[#F8F8F8] relative overflow-hidden border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h3 className="text-sasori-red text-sm font-bold tracking-[0.2em] uppercase mb-4">{t.catalogueTitle}</h3>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1A1A1A]">
              {t.catalogueHeadline}
            </h2>
            <div className="w-24 h-1.5 bg-sasori-red mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {demos.map((demo, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="group relative bg-white rounded-3xl overflow-hidden border border-black/5 hover:border-sasori-red/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img 
                    src={demo.image} 
                    alt={demo.title} 
                    className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Overlay Badge */}
                  <div className="absolute top-4 left-4 z-20 backdrop-blur-md bg-white/90 border border-black/5 text-[#1A1A1A] text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest font-black">
                    {demo.type}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-sasori-red/10 rounded-xl flex items-center justify-center text-sasori-red mb-6 transition-transform group-hover:scale-110">
                    {demo.icon}
                  </div>
                  
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-sasori-red transition-colors duration-300">
                    {demo.title}
                  </h3>
                  
                  <p className="text-black/50 text-base leading-relaxed mb-8 flex-1">
                    {demo.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {demo.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[9px] uppercase font-black tracking-widest text-black/30 bg-[#F8F8F8] px-3 py-1.5 rounded-lg border border-black/5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Button */}
                  <button 
                    onClick={() => (demo as any).url ? window.open((demo as any).url, '_blank') : null}
                    className="w-full flex items-center justify-center gap-2 border border-sasori-red/20 text-sasori-red hover:bg-sasori-red hover:text-white transition-all duration-300 py-4 rounded-2xl uppercase font-black tracking-[0.2em] text-[10px] group/btn shadow-sm"
                  >
                    {t.viewDemo}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Final Call to Action */}
      <section className="bg-white py-32 px-6 border-t border-black/5 relative items-center justify-center flex">
        <FeatureHighlightCard 
          imageSrc="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80"
          title={t.ctaTitle}
          description={t.ctaDesc}
          buttonText={t.ctaBtn}
          onButtonClick={handleCta}
        />
      </section>
    </div>
  );
}
