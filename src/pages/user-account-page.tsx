import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { User, Settings, Bell, BookOpen, LogOut, Sparkles, Mail, CheckCircle } from 'lucide-react';
import { SasoriLogo } from '../components/ui/sasori-logo';
import { Footer } from '../components/ui/footer';
import { AnimatedNavFramer } from '../components/ui/navigation-menu';
import { MorphingSquare } from '../components/ui/morphing-square';

type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  created_at?: string;
};

export function UserAccountPage({ lang = 'es' }: { lang?: string }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'newsletter' | 'settings'>('overview');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser({
        id: session.user.id,
        email: session.user.email!,
        full_name: session.user.user_metadata?.full_name,
        created_at: session.user.created_at,
      });

      // Check if in newsletter
      const { data } = await supabase
        .from('subscribers')
        .select('id, status')
        .eq('email', session.user.email!)
        .eq('status', 'active')
        .single();
      setSubscribed(!!data);
      setLoading(false);
    };
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleUnsubscribe = async () => {
    if (!user) return;
    await supabase.from('subscribers').update({ status: 'unsubscribed' }).eq('email', user.email);
    setSubscribed(false);
  };

  const handleSubscribe = async () => {
    if (!user) return;
    await supabase.from('subscribers').upsert([{
      email: user.email,
      name: user.full_name,
      lang,
      source: 'account_page',
      status: 'active',
      confirmed: true,
    }], { onConflict: 'email' });
    setSubscribed(true);
  };

  const t = {
    es: {
      welcome: 'Bienvenido',
      member: 'MIEMBRO SASORILABS',
      overview: 'Panel',
      newsletter: 'Newsletter',
      settings: 'Ajustes',
      logout: 'Cerrar Sesión',
      memberSince: 'Miembro desde',
      newsletterTitle: 'Gestión de Newsletter',
      subscribedMsg: 'Estás suscrito a nuestra newsletter. Recibirás las últimas novedades.',
      unsubscribedMsg: 'No estás suscrito a la newsletter.',
      unsubscribeCta: 'CANCELAR SUSCRIPCIÓN',
      subscribeCta: 'SUSCRIBIRME',
      settingsTitle: 'Información de Cuenta',
      emailLabel: 'Email',
      nameLabel: 'Nombre',
      notProvided: 'No especificado',
    },
    en: {
      welcome: 'Welcome',
      member: 'SASORILABS MEMBER',
      overview: 'Dashboard',
      newsletter: 'Newsletter',
      settings: 'Settings',
      logout: 'Log Out',
      memberSince: 'Member since',
      newsletterTitle: 'Newsletter Management',
      subscribedMsg: 'You are subscribed to our newsletter. You will receive the latest news.',
      unsubscribedMsg: 'You are not subscribed to the newsletter.',
      unsubscribeCta: 'UNSUBSCRIBE',
      subscribeCta: 'SUBSCRIBE',
      settingsTitle: 'Account Information',
      emailLabel: 'Email',
      nameLabel: 'Name',
      notProvided: 'Not specified',
    },
  }[lang as 'es'|'en'] || {
    welcome: 'Welcome', member: 'SASORILABS MEMBER', overview: 'Dashboard',
    newsletter: 'Newsletter', settings: 'Settings', logout: 'Log Out',
    memberSince: 'Member since', newsletterTitle: 'Newsletter Management',
    subscribedMsg: 'You are subscribed.', unsubscribedMsg: 'Not subscribed.',
    unsubscribeCta: 'UNSUBSCRIBE', subscribeCta: 'SUBSCRIBE',
    settingsTitle: 'Account Info', emailLabel: 'Email', nameLabel: 'Name',
    notProvided: 'Not specified',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <MorphingSquare message="Verificando Acceso..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <AnimatedNavFramer lang={lang} />

      <main className="pt-28 px-4 md:px-8 max-w-5xl mx-auto pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-sasori-red/10 border border-sasori-red/20 flex items-center justify-center">
              <User className="w-8 h-8 text-sasori-red" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-sasori-red mb-1">{t.member}</p>
              <h1 className="text-2xl font-black uppercase tracking-tighter">
                {t.welcome}{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}
              </h1>
              <p className="text-white/40 text-xs mt-1">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4" />
            {t.logout}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/5 pb-4">
          {[
            { id: 'overview', label: t.overview, icon: Sparkles },
            { id: 'newsletter', label: t.newsletter, icon: Mail },
            { id: 'settings', label: t.settings, icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-sasori-red text-white shadow-[0_0_20px_rgba(226,6,19,0.3)]'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-white/40 mb-6">Estado</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-white/70">Cuenta activa y verificada</span>
                </div>
                <div className="flex items-center gap-3">
                  {subscribed
                    ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                    : <Mail className="w-5 h-5 text-white/20" />}
                  <span className="text-sm text-white/70">
                    Newsletter: {subscribed ? 'Suscrito ✓' : 'No suscrito'}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <SasoriLogo className="w-10 h-10 text-sasori-red mb-4" />
              <p className="text-[9px] uppercase font-black tracking-widest text-white/30">
                {t.memberSince}
              </p>
              <p className="font-black text-lg mt-1">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'newsletter' && (
          <div className="max-w-2xl">
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-white/40 mb-6">{t.newsletterTitle}</h2>
              
              <div className={`p-6 rounded-2xl border mb-6 flex items-center gap-4 ${
                subscribed
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : 'bg-white/5 border-white/10'
              }`}>
                {subscribed
                  ? <CheckCircle className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                  : <Mail className="w-8 h-8 text-white/20 flex-shrink-0" />}
                <div>
                  <p className={`font-black text-sm uppercase tracking-wider ${subscribed ? 'text-emerald-400' : 'text-white/50'}`}>
                    {subscribed ? '✓ Suscrito' : 'No suscrito'}
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    {subscribed ? t.subscribedMsg : t.unsubscribedMsg}
                  </p>
                </div>
              </div>

              {subscribed ? (
                <button
                  onClick={handleUnsubscribe}
                  className="px-6 py-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-xs font-black uppercase tracking-widest rounded-2xl text-white/50 hover:text-red-400 transition-all"
                >
                  {t.unsubscribeCta}
                </button>
              ) : (
                <button
                  onClick={handleSubscribe}
                  className="px-6 py-3 bg-sasori-red hover:bg-white text-white hover:text-sasori-red font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(226,6,19,0.3)]"
                >
                  {t.subscribeCta}
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-white/40">{t.settingsTitle}</h2>
              {[
                { label: t.emailLabel, value: user?.email },
                { label: t.nameLabel, value: user?.full_name || t.notProvided },
              ].map(field => (
                <div key={field.label} className="border-b border-white/5 pb-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">{field.label}</p>
                  <p className="text-white/70 font-medium text-sm">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer lang={lang} />
    </div>
  );
}
