import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { Button } from '../ui/button';

interface BookingSystemProps {
  subscriberId: string;
  companyName: string;
  email: string;
  lang: string;
}

export function BookingSystem({ subscriberId, companyName, email, lang }: BookingSystemProps) {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [successEvent, setSuccessEvent] = useState<{ date: string, link: string } | null>(null);

  // Generate next 14 days for selection
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const { data, error } = await supabase.functions.invoke('sasori-booking', {
        body: { action: 'get_slots', date: selectedDate }
      });
      if (error) throw error;
      setSlots(data.slots || []);
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBook = async (slot: string) => {
    setBooking(true);
    try {
      const { data, error } = await supabase.functions.invoke('sasori-booking', {
        body: { 
          action: 'create_event', 
          subscriber_id: subscriberId,
          company_name: companyName,
          email: email,
          slot: slot
        }
      });
      if (error) throw error;
      setSuccessEvent({ date: slot, link: data.meetLink });
    } catch (err) {
      console.error('Error booking slot:', err);
      alert('Error al reservar. Por favor intenta de nuevo.');
    } finally {
      setBooking(false);
    }
  };

  if (successEvent) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 glass-metallic-dark rounded-3xl border border-sasori-red/30 cinema-glow-red"
      >
        <div className="w-20 h-20 rounded-full bg-sasori-red/10 flex items-center justify-center mx-auto mb-6 border border-sasori-red/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <CheckCircle2 className="w-10 h-10 text-sasori-red" />
        </div>
        <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-4 italic">Cita Confirmada</h3>
        <p className="text-white/40 text-sm mb-8 uppercase tracking-widest leading-relaxed">
          Tu sesión estratégica con SasoriLabs ha sido sincronizada. He enviado la invitación a tu correo y el nodo de Meet está activo.
        </p>
        
        <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10 text-left space-y-4">
           <div className="flex items-center gap-4">
              <CalendarIcon className="w-5 h-5 text-sasori-red" />
              <span className="text-white font-bold">{new Date(successEvent.date).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
           </div>
           <div className="flex items-center gap-4">
              <Video className="w-5 h-5 text-sasori-red" />
              <a href={successEvent.link} target="_blank" rel="noreferrer" className="text-sasori-red hover:text-white transition-colors underline break-all font-mono text-xs">
                {successEvent.link || 'Enlace en tu invitación de correo'}
              </a>
           </div>
        </div>

        <Button 
          variant="default"
          onClick={() => window.open(successEvent.link, '_blank')}
          className="w-full h-16 bg-sasori-red text-white hover:bg-white hover:text-sasori-red rounded-2xl font-black uppercase tracking-widest transition-all cinema-shadow-red"
        >
          ENTRAR A LA SALA DE MEET
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Date Selector */}
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 pl-4">Seleccionar Nodo Temporal</label>
        <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar">
          {days.map((d) => {
            const dateObj = new Date(d);
            const isSelected = selectedDate === d;
            return (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`flex-shrink-0 w-20 h-24 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 ${
                  isSelected 
                    ? 'bg-sasori-red border-sasori-red cinema-glow-red text-white' 
                    : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-widest">
                  {dateObj.toLocaleDateString(lang, { weekday: 'short' })}
                </span>
                <span className="text-2xl font-black">{dateObj.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slots Selector */}
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 pl-4">Ventanas de Disponibilidad (WEST)</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <AnimatePresence mode="wait">
            {loadingSlots ? (
              <div className="col-span-full h-40 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-sasori-red animate-spin opacity-50" />
              </div>
            ) : slots.length > 0 ? (
              slots.map((s, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => handleBook(s)}
                  disabled={booking}
                  className="group relative h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:border-sasori-red/50 hover:bg-sasori-red/5 transition-all text-sm font-bold text-white/60 hover:text-white"
                >
                  <Clock className="w-3.5 h-3.5 mr-2 text-sasori-red opacity-0 group-hover:opacity-100 transition-opacity" />
                  {new Date(s).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })}
                </motion.button>
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-white/20 uppercase tracking-widest text-xs font-bold border border-dashed border-white/10 rounded-2xl">
                No hay ventanas disponibles para este día
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {booking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
           <Loader2 className="w-12 h-12 text-sasori-red animate-spin mb-6" />
           <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">Sincronizando Calendario</h3>
           <p className="text-white/40 text-[10px] uppercase tracking-[0.4em]">Inyectando evento en Sasori Node...</p>
        </div>
      )}
    </div>
  );
}
