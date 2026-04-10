import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, ArrowRight, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { SITE_CONFIG } from '../../config/site-config';

interface NewsletterPopupProps {
  lang?: string;
}

const POPUP_DELAY_MS = 8000;     // Show after 8 seconds
const POPUP_SHOWN_KEY = 'sasori_newsletter_shown';
const POPUP_SUBSCRIBED_KEY = 'sasori_newsletter_subscribed';

const dict: Record<string, any> = {
  es: {
    badge: 'Newsletter Exclusiva',
    headline: 'ÚNETE A LA REVOLUCIÓN',
    subheadline: 'DIGITAL',
    body: 'Recibe las últimas novedades en IA, diseño inmersivo y estrategia digital directamente en tu bandeja de entrada.',
    namePlaceholder: 'Tu nombre (opcional)',
    emailPlaceholder: 'tu@email.com',
    cta: 'SUSCRIBIRME GRATIS',
    sending: 'PROCESANDO...',
    successTitle: '¡Bienvenido al futuro!',
    successBody: `Te hemos enviado un email de bienvenida desde ${SITE_CONFIG.emails.notifications}. Prepárate para lo extraordinario.`,
    error: 'Error al suscribirse. Inténtalo de nuevo.',
    already: 'Este email ya está suscrito.',
    noSpam: 'Sin spam. Cancela cuando quieras.',
  },
  en: {
    badge: 'Exclusive Newsletter',
    headline: 'JOIN THE DIGITAL',
    subheadline: 'REVOLUTION',
    body: 'Get the latest in AI, immersive design, and digital strategy delivered straight to your inbox.',
    namePlaceholder: 'Your name (optional)',
    emailPlaceholder: 'your@email.com',
    cta: 'SUBSCRIBE FREE',
    sending: 'PROCESSING...',
    successTitle: 'Welcome to the future!',
    successBody: `We sent you a welcome email from ${SITE_CONFIG.emails.notifications}. Get ready for the extraordinary.`,
    error: 'Subscription failed. Please try again.',
    already: 'This email is already subscribed.',
    noSpam: 'No spam. Unsubscribe anytime.',
  },
};

export function NewsletterPopup({ lang = 'es' }: NewsletterPopupProps) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const t = dict[lang] || dict.es;

  useEffect(() => {
    const alreadySubscribed = localStorage.getItem(POPUP_SUBSCRIBED_KEY);
    const alreadyShown = sessionStorage.getItem(POPUP_SHOWN_KEY);

    if (alreadySubscribed || alreadyShown) return;

    timerRef.current = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(POPUP_SHOWN_KEY, 'true');
    }, POPUP_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');
    setErrorMsg('');

    try {
      // 1. Insert subscriber into Supabase
      const { data: existing } = await supabase
        .from('subscribers')
        .select('id, status')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (existing) {
        setErrorMsg(t.already);
        setStatus('error');
        return;
      }

      const { data: subscriber, error: insertError } = await supabase
        .from('subscribers')
        .insert([{
          email: email.toLowerCase().trim(),
          name: name.trim() || null,
          lang,
          source: 'website_popup',
          status: 'active',
          confirmed: true,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // 2. Send welcome email via Edge Function
      const siteUrl = import.meta.env.VITE_SUPABASE_URL?.replace('supabase.co', 'supabase.co') ?? '';
      const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`;
      
      await fetch(fnUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: 'welcome',
          to: email.toLowerCase().trim(),
          name: name.trim() || '',
          lang,
          unsubscribeToken: subscriber?.unsubscribe_token || '',
          from: SITE_CONFIG.emails.notifications,
        }),
      });

      // 3. Mark as subscribed in localStorage so popup never shows again
      localStorage.setItem(POPUP_SUBSCRIBED_KEY, 'true');
      setStatus('success');

    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      setErrorMsg(t.error);
      setStatus('error');
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-lg pointer-events-auto rounded-xl border border-white/10 overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)] metallic-vinotinto-card">
              {/* Metallic brushed grain overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
              
              {/* Red Tech Strip */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-sasori-red shadow-[0_0_15px_#E20613] z-10" />
              
              
              {/* White ambient glow */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 blur-[60px] rounded-full pointer-events-none" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 z-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
              >
                <X className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
              </button>

              <div className="relative p-8 md:p-10">
                {status !== 'success' ? (
                  <>
                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles className="w-3 h-3 text-white" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">
                        {t.badge}
                      </span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-2">
                      {t.headline}
                    </h2>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] text-white/60 mb-6">
                      {t.subheadline}
                    </h2>

                    <p className="text-white/60 text-sm leading-relaxed mb-8">
                      {t.body}
                    </p>

                    <form onSubmit={handleSubscribe} className="space-y-3">
                      {/* Name field */}
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder={t.namePlaceholder}
                          className="w-full bg-white/10 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/50 transition-colors shadow-[inset_1px_1px_4px_rgba(0,0,0,0.2)]"
                        />
                      </div>

                      {/* Email field */}
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder={t.emailPlaceholder}
                          className="w-full bg-white/10 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/50 transition-colors shadow-[inset_1px_1px_4px_rgba(0,0,0,0.2)]"
                        />
                      </div>

                      {/* Error message */}
                      {status === 'error' && errorMsg && (
                        <div className="flex items-center gap-2 text-red-400 text-xs py-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      {/* CTA Button */}
                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="w-full py-4 bg-sasori-red hover:bg-[#1A1A1A] text-white transition-all duration-300 rounded-xl shadow-[0_0_30px_rgba(226,6,19,0.3)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-black tracking-[0.25em] uppercase hover:-translate-y-0.5"
                      >
                        {status === 'sending' ? (
                          <span className="animate-pulse">{t.sending}</span>
                        ) : (
                          <>
                            {t.cta}
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-center text-[10px] text-black/20 uppercase tracking-widest mt-4">
                      {t.noSpam}
                    </p>
                  </>
                ) : (
                  /* SUCCESS STATE */
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-3 text-white">
                      {t.successTitle}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-8">
                      {t.successBody}
                    </p>
                    <button
                      onClick={handleClose}
                      className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors text-white"
                    >
                      ✓ OK
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Inline widget (for embedding in pages) ──────────────────
export function NewsletterInline({ lang = 'es' }: { lang?: string }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const t = dict[lang] || dict.es;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');
    setErrorMsg('');

    try {
      const { data: existing } = await supabase
        .from('subscribers')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (existing) {
        setErrorMsg(t.already);
        setStatus('error');
        return;
      }

      const { data: subscriber, error: insertError } = await supabase
        .from('subscribers')
        .insert([{
          email: email.toLowerCase().trim(),
          name: name.trim() || null,
          lang,
          source: 'inline_form',
          status: 'active',
          confirmed: true,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`;
      await fetch(fnUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: 'welcome',
          to: email.toLowerCase().trim(),
          name: name.trim() || '',
          lang,
          unsubscribeToken: subscriber?.unsubscribe_token || '',
          from: SITE_CONFIG.emails.notifications,
        }),
      });

      localStorage.setItem(POPUP_SUBSCRIBED_KEY, 'true');
      setStatus('success');
    } catch (err: any) {
      setErrorMsg(t.error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center text-[#1A1A1A]">
        <CheckCircle className="w-10 h-10 text-emerald-500" />
        <p className="font-black uppercase tracking-tighter text-xl">{t.successTitle}</p>
        <p className="text-black/50 text-sm max-w-xs">{t.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full max-w-xl mx-auto">
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder={t.emailPlaceholder}
        className="flex-1 bg-white border border-black/10 rounded-xl py-4 px-5 text-sm text-[#1A1A1A] placeholder-black/30 focus:outline-none focus:border-sasori-red/50 transition-colors shadow-[inset_1px_1px_4px_rgba(0,0,0,0.05)]"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="px-8 py-4 bg-sasori-red hover:bg-[#1A1A1A] text-white font-black text-[10px] tracking-[0.25em] uppercase rounded-xl transition-all duration-300 whitespace-nowrap disabled:opacity-60 shadow-[0_10px_20px_rgba(226,6,19,0.2)] hover:-translate-y-0.5"
      >
        {status === 'sending' ? '...' : t.cta}
      </button>
    </form>
  );
}
