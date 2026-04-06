import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { SasoriLogo } from '../components/ui/sasori-logo';
import { BackgroundPaths } from '../components/ui/background-paths';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export function LoginPage({ lang = 'es' }: { lang?: string }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.session) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <BackgroundPaths title={lang === 'es' ? "ADMINISTRACIÓN" : "ADMINISTRATION"} />
      </div>
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm z-0" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-[#EDEDED] rounded-xl border border-black/10 shadow-[inset_-2px_-2px_10px_rgba(255,255,255,0.8),inset_2px_2px_10px_rgba(0,0,0,0.05),0_40px_80px_rgba(0,0,0,0.1)] group">
        {/* Metallic brushed grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />

        {/* Red Tech Strip */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-sasori-red shadow-[0_0_15px_#E20613] z-10" />

        <div className="flex flex-col items-center mb-10">
          <SasoriLogo className="w-16 h-16 text-sasori-red mb-6" />
          <h1 className="text-3xl font-black uppercase tracking-tighter text-[#1A1A1A] font-display">
            Sasori <span className="text-sasori-red">Admin</span>
          </h1>
          <p className="text-black/40 text-sm tracking-widest uppercase mt-2">
            Restricted Access
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-xs tracking-wider uppercase">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest uppercase text-black/50 pl-4">
              {lang === 'es' ? 'CORREO ELECTRÓNICO' : 'EMAIL ADDRESS'}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-xl py-4 pl-12 pr-4 text-[#1A1A1A] placeholder-black/20 focus:outline-none focus:border-sasori-red transition-colors shadow-[inset_1px_1px_4px_rgba(0,0,0,0.05)]"
                placeholder="admin@sasorilabs.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest uppercase text-black/50 pl-4">
              {lang === 'es' ? 'CONTRASEÑA' : 'PASSWORD'}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-xl py-4 pl-12 pr-4 text-[#1A1A1A] placeholder-black/20 focus:outline-none focus:border-sasori-red transition-colors shadow-[inset_1px_1px_4px_rgba(0,0,0,0.05)]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" defaultChecked className="accent-sasori-red w-4 h-4 rounded border-black/10 bg-white" />
              <span className="text-[10px] font-black tracking-widest uppercase text-black/30 group-hover:text-black/60 transition-colors">Mantener sesión (3h)</span>
            </label>
            <span className="text-[8px] font-black tracking-widest uppercase text-sasori-red/50 animate-pulse">SISTEMA SEGURO</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-sasori-red hover:bg-white text-white hover:text-sasori-red font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(226,6,19,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (lang === 'es' ? 'AUTENTICANDO...' : 'AUTHENTICATING...') : (lang === 'es' ? 'INGRESAR AL SISTEMA' : 'ENTER SYSTEM')}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-black/10 pt-6">
           <button onClick={() => navigate('/')} className="text-[10px] uppercase font-bold tracking-widest text-black/30 hover:text-black transition-colors">
              &larr; Volver al Inicio
           </button>
        </div>
      </div>
    </div>
  );
}
