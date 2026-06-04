import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Languages } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site-config';

interface FloatingWhatsAppProps {
  lang?: string;
  onToggleLang?: (lang: string) => void;
}

const LANGUAGES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
  { code: 'zh', label: '中文' },
];

export function FloatingWhatsApp({ lang = 'es', onToggleLang }: FloatingWhatsAppProps) {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp.number.replace('+', '')}?text=${encodeURIComponent(SITE_CONFIG.whatsapp.message)}`;
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: 1, 
        duration: 0.5, 
        type: 'spring', 
        stiffness: 260, 
        damping: 20 
      }}
      className="fixed bottom-8 right-8 z-[100] flex flex-col items-center gap-4"
    >
      {/* Language Selector */}
      {onToggleLang && (
        <div 
          className="relative flex flex-col items-center md:hidden"
          onMouseEnter={() => setIsLangMenuOpen(true)}
          onMouseLeave={() => setIsLangMenuOpen(false)}
          onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
        >
          <AnimatePresence>
            {isLangMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-full mb-3 flex flex-col gap-2 p-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl"
              >
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => onToggleLang(l.code)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                      lang === l.code 
                        ? 'bg-sasori-red text-white' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className="group relative flex items-center justify-center w-12 h-12 bg-black/80 backdrop-blur-md rounded-full border border-white/10 hover:border-sasori-red transition-all duration-300 hover:scale-110 shadow-xl"
            aria-label="Cambiar idioma"
          >
            <Languages className="w-5 h-5 text-white/80 group-hover:text-sasori-red transition-colors" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-sasori-red rounded-full text-[9px] font-black text-white flex items-center justify-center border-2 border-[#1A1A1A]">
              {lang.toUpperCase()}
            </span>
          </button>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        {/* Pulsing effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-40" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 px-4 py-2 bg-white text-[#1A1A1A] rounded-xl shadow-xl border border-black/5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
          <p className="text-[10px] font-black uppercase tracking-widest text-center">
            ¿Podemos ayudarte?
          </p>
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white border-r border-t border-black/5 rotate-45" />
        </div>

        {/* Main button */}
        <div className="relative w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)] group-hover:scale-110 transition-all duration-300">
          <MessageCircle className="w-8 h-8 text-white fill-white" />
          
          {/* Notification dot */}
          <span className="absolute top-0 right-0 w-4 h-4 bg-sasori-red border-2 border-white rounded-full" />
        </div>
      </a>
    </motion.div>
  );
}
