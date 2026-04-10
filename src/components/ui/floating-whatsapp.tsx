import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site-config';

export function FloatingWhatsApp() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp.number.replace('+', '')}?text=${encodeURIComponent(SITE_CONFIG.whatsapp.message)}`;

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
      className="fixed bottom-8 right-8 z-[100]"
    >
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
