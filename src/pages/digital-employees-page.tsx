import React, { useEffect } from "react";
import HeroText from "../components/ui/hero-shutter-text";
import { FeatureHighlightCard } from "../components/ui/feature-highlight-card";
import { LandingAccordionItem } from "../components/ui/interactive-image-accordion";
import { TextScrollAnimation } from "../components/ui/text-scroll-animation";
import { useNavigate } from "react-router-dom";
import { 
  Network, Database, Workflow, BarChart3, 
  Briefcase, LineChart, Users, Settings, 
  ShieldCheck, Zap, Lock, Eye, AlertCircle, ShoppingCart, ChevronDown
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { translations } from "../i18n/translations";

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-black/5 rounded-2xl bg-[#F8F8F8] overflow-hidden mb-4 transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left px-8 py-6 flex justify-between items-center bg-white hover:bg-[#FAF0F0] transition-colors"
      >
        <span className="font-bold text-lg text-[#1A1A1A] pr-8">{question}</span>
        <ChevronDown className={`w-6 h-6 text-sasori-red flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div 
        className={`px-8 transition-all duration-300 ease-in-out ${isOpen ? 'py-6 opacity-100 max-h-[500px]' : 'py-0 opacity-0 max-h-0'}`}
      >
        <p className="text-black/60 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

export function DigitalEmployeesPage({ lang = "es" }: { lang?: string }) {
  const navigate = useNavigate();
  const t = translations[lang as keyof typeof translations] || translations.es;
  const tp = t.servicesPages.employees;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCta = () => {
    navigate("/#contact");
  };

  return (
    <div className="bg-white min-h-screen text-[#1A1A1A] font-sans selection:bg-sasori-red selection:text-white">
      {/* 1. Hero Section */}
      <HeroText text={tp.hero} subtitle="" />

      {/* Tagline Section - Animated */}
      <section className="relative z-20">
        <TextScrollAnimation 
          lang={lang} 
          customText={tp.tagline} 
          customHighlight={tp.taglineHighlight} 
          customSubtext={
            <>
              {tp.subtext}
            </>
          }
        />
      </section>

      {/* 2. ¿Cómo lo hacemos? (Nuestra Metodología) */}
      <section className="py-24 px-6 bg-[#F8F8F8] relative overflow-hidden border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h3 className="text-sasori-red text-sm font-bold tracking-[0.2em] uppercase mb-4">{tp.methodTitle}</h3>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1A1A1A] mb-6">
              {tp.methodHeading}
            </h2>
            <div className="w-24 h-1.5 bg-sasori-red mx-auto mt-6 rounded-full" />
            <p className="mt-6 text-lg text-black/50 max-w-2xl mx-auto">
              {tp.methodDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                icon: <Workflow className="w-8 h-8" />,
                title: tp.audit,
                desc: tp.auditDesc
              },
              {
                icon: <Database className="w-8 h-8" />,
                title: tp.training,
                desc: tp.trainingDesc
              },
              {
                icon: <Network className="w-8 h-8" />,
                title: tp.omnichannel,
                desc: tp.omnichannelDesc
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: tp.refinement,
                desc: tp.refinementDesc
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-black/[0.03] border border-black/5 hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-sasori-red/10 rounded-2xl flex items-center justify-center text-sasori-red mb-6">
                  {item.icon}
                </div>
                <h4 className="text-2xl font-black tracking-tight mb-4">{item.title}</h4>
                <p className="text-black/60 text-lg leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ¿Quiénes se benefician? Bento Grid */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#0A0A0A] via-[#2A0005] to-[#000000] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sasori-red/10 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sasori-red/5 blur-[100px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20">
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-sasori-red mb-4">Industrias y Casos</h2>
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
              ¿Quiénes se <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">benefician?</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-[#111111] border border-white/5 hover:border-sasori-red/30 p-8 rounded-[2rem] flex flex-col justify-between min-h-[340px] transition-all duration-500 overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sasori-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <ShoppingCart className="w-10 h-10 text-white/30 group-hover:text-sasori-red transition-colors duration-500 relative z-10" />
              <div className="relative z-10">
                <h4 className="text-2xl font-black mb-3 text-white leading-tight">{tp.industries.ecommerce.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  {tp.industries.ecommerce.desc}
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-[#111111] border border-white/5 hover:border-white/30 p-8 rounded-[2rem] flex flex-col justify-between min-h-[340px] transition-all duration-500 overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Briefcase className="w-10 h-10 text-white/30 group-hover:text-white transition-colors duration-500 relative z-10" />
              <div className="relative z-10">
                <h4 className="text-2xl font-black mb-3 text-white leading-tight">{tp.industries.agencies.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  {tp.industries.agencies.desc}
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="bg-[#111111] border border-white/5 hover:border-sasori-red/30 p-8 rounded-[2rem] flex flex-col justify-between min-h-[340px] transition-all duration-500 overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sasori-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Zap className="w-10 h-10 text-white/30 group-hover:text-sasori-red transition-colors duration-500 relative z-10" />
              <div className="relative z-10">
                <h4 className="text-2xl font-black mb-3 text-white leading-tight">{tp.industries.logistics.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  {tp.industries.logistics.desc}
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="bg-[#111111] border border-white/5 hover:border-white/30 p-8 rounded-[2rem] flex flex-col justify-between min-h-[340px] transition-all duration-500 overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Users className="w-10 h-10 text-white/30 group-hover:text-white transition-colors duration-500 relative z-10" />
              <div className="relative z-10">
                <h4 className="text-2xl font-black mb-3 text-white leading-tight">{tp.industries.support.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  {tp.industries.support.desc}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Seguridad Blindada - Grandes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="metallic-vinotinto-card p-8 md:p-12 rounded-[2rem] flex flex-col justify-between min-h-[400px] overflow-hidden relative group"
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
                <Lock className="w-[400px] h-[400px]" />
              </div>
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white/70">
                  <span className="w-2 h-2 rounded-full bg-sasori-red animate-pulse" />
                  {tp.securityTag}
                </div>
                <ShieldCheck className="w-8 h-8 text-sasori-red" />
              </div>
              <div className="relative z-10">
                <h4 className="text-3xl font-black uppercase tracking-tight mb-4 text-white">{tp.securityTitle}</h4>
                <p className="text-white/60 text-lg leading-relaxed mb-6">
                  {tp.securityDesc}
                </p>
                <div className="flex gap-4 items-center">
                  <span className="text-white/40 text-sm font-bold tracking-widest">TECNOLOGÍAS:</span>
                  <div className="flex gap-3">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded font-mono text-xs">AWS</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded font-mono text-xs">Pinecone</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded font-mono text-xs">AES-256</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
              className="metallic-vinotinto-card p-8 md:p-12 rounded-[2rem] flex flex-col justify-between min-h-[400px] overflow-hidden relative group"
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
                <Eye className="w-[400px] h-[400px]" />
              </div>
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white/70">
                  <span className="w-2 h-2 rounded-full bg-sasori-red" />
                  {tp.humanTouchTag}
                </div>
                <AlertCircle className="w-8 h-8 text-sasori-red" />
              </div>
              <div className="relative z-10">
                <h4 className="text-3xl font-black uppercase tracking-tight mb-4 text-white">{tp.humanTouchTitle}</h4>
                <p className="text-white/60 text-lg leading-relaxed">
                  {tp.humanTouchDesc}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Preguntas Frecuentes */}
      <section className="py-24 px-6 bg-white relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-sasori-red text-sm font-bold tracking-[0.2em] uppercase mb-4">{tp.faqTitle}</h3>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#1A1A1A]">
              {tp.faqHeading}
            </h2>
            <p className="mt-4 text-black/50">
              {tp.faqDesc}
            </p>
          </div>
          <div className="flex flex-col">
            {tp.faqs.map((faq, i) => (
              <FaqItem 
                key={i}
                question={faq.question} 
                answer={faq.answer} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA Final */}
      <section className="bg-white py-32 px-6 border-t border-black/5 relative items-center justify-center flex">
        <FeatureHighlightCard 
          imageSrc="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80"
          title={tp.ctaTitle}
          description={tp.ctaDesc}
          buttonText={tp.ctaBtn}
          onButtonClick={handleCta}
        />
      </section>
    </div>
  );
}
