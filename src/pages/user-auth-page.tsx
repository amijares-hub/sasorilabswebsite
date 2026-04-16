import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff, Sparkles } from 'lucide-react';
import { BackgroundPaths } from '../components/ui/background-paths';
import { SasoriLogo } from '../components/ui/sasori-logo';
import { Footer } from '../components/ui/footer';
import { cn } from '../lib/utils';
import { SITE_CONFIG } from '../config/site-config';

const dict: Record<string, any> = {
  es: {
    loginTitle: 'Mi Cuenta',
    loginSub: 'Accede a tu biblioteca de contenido exclusivo',
    signupTitle: 'Crear Cuenta',
    signupSub: 'Únete a la comunidad SasoriLabs',
    emailLabel: 'CORREO ELECTRÓNICO',
    passwordLabel: 'CONTRASEÑA',
    nameLabel: 'NOMBRE COMPLETO',
    loginCta: 'INICIAR SESIÓN',
    signupCta: 'CREAR CUENTA',
    noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?',
    switchToSignup: 'Regístrate gratis',
    switchToLogin: 'Inicia sesión',
    logging: 'AUTENTICANDO...',
    signingUp: 'CREANDO CUENTA...',
    forgotPass: '¿Olvidaste tu contraseña?',
    backHome: '← Volver al inicio',
    benefit1: 'Contenido exclusivo de IA y tecnología',
    benefit2: 'Newsletter personalizada a tu interés',
    benefit3: 'Acceso anticipado a nuevos servicios',
    resetTitle: 'Recuperar Contraseña',
    resetBody: 'Te enviaremos un link para resetear tu contraseña.',
    resetCta: 'ENVIAR LINK',
    resetSent: '¡Link enviado! Revisa tu email.',
    resetBack: 'Volver al login',
  },
  en: {
    loginTitle: 'My Account',
    loginSub: 'Access your exclusive content library',
    signupTitle: 'Create Account',
    signupSub: 'Join the SasoriLabs community',
    emailLabel: 'EMAIL ADDRESS',
    passwordLabel: 'PASSWORD',
    nameLabel: 'FULL NAME',
    loginCta: 'SIGN IN',
    signupCta: 'CREATE ACCOUNT',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    switchToSignup: 'Sign up free',
    switchToLogin: 'Sign in',
    logging: 'AUTHENTICATING...',
    signingUp: 'CREATING ACCOUNT...',
    forgotPass: 'Forgot your password?',
    backHome: '← Back to homepage',
    benefit1: 'Exclusive AI & technology content',
    benefit2: 'Personalized newsletter',
    benefit3: 'Early access to new services',
    resetTitle: 'Reset Password',
    resetBody: "We'll send you a link to reset your password.",
    resetCta: 'SEND LINK',
    resetSent: 'Link sent! Check your email.',
    resetBack: 'Back to login',
  },
};

type AuthMode = 'login' | 'signup' | 'forgot';

export function UserAuthPage({ lang = 'es' }: { lang?: string }) {
  const navigate = useNavigate();
  const t = dict[lang] || dict.es;

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/mi-cuenta');
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/mi-cuenta');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Also add them to the newsletter subscribers table
    try {
      await supabase.from('subscribers').upsert([{
        email: email.toLowerCase().trim(),
        name: fullName.trim() || null,
        lang,
        source: 'account_signup',
        status: 'active',
        confirmed: true,
      }], { onConflict: 'email' });
    } catch (_) {}

    // Send welcome email
    const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`;
    try {
      await fetch(fnUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: 'welcome',
          to: email,
          name: fullName,
          lang,
          unsubscribeToken: '',
          from: SITE_CONFIG.emails.notifications,
        }),
      });
    } catch (_) {}

    navigate('/mi-cuenta');
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(t.resetSent);
    }
    setLoading(false);
  };

  const benefits = [t.benefit1, t.benefit2, t.benefit3];

  return (
    <div className="min-h-screen bg-bg-dark text-white flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <BackgroundPaths title="" />
      </div>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0" />

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10 md:py-20">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
          
          {/* Left Panel - Branding */}
          <div className="hidden lg:flex flex-col justify-between bg-[#0a0a0a] p-5 sm:p-8 md:p-12 border-r border-white/5 relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-sasori-red/10 blur-[100px] rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-sasori-red/5 blur-[80px] rounded-full" />
            
            <div className="relative z-10">
              <SasoriLogo className="w-10 h-10 text-sasori-red mb-8" />
              <h1 className="text-4xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
                {mode === 'login' ? t.loginTitle : 
                 mode === 'signup' ? t.signupTitle : t.resetTitle}
              </h1>
              <p className="text-white/40 text-sm leading-relaxed">
                {mode === 'login' ? t.loginSub : 
                 mode === 'signup' ? t.signupSub : t.resetBody}
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-sasori-red/10 border border-sasori-red/30 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-2.5 h-2.5 text-sasori-red" />
                  </div>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wider">{b}</p>
                </div>
              ))}
            </div>

            <p className="relative z-10 text-white/10 text-[10px] uppercase tracking-widest">
              © 2026 SASORILABS
            </p>
          </div>

          {/* Right Panel - Form */}
          <div className="bg-[#080808] p-8 md:p-12">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <SasoriLogo className="w-7 h-7 text-sasori-red" />
              <span className="text-lg font-black uppercase tracking-tighter">SasoriLabs</span>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400 text-xs tracking-wider">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-400 text-xs tracking-wider">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>{success}</p>
              </div>
            )}

            {/* ── LOGIN FORM ── */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest uppercase text-white/40 pl-4">{t.emailLabel}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-sasori-red/50 transition-colors text-sm"
                      placeholder="email@ejemplo.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest uppercase text-white/40 pl-4">{t.passwordLabel}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-white/20 focus:outline-none focus:border-sasori-red/50 transition-colors text-sm"
                      placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={() => setMode('forgot')}
                    className="text-[10px] uppercase font-bold tracking-widest text-white/30 hover:text-white/60 transition-colors">
                    {t.forgotPass}
                  </button>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full mt-2 bg-sasori-red hover:bg-white text-white hover:text-sasori-red font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(226,6,19,0.3)] flex items-center justify-center gap-2 group disabled:opacity-50">
                  {loading ? t.logging : <>{t.loginCta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                </button>
                <p className="text-center text-[11px] text-white/30 pt-2">
                  {t.noAccount}{' '}
                  <button type="button" onClick={() => { setMode('signup'); setError(null); }}
                    className="text-sasori-red hover:text-white font-bold transition-colors">{t.switchToSignup}
                  </button>
                </p>
              </form>
            )}

            {/* ── SIGNUP FORM ── */}
            {mode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest uppercase text-white/40 pl-4">{t.nameLabel}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-sasori-red/50 transition-colors text-sm"
                      placeholder="Juan García" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest uppercase text-white/40 pl-4">{t.emailLabel}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-sasori-red/50 transition-colors text-sm"
                      placeholder="email@ejemplo.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest uppercase text-white/40 pl-4">{t.passwordLabel}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type={showPassword ? 'text' : 'password'} required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-white/20 focus:outline-none focus:border-sasori-red/50 transition-colors text-sm"
                      placeholder="Mínimo 6 caracteres" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-sasori-red hover:bg-white text-white hover:text-sasori-red font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(226,6,19,0.3)] flex items-center justify-center gap-2 group disabled:opacity-50">
                  {loading ? t.signingUp : <>{t.signupCta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                </button>
                <p className="text-center text-[11px] text-white/30 pt-2">
                  {t.hasAccount}{' '}
                  <button type="button" onClick={() => { setMode('login'); setError(null); }}
                    className="text-sasori-red hover:text-white font-bold transition-colors">{t.switchToLogin}
                  </button>
                </p>
              </form>
            )}

            {/* ── FORGOT PASSWORD FORM ── */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">{t.resetTitle}</h2>
                  <p className="text-white/40 text-sm">{t.resetBody}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest uppercase text-white/40 pl-4">{t.emailLabel}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-sasori-red/50 transition-colors text-sm"
                      placeholder="email@ejemplo.com" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-sasori-red hover:bg-white text-white hover:text-sasori-red font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? '...' : t.resetCta}
                </button>
                <button type="button" onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                  className="w-full text-[10px] uppercase font-bold tracking-widest text-white/30 hover:text-white/60 transition-colors py-2">
                  {t.resetBack}
                </button>
              </form>
            )}

            {/* Back to home */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <button onClick={() => navigate('/')}
                className="text-[10px] uppercase font-bold tracking-widest text-white/20 hover:text-white/50 transition-colors">
                {t.backHome}
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer lang={lang} />
      </div>
    </div>
  );
}
