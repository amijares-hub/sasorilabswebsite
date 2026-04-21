import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Mail, 
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/button';

interface ContactSelectionProps {
  lang: string;
}

export function ContactSelection({ lang }: ContactSelectionProps) {
  const whatsappUrl = "https://wa.me/34672106989?text=Hola!%20Vengo%20de%20la%20web%20de%20SasoriLabs%20y%20me%20gustaría%20agendar%20una%20cita.";
  const emailUrl = "mailto:amijares@sasorilabs.io?subject=Consulta%20SasoriLabs%20-%20Agendar%20Cita";

  return (
    <div className="space-y-10 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp Button */}
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="group relative overflow-hidden flex flex-col items-center justify-center p-10 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-500 cinema-glow-emerald"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 w-20 h-20 rounded-3xl bg-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
            <MessageCircle className="w-10 h-10 text-emerald-500" />
          </div>
          
          <h4 className="relative z-10 text-2xl font-black uppercase tracking-tighter italic text-white mb-2">WhatsApp</h4>
          <p className="relative z-10 text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-6">Respuesta Inmediata</p>
          
          <div className="relative z-10 flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest group-hover:bg-white group-hover:text-emerald-500 transition-all duration-300">
            Contactar ahora <ExternalLink className="w-3 h-3" />
          </div>
        </motion.a>

        {/* Email Button */}
        <motion.a
          href={emailUrl}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="group relative overflow-hidden flex flex-col items-center justify-center p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-sasori-red/50 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sasori-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/10 group-hover:border-sasori-red/30">
            <Mail className="w-10 h-10 text-white/50 group-hover:text-sasori-red transition-colors" />
          </div>
          
          <h4 className="relative z-10 text-2xl font-black uppercase tracking-tighter italic text-white mb-2">Email</h4>
          <p className="relative z-10 text-[10px] font-black uppercase tracking-widest text-white/30 mb-6">Propuestas Formales</p>
          
          <div className="relative z-10 flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest group-hover:bg-sasori-red transition-all duration-300 border border-white/10">
            Enviar correo <ArrowRight className="w-3 h-3" />
          </div>
        </motion.a>
      </div>

      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-sasori-red/10 flex items-center justify-center flex-shrink-0 animate-pulse">
          <Sparkles className="w-5 h-5 text-sasori-red" />
        </div>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
          {lang === 'es' 
            ? "Agendaremos tu sesión de forma manual para asegurarnos de que el equipo técnico adecuado esté presente."
            : "We will schedule your session manually to ensure the right technical team is present."}
        </p>
      </div>
    </div>
  );
}
