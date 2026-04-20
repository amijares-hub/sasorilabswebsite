import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Globe, 
  Target, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  Calendar,
  Loader2,
  ChevronLeft
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { Button } from '../ui/button';
import { BookingSystem } from './booking-system';

interface ConversionFunnelProps {
  subscriberId: string;
  email?: string;
  lang: string;
  onSuccess?: () => void;
}

const steps = [
  { id: 1, title: 'Diagnóstico', icon: <Building2 className="w-5 h-5" /> },
  { id: 2, title: 'El Desafío', icon: <Target className="w-5 h-5" /> },
  { id: 3, title: 'Proyección', icon: <Database className="w-5 h-5" /> }
];

export function ConversionFunnel({ subscriberId, email, lang, onSuccess }: ConversionFunnelProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    challenge: '',
    estimated_budget: ''
  });

  const budgetRanges = [
    { label: '$2k - $5k', value: '2k-5k' },
    { label: '$5k - $15k', value: '5k-15k' },
    { label: '$15k +', value: '15k+' }
  ];

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('onboarding_submissions')
        .insert({
          subscriber_id: subscriberId,
          company_name: formData.company_name,
          industry: formData.industry,
          challenge: formData.challenge,
          estimated_budget: formData.estimated_budget
        });

      if (error) throw error;
      
      setIsSuccess(true);
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Hubo un error al enviar tu información. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const t = {
    es: {
      next: 'Continuar',
      back: 'Atrás',
      submit: 'Transmitir Información',
      company: 'Nombre de Empresa',
      industry: 'Industria',
      url: 'URL del Sitio Web',
      challenge: '¿Cuál es el principal desafío tecnológico de tu marca ahora mismo?',
      budget: 'Rango de Presupuesto Mensual',
      thanks: 'Diagnóstico Completado',
      successMsg: 'Tus requerimientos han sido encriptados y enviados al Sasori Hub. Estamos listos para acelerar tu negocio.',
      bookCall: 'Agendar Llamada Estratégica',
      loading: 'Analizando digital footprint...',
      scanning: 'Sincronizando con Sasori Hub...'
    },
    en: {
      next: 'Continue',
      back: 'Back',
      submit: 'Transmit Information',
      company: 'Company Name',
      industry: 'Industry',
      url: 'Website URL',
      challenge: 'What is your brand\'s primary technological challenge right now?',
      budget: 'Monthly Budget Range',
      thanks: 'Diagnostic Completed',
      successMsg: 'Your requirements have been encrypted and sent to Sasori Hub. We are ready to accelerate your business.',
      bookCall: 'Schedule Strategic Call',
      loading: 'Analyzing digital footprint...',
      scanning: 'Syncing with Sasori Hub...'
    }
  }[lang as 'es' | 'en'] || {
    next: 'Continuar',
    back: 'Atrás',
    submit: 'Transmitir Información',
    company: 'Nombre de Empresa',
    industry: 'Industria',
    url: 'URL del Sitio Web',
    challenge: '¿Cuál es el principal desafío tecnológico de tu marca ahora mismo?',
    budget: 'Rango de Presupuesto Mensual',
    thanks: 'Diagnóstico Completado',
    successMsg: 'Tus requerimientos han sido encriptados y enviados al Sasori Hub. Estamos listos para acelerar tu negocio.',
    bookCall: 'Agendar Llamada Estratégica',
    loading: 'Analizando digital footprint...',
    scanning: 'Sincronizando con Sasori Hub...'
  };
  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center p-8 md:p-12 glass-metallic-dark rounded-3xl border border-sasori-red/20 max-w-2xl mx-auto shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-sasori-red cinema-glow-red" />
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-sasori-red/10 flex items-center justify-center mx-auto mb-6 cinema-glow-red border border-sasori-red/30">
            <CheckCircle2 className="w-8 h-8 text-sasori-red animate-pulse" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.2em] text-white mb-4">
            {t.thanks}
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-lg mx-auto">
            {t.successMsg}
          </p>
        </div>

        <div className="w-full bg-white/5 rounded-[2rem] p-8 border border-white/10">
           <BookingSystem 
             subscriberId={subscriberId}
             companyName={formData.company_name}
             email={email || ''} // We need to pass email here
             lang={lang}
           />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-12 flex justify-between items-center px-2">
        {steps.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2 group flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border ${
              currentStep >= s.id 
                ? 'bg-sasori-red border-sasori-red cinema-glow-red text-white' 
                : 'bg-white/5 border-white/10 text-white/20'
            }`}>
              {s.icon}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${
              currentStep >= s.id ? 'text-sasori-red' : 'text-white/10'
            }`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <div className="relative glass-metallic-dark rounded-3xl border border-white/5 p-8 md:p-12 shadow-2xl overflow-hiddenMin">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="relative group">
                  <span className="absolute -top-3 left-4 px-2 bg-[#090909] text-[10px] font-black uppercase tracking-widest text-sasori-red/60 z-10">
                    {t.company}
                  </span>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    placeholder="E.g. SasoriLabs"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-sasori-red/50 transition-all text-lg font-bold"
                  />
                </div>

                <div className="relative group">
                  <span className="absolute -top-3 left-4 px-2 bg-[#090909] text-[10px] font-black uppercase tracking-widest text-sasori-red/60 z-10">
                    {t.industry}
                  </span>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                    <Target className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    placeholder="E.g. Technology"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-sasori-red/50 transition-all text-lg font-bold"
                  />
                </div>
              </div>

              <Button 
                onClick={handleNext}
                disabled={!formData.company_name || !formData.industry}
                className="w-full h-16 rounded-2xl bg-sasori-red hover:bg-black text-white font-black uppercase tracking-widest gap-2 shadow-xl group"
              >
                {t.next}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="relative">
                <span className="absolute -top-3 left-4 px-2 bg-[#090909] text-[10px] font-black uppercase tracking-widest text-sasori-red/60 z-10">
                  Business Challenge
                </span>
                <textarea
                  value={formData.challenge}
                  onChange={(e) => setFormData({...formData, challenge: e.target.value})}
                  rows={6}
                  placeholder={t.challenge}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-3xl p-6 text-white placeholder:text-white/10 focus:outline-none focus:border-sasori-red/50 transition-all text-xl font-medium leading-relaxed resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleBack}
                  className="px-8 h-16 rounded-2xl border border-white/5 bg-white/[0.02] text-white/40 hover:text-white hover:border-white/10 transition-all flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <Button 
                  onClick={handleNext}
                  disabled={!formData.challenge}
                  className="flex-1 h-16 rounded-2xl bg-sasori-red hover:bg-black text-white font-black uppercase tracking-widest gap-2 shadow-xl group"
                >
                  {t.next}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h3 className="text-white/40 text-[10px] font-black uppercase tracking-widest text-center">
                  {t.budget}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {budgetRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setFormData({...formData, estimated_budget: range.value})}
                      className={`relative overflow-hidden group p-6 rounded-2xl border transition-all duration-300 text-left ${
                        formData.estimated_budget === range.value 
                          ? 'bg-sasori-red/10 border-sasori-red cinema-shadow-red' 
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-xl font-black uppercase tracking-widest ${
                          formData.estimated_budget === range.value ? 'text-sasori-red' : 'text-white/60'
                        }`}>
                          {range.label}
                        </span>
                        {formData.estimated_budget === range.value && (
                          <div className="w-2 h-2 rounded-full bg-sasori-red cinema-glow-red animate-pulse" />
                        )}
                      </div>
                      <div className={`absolute bottom-0 left-0 h-0.5 bg-sasori-red transition-all duration-500 ${
                        formData.estimated_budget === range.value ? 'w-full' : 'w-0'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleBack}
                  className="px-8 h-16 rounded-2xl border border-white/5 bg-white/[0.02] text-white/40 hover:text-white hover:border-white/10 transition-all flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!formData.estimated_budget || isSubmitting}
                  className="flex-1 h-16 rounded-2xl bg-sasori-red hover:bg-black text-white font-black uppercase tracking-widest gap-2 shadow-xl group disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t.scanning}
                    </>
                  ) : (
                    <>
                      {t.submit}
                      <ArrowRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isSubmitting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-10"
          >
            <div className="relative mb-8">
              <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-sasori-red animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-sasori-red shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
              </div>
            </div>
            <h3 className="text-xl font-black uppercase tracking-[0.3em] text-white mb-2">{t.loading}</h3>
            <p className="text-sasori-red/60 text-[10px] font-bold uppercase tracking-widest animate-pulse">{t.scanning}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
