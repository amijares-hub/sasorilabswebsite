import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Mail, 
  ArrowRight,
  Sparkles,
  ExternalLink,
  CalendarDays,
  Clock,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { cn } from '../../lib/utils';

interface ContactSelectionProps {
  lang: string;
  subscriberId?: string;
}

export function ContactSelection({ lang, subscriberId }: ContactSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const whatsappUrl = "https://wa.me/34672106989?text=Hola!%20Vengo%20de%20la%20web%20de%20SasoriLabs%20y%20me%20gustaría%20agendar%20una%20cita.";
  const emailUrl = "mailto:amijares@sasorilabs.io?subject=Consulta%20SasoriLabs%20-%20Agendar%20Cita";

  // Generate next 7 business days
  const getBusinessDays = () => {
    const days = [];
    let current = new Date();
    while (days.length < 7) {
      current.setDate(current.getDate() + 1);
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sat/Sun
        days.push(new Date(current));
      }
    }
    return days;
  };

  const businessDays = getBusinessDays();

  const timeSlots = [
    { id: 'morning', label: 'Mañana', range: '09:00 - 12:00' },
    { id: 'midday', label: 'Mediodía', range: '12:00 - 15:00' },
    { id: 'afternoon', label: 'Tarde', range: '15:00 - 18:00' },
    { id: 'night', label: 'Noche', range: '18:00 - 21:00' },
  ];

  // Auto-update Supabase when preferences change
  useEffect(() => {
    if ((selectedDate || selectedSlot) && subscriberId) {
      const updatePreferences = async () => {
        setIsUpdating(true);
        try {
          const { error } = await supabase
            .from('onboarding_submissions')
            .update({
              pref_fecha_contacto: selectedDate,
              pref_franja_horaria: selectedSlot
            })
            .eq('subscriber_id', subscriberId);
          
          if (error) throw error;
          setLastSaved(new Date().toLocaleTimeString());
        } catch (err) {
          console.error('Error updating contact preferences:', err);
        } finally {
          setIsUpdating(false);
        }
      };

      const timer = setTimeout(updatePreferences, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedDate, selectedSlot, subscriberId]);

  return (
    <div className="space-y-12 py-4">
      
      {/* PREFERENCE SELECTOR CARD */}
      <div className="relative p-8 md:p-10 rounded-[3rem] bg-white border border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sasori-red/5 blur-[80px] -mr-20 -mt-20 opacity-50" />
        
        <div className="relative z-10 space-y-8">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="text-xl font-black uppercase tracking-tighter italic text-[#1a1a22] flex items-center gap-3">
                   <CalendarDays className="w-6 h-6 text-sasori-red" />
                   Preferencias de Contacto
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#1a1a22]/40 mt-1">¿Cuándo te viene mejor que hablemos?</p>
             </div>
             {isUpdating ? (
               <div className="flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full border border-black/10">
                 <Loader2 className="w-3 h-3 animate-spin text-sasori-red" />
                 <span className="text-[8px] font-black uppercase tracking-widest text-[#1a1a22]/40">Sincronizando...</span>
               </div>
             ) : lastSaved && (
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                 <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                 <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600/70">Guardado {lastSaved}</span>
               </div>
             )}
          </div>

          <div className="space-y-6">
             {/* Day Selector */}
             <div className="space-y-4">
                <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
                  {businessDays.map((date) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const isSelected = selectedDate === dateStr;
                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={cn(
                          "flex-shrink-0 w-24 h-24 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-1 group",
                          isSelected 
                            ? 'bg-sasori-red border-sasori-red text-white scale-105 z-10' 
                            : 'bg-black/5 border-black/10 text-[#1a1a22]/50 hover:border-black/20 hover:bg-black/8'
                        )}
                      >
                        <span className="text-[9px] uppercase font-black tracking-widest opacity-60">
                          {date.toLocaleDateString(lang, { weekday: 'short' })}
                        </span>
                        <span className="text-2xl font-black">{date.getDate()}</span>
                        <span className="text-[8px] uppercase font-bold opacity-30">
                          {date.toLocaleDateString(lang, { month: 'short' })}
                        </span>
                      </button>
                    );
                  })}
                </div>
             </div>

             {/* Slot Selector */}
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {timeSlots.map((slot) => {
                  const isSelected = selectedSlot === slot.id;
                  return (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all duration-300 text-left group relative overflow-hidden",
                        isSelected 
                          ? 'bg-sasori-red text-white border-sasori-red shadow-[0_0_20px_rgba(226,6,19,0.2)]' 
                          : 'bg-black/5 border-black/10 text-[#1a1a22]/50 hover:border-sasori-red/30'
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                         <div className={cn("p-1.5 rounded-lg", isSelected ? "bg-white/10" : "bg-black/5")}>
                            <Clock className={cn("w-4 h-4", isSelected ? "text-white" : "text-[#1a1a22]/30")} />
                         </div>
                         {isSelected && <div className="w-2 h-2 rounded-full bg-sasori-red animate-pulse" />}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1">{slot.label}</p>
                      <p className={cn("text-[9px] font-bold", isSelected ? "text-white/70" : "text-[#1a1a22]/30")}>{slot.range}</p>
                    </button>
                  );
                })}
             </div>
          </div>
        </div>
      </div>

      {/* FINAL ACTION BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp Button */}
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="group relative overflow-hidden flex flex-col items-center justify-center p-10 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 w-20 h-20 rounded-3xl bg-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
            <MessageCircle className="w-10 h-10 text-emerald-500" />
          </div>
          
          <h4 className="relative z-10 text-2xl font-black uppercase tracking-tighter italic text-[#1a1a22] mb-2">WhatsApp</h4>
          <p className="relative z-10 text-[10px] font-black uppercase tracking-widest text-emerald-600/70 mb-6">Confirmar Vía Chat</p>
          
          <div className="relative z-10 flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest group-hover:bg-white group-hover:text-emerald-500 transition-all duration-300">
            Contactar ahora <ExternalLink className="w-3 h-3" />
          </div>
        </motion.a>

        {/* Email Button */}
        <motion.a
          href={emailUrl}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="group relative overflow-hidden flex flex-col items-center justify-center p-10 rounded-[2.5rem] bg-white border border-black/10 hover:border-sasori-red/40 transition-all duration-500 shadow-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sasori-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 w-20 h-20 rounded-3xl bg-black/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-black/10 group-hover:border-sasori-red/30">
            <Mail className="w-10 h-10 text-[#1a1a22]/40 group-hover:text-sasori-red transition-colors" />
          </div>
          
          <h4 className="relative z-10 text-2xl font-black uppercase tracking-tighter italic text-[#1a1a22] mb-2">Email</h4>
          <p className="relative z-10 text-[10px] font-black uppercase tracking-widest text-[#1a1a22]/40 mb-6">Confirmar Vía Mail</p>
          
          <div className="relative z-10 flex items-center gap-2 px-6 py-3 bg-black/5 text-[#1a1a22] rounded-xl font-black text-[10px] uppercase tracking-widest group-hover:bg-sasori-red group-hover:text-white transition-all duration-300 border border-black/10">
            Enviar correo <ArrowRight className="w-3 h-3" />
          </div>
        </motion.a>
      </div>

      <div className="p-6 rounded-2xl bg-black/[0.03] border border-black/8 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-sasori-red/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-sasori-red animate-pulse" />
        </div>
        <p className="text-[9px] font-black text-[#1a1a22]/40 uppercase tracking-[0.2em] leading-relaxed text-left">
          Tus preferencias de contacto han sido registradas. El Sasori Master revisará tu diagnóstico y te contactará en la ventana seleccionada.
        </p>
      </div>
    </div>
  );
}
