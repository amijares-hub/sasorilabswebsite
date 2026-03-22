import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { SasoriLogo } from '../components/ui/sasori-logo';

export function UnsubscribePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    const processUnsubscribe = async () => {
      try {
        const { data: subscriber, error: fetchError } = await supabase
          .from('subscribers')
          .select('id, status')
          .eq('unsubscribe_token', token)
          .single();

        if (fetchError || !subscriber) {
          setStatus('invalid');
          return;
        }

        if (subscriber.status === 'unsubscribed') {
          setStatus('success'); // Already unsubscribed
          return;
        }

        const { error: updateError } = await supabase
          .from('subscribers')
          .update({ status: 'unsubscribed' })
          .eq('unsubscribe_token', token);

        if (updateError) {
          throw updateError;
        }

        setStatus('success');
      } catch (err) {
        console.error('Error unsubscribing:', err);
        setStatus('error');
      }
    };

    processUnsubscribe();
  }, [token]);

  return (
    <div className="min-h-screen bg-bg-dark text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#080808] p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.8)] text-center relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-sasori-red/10 blur-[80px] rounded-full pointer-events-none" />
        
        <SasoriLogo className="w-12 h-12 text-sasori-red mx-auto mb-8 relative z-10" />

        <div className="relative z-10">
          {status === 'loading' && (
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-sasori-red rounded-full animate-spin mb-4" />
              <p className="text-sm font-black uppercase tracking-widest text-white/50">Procesando...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="animate-in zoom-in duration-300">
              <CheckCircle className="w-16 h-16 text-sasori-red mx-auto mb-6" />
              <h1 className="text-2xl font-black uppercase tracking-tighter mb-4">Suscripción Cancelada</h1>
              <p className="text-white/50 text-sm mb-8 leading-relaxed">
                Has sido dado de baja de la newsletter correctamente. Ya no recibirás más correos de nuestras campañas.
              </p>
            </div>
          )}

          {status === 'invalid' && (
            <div className="animate-in zoom-in duration-300">
              <AlertCircle className="w-16 h-16 text-white/20 mx-auto mb-6" />
              <h1 className="text-2xl font-black uppercase tracking-tighter mb-4">Enlace Inválido</h1>
              <p className="text-white/50 text-sm mb-8 leading-relaxed">
                El enlace que has utilizado no es válido o ha expirado.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="animate-in zoom-in duration-300">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h1 className="text-2xl font-black uppercase tracking-tighter mb-4">Error Inesperado</h1>
              <p className="text-white/50 text-sm mb-8 leading-relaxed">
                Hubo un problema procesando tu solicitud. Por favor intenta de nuevo más tarde.
              </p>
            </div>
          )}

          {status !== 'loading' && (
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Inicio
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
