import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useProfile, UserProfile } from '../hooks/useProfile';
import { 
  User, Settings, Bell, BookOpen, LogOut, Sparkles, Mail, CheckCircle, 
  Rocket, Clock, CreditCard, PlusCircle, AlertCircle, ChevronRight, 
  MessageSquare, FileText, Globe, Send, Calendar, Shield, Zap, Target,
  ArrowRight, ShieldCheck, Database, Layers, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SasoriLogo } from '../components/ui/sasori-logo';
import { AnimatedNavFramer } from '../components/ui/navigation-menu';
import { MorphingSquare } from '../components/ui/morphing-square';
import { ConversionFunnel } from '../components/dashboard/conversion-funnel';
import { ContactSelection } from '../components/dashboard/contact-selection';
import { cn } from '../lib/utils';

// --- Shared Types ---

type Project = {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  progress: number;
  description?: string;
  start_date: string;
};

type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_date: string;
  invoice_url?: string;
};

type Milestone = {
  id: string;
  project_id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
  description?: string;
};

type Tab = 'overview' | 'projects' | 'payments' | 'requests' | 'settings';
type Notification = { type: 'success' | 'error', message: string } | null;

// --- Components ---

/**
 * SubscriberDashboard: Focused on Conversion and Value
 * Shown to users with role 'subscriber'
 */
function SubscriberDashboard({ profile, lang, t }: { profile: UserProfile, lang: string, t: any }) {
  const navigate = useNavigate();
  const [hasSubmitted, setHasSubmitted] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSubmission = async () => {
      const { data, error } = await supabase
        .from('onboarding_submissions')
        .select('id')
        .eq('subscriber_id', profile.id)
        .maybeSingle();
      
      if (!error && data) {
        setHasSubmitted(true);
      } else {
        setHasSubmitted(false);
      }
    };
    checkSubmission();
  }, [profile.id]);

  if (hasSubmitted === null) return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-sasori-red" /></div>;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Hero Welcome */}
      {!hasSubmitted && (
        <div className="relative p-10 md:p-16 rounded-[3rem] bg-gradient-to-br from-sasori-red/8 via-white to-[#f1f1f7] border border-sasori-red/20 overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sasori-red/5 blur-[100px] -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-24 h-24 rounded-3xl bg-sasori-red/10 border border-sasori-red/20 flex items-center justify-center rotate-3 flex-shrink-0">
              <Sparkles className="w-12 h-12 text-sasori-red" />
            </div>
            <div className="text-center md:text-left space-y-4">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight italic text-[#1a1a22]">
                {lang === 'es' ? 'Tu viaje con' : 'Your journey with'} <span className="text-sasori-red">Sasori Labs</span> {lang === 'es' ? 'comienza aquí' : 'starts here'}
              </h2>
              <p className="text-[#1a1a22]/50 text-lg font-medium max-w-2xl leading-relaxed">
                {lang === 'es' 
                  ? 'Como suscriptor, estás a un paso de desbloquear el poder de la IA. Completa tu diagnóstico para empezar.' 
                  : 'As a subscriber, you are one step away from unlocking the power of AI. Complete your diagnostic to start.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {hasSubmitted ? (
        <div className="max-w-3xl mx-auto space-y-12">
           <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                 <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-widest italic text-[#1a1a22]">¡Todo listo!</h3>
              <p className="text-[#1a1a22]/40 text-sm max-w-md mx-auto uppercase tracking-widest">
                 Elige cómo prefieres continuar para agendar tu sesión técnica:
              </p>
           </div>
           
           <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-black/8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <ContactSelection 
                lang={lang}
                subscriberId={profile.id}
              />
           </div>
        </div>
      ) : (
        <ConversionFunnel 
          subscriberId={profile.id} 
          email={profile.email} 
          lang={lang} 
          onSuccess={() => setHasSubmitted(true)} 
        />
      )}
    </div>
  );
}

/**
 * ClientDashboard: Operational and Strategic
 * Shown to users with role 'client'
 */
function ClientDashboard({ profile, lang, t }: { profile: UserProfile, lang: string, t: any }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({ title: '', description: '', projectId: '', milestoneId: '' });
  const [newProjectForm, setNewProjectForm] = useState({ 
    projectName: '', sector: '', budget: '', deadline: '', description: '', callTime: '' 
  });

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: projData } = await supabase.from('projects').select('*').eq('client_id', profile.id);
      if (projData) {
        setProjects(projData as Project[]);
        if (projData.length > 0) setSelectedProjectId(projData[0].id);
      }

      const { data: mileData } = await supabase.from('milestones').select('*');
      if (mileData) setMilestones(mileData as Milestone[]);

      const { data: payData } = await supabase.from('payments').select('*').eq('client_id', profile.id);
      if (payData) setPayments(payData as Payment[]);
    };
    fetchData();
  }, [profile.id]);

  const getProjectProgress = (projId: string) => {
    const pm = milestones.filter(m => m.project_id === projId);
    if (pm.length === 0) return 0;
    const total = pm.reduce((acc, m) => acc + (m.progress || 0), 0);
    return Math.round(total / pm.length);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('change_requests').insert([{
         client_id: profile.id, 
         project_id: requestForm.projectId, 
         milestone_id: requestForm.milestoneId || null,
         title: requestForm.title, 
         description: requestForm.description, 
         status: 'open'
      }]);
      if (error) throw error;
      showNotify('success', lang === 'es' ? 'Solicitud enviada correctamente' : 'Request sent successfully');
      setIsRequestModalOpen(false);
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  const handleNewProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('project_requests').insert([{
         client_id: profile.id, 
         project_name: newProjectForm.projectName,
         sector: newProjectForm.sector,
         budget_range: newProjectForm.budget,
         deadline_goal: newProjectForm.deadline,
         description: newProjectForm.description, 
         preferred_call_time: newProjectForm.callTime,
         status: 'pending'
      }]);
      if (error) throw error;
      showNotify('success', lang === 'es' ? 'Propuesta enviada. Agendaremos tu llamada pronto.' : 'Proposal sent. We will schedule call soon.');
      setIsNewProjectModalOpen(false);
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  const tabs = [
    { id: 'overview', label: t.overview, icon: Sparkles }, 
    { id: 'projects', label: t.projects, icon: Rocket }, 
    { id: 'payments', label: t.payments, icon: CreditCard }, 
    { id: 'requests', label: t.requests, icon: MessageSquare },
    { id: 'settings', label: t.settings, icon: Settings }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={cn("fixed bottom-10 right-10 z-[500] px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 backdrop-blur-xl border", 
              notification.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-sasori-red/10 border-sasori-red/20 text-sasori-red")}
          >
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-black", notification.type === 'success' ? "bg-emerald-500/20" : "bg-sasori-red/20")}>
               {notification.type === 'success' ? '✓' : '!'}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">{notification.type}</p>
              <p className="text-sm font-bold">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12 bg-white border border-black/8 p-8 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-sasori-red/10 border border-sasori-red/20 flex items-center justify-center">
             {profile.full_name ? <span className="text-3xl font-black text-sasori-red">{profile.full_name[0]}</span> : <User className="w-10 h-10 text-sasori-red" />}
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-sasori-red mb-1">{t.member}</p>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-[#1a1a22]">{profile.full_name || t.welcome}</h1>
            <p className="text-[#1a1a22]/40 text-xs mt-1">{profile.email}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setIsNewProjectModalOpen(true)} className="px-6 py-3 bg-black/5 border border-black/10 hover:border-sasori-red text-[#1a1a22] font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all">
             SOLICITAR PROYECTO NUEVO
          </button>
          <button onClick={() => setIsRequestModalOpen(true)} className="px-6 py-3 bg-sasori-red hover:bg-[#1a1a22] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all">
            {t.newRequest}
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scroll-hide">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
            className={cn("flex flex-shrink-0 items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
              activeTab === tab.id ? "bg-sasori-red border-sasori-red text-white shadow-lg shadow-sasori-red/30" : "bg-white border-black/8 text-[#1a1a22]/50 hover:text-[#1a1a22] hover:border-black/20")}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border border-black/8 rounded-[2.5rem] p-8 shadow-sm">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#1a1a22]/40 truncate">Fases del Proyecto</h3>
                    {projects.length > 1 && (
                      <select 
                        value={selectedProjectId || ''} 
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        title="Seleccionar Proyecto"
                        className="bg-black/5 border border-black/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:border-sasori-red transition-all text-[#1a1a22]"
                      >
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    )}
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {milestones.filter(m => m.project_id === selectedProjectId).length > 0 ? 
                      milestones.filter(m => m.project_id === selectedProjectId).map(m => (
                      <div key={m.id} className="p-6 rounded-[2rem] bg-black/3 border border-black/8 group hover:border-sasori-red/30 transition-all">
                         <div className="flex justify-between items-start mb-6">
                            <div><p className="text-[9px] font-black uppercase tracking-widest text-[#1a1a22]/30 mb-1">HIT {m.id.slice(0,3)}</p><h4 className="text-lg font-black uppercase truncate text-[#1a1a22]">{m.name}</h4></div>
                            <span className={cn("text-[8px] font-black px-2 py-1 rounded-md uppercase", m.status === 'completed' ? "bg-emerald-500/10 text-emerald-600" : "bg-black/5 text-[#1a1a22]/40")}>{m.status}</span>
                         </div>
                         <div className="relative pt-4">
                            <div className="flex justify-between text-[10px] font-black mb-2 uppercase text-[#1a1a22]"><span>Progreso</span><span className={m.progress === 100 ? "text-emerald-500" : "text-sasori-red"}>{m.progress}%</span></div>
                            <div className="h-1 bg-black/8 rounded-full overflow-hidden">
                               <motion.div initial={{ width: 0 }} animate={{ width: `${m.progress}%` }} className={cn("h-full rounded-full", m.progress === 100 ? "bg-emerald-500" : "bg-sasori-red")} />
                            </div>
                         </div>
                      </div>
                    )) : <div className="col-span-2 py-20 text-center text-[#1a1a22]/20 uppercase font-black tracking-widest">Selecciona un proyecto para ver sus hitos</div>}
                 </div>
              </div>
            </div>

            <div className="bg-white border border-black/8 rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col items-center justify-center shadow-sm">
               <h3 className="text-xs font-black uppercase tracking-widest text-[#1a1a22]/40 mb-10 text-center">Total Completado</h3>
               <div className="relative w-48 h-48">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                     <circle className="text-black/8" strokeWidth="6" fill="transparent" r="42" cx="50" cy="50" />
                     <motion.circle initial={{ pathLength: 0 }} animate={{ pathLength: getProjectProgress(selectedProjectId || '') / 100 }} transition={{ duration: 1.5, ease: "easeOut" }} className="text-sasori-red" strokeWidth="6" strokeDasharray="100 100" strokeLinecap="round" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-5xl font-black text-[#1a1a22]">{getProjectProgress(selectedProjectId || '')}%</span>
                  </div>
               </div>
               <p className="mt-10 text-center text-[10px] text-[#1a1a22]/40 leading-relaxed font-black uppercase tracking-widest">
                  {getProjectProgress(selectedProjectId || '') === 100 ? '✓ Proyecto Entregado' : '⚡ Desarrollo en Curso'}
               </p>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 uppercase">
              {projects.map(p => (
                <div key={p.id} className="bg-white border border-black/8 rounded-[2.5rem] p-8 shadow-sm">
                  <h4 className="text-2xl font-black tracking-tighter mb-4 text-[#1a1a22]">{p.name}</h4>
                  <p className="text-[#1a1a22]/40 text-[10px] font-black tracking-widest mb-6">ID: {p.id.slice(0, 8)}</p>
                  <div className="flex gap-4">
                     <button className="flex-1 py-4 rounded-2xl bg-black/5 border border-black/10 text-[10px] font-black text-[#1a1a22]">DOCUMENTACIÓN</button>
                     <button className="flex-1 py-4 rounded-2xl bg-sasori-red text-white text-[10px] font-black">DETALLES</button>
                  </div>
                </div>
              ))}
           </div>
        )}

        {/* 3. PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="bg-white border border-black/8 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-[#1a1a22]">Historial de Pagos</h3>
              <button onClick={() => window.print()} className="px-4 py-2 bg-black/5 hover:bg-black/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-[#1a1a22]">
                 Imprimir Resumen Anual
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/8 text-[10px] font-black uppercase tracking-widest text-[#1a1a22]/40">
                    <th className="pb-6">ID</th><th className="pb-6">FECHA</th>
                    <th className="pb-6 text-right">MONTO</th><th className="pb-6 text-center">ESTADO</th><th className="pb-6 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {payments.length > 0 ? payments.map(p => (
                    <tr key={p.id} className="text-[#1a1a22]/80">
                      <td className="py-6 font-mono text-[10px]">#{p.id.slice(0, 8)}</td>
                      <td className="py-6 text-xs">{new Date(p.payment_date).toLocaleDateString()}</td>
                      <td className="py-6 text-right text-sm font-bold">${p.amount} <small className="text-[#1a1a22]/30 font-medium">{p.currency}</small></td>
                      <td className="py-6 text-center">
                         <span className={cn("px-2 py-1 rounded-md text-[8px] font-black uppercase", p.status === 'paid' ? "bg-emerald-500/10 text-emerald-600" : "bg-sasori-red/10 text-sasori-red")}>{p.status}</span>
                      </td>
                      <td className="py-6 text-right">
                         <button 
                           onClick={() => alert(`Generando Factura #${p.id.slice(0, 8)}...`)}
                           className="text-[9px] font-black uppercase tracking-widest text-sasori-red hover:text-[#1a1a22] transition-colors border-b border-sasori-red/30 hover:border-[#1a1a22]/30"
                         >
                           RECIBO PDF
                         </button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan={5} className="py-20 text-center text-[#1a1a22]/20 font-black uppercase">{t.noData}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. REQUESTS HISTORY */}
        {activeTab === 'requests' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white border border-black/8 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-sm">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                  <div>
                     <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 text-[#1a1a22]">Mis Solicitudes</h3>
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#1a1a22]/30 truncate">Seguimiento de ajustes y cambios de hitos</p>
                  </div>
                  <button onClick={() => setIsRequestModalOpen(true)} className="px-6 py-4 bg-sasori-red text-white text-[10px] font-black rounded-[1.2rem] hover:bg-[#1a1a22] transition-all shadow-xl shadow-sasori-red/20">
                     + NUEVA SOLICITUD
                  </button>
               </div>
               
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-black/8 text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a22]/30">
                        <th className="pb-6 pl-4">Ticket / Asunto</th>
                        <th className="pb-6">Asociado a</th>
                        <th className="pb-6 text-center">Estado</th>
                        <th className="pb-6 text-right pr-4">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      <tr className="group hover:bg-black/[0.02] transition-colors">
                        <td className="py-8 pl-4">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-sasori-red/10 flex items-center justify-center text-sasori-red font-black text-xs">#01</div>
                              <div>
                                 <p className="text-xs font-black uppercase mb-1 tracking-tight text-[#1a1a22]">Análisis Inicial de Proyecto</p>
                                 <p className="text-[8px] font-mono text-[#1a1a22]/30">REF: SYNC-PRO</p>
                              </div>
                           </div>
                        </td>
                        <td className="py-8">
                           <p className="text-[10px] font-black uppercase mb-1 text-[#1a1a22]">General</p>
                        </td>
                        <td className="py-8 text-center">
                           <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-lg text-[8px] font-black uppercase tracking-widest">ACTIVA</span>
                        </td>
                        <td className="py-8 text-right pr-4">
                           <button className="text-[10px] font-black text-[#1a1a22]/40 hover:text-sasori-red transition-all underline underline-offset-4 decoration-sasori-red/30">DETALLES →</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* MODALS (Simplified for brevity, but kept in ClientDashboard) */}
      <AnimatePresence>
        {isRequestModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsRequestModalOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white border border-black/10 rounded-[3rem] p-10 md:p-14 shadow-[0_30px_80px_rgba(0,0,0,0.15)]"
            >
              <form onSubmit={handleRequestSubmit} className="space-y-6 text-[#1a1a22] text-left">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1a1a22]">Nueva Solicitud</h2>
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-widest text-[#1a1a22]/40 ml-2">Asunto</label>
                   <input type="text" placeholder="Asunto de la solicitud" title="Asunto" required className="w-full bg-black/5 border border-black/10 rounded-2xl p-5 text-sm font-bold outline-none focus:border-sasori-red transition-all text-[#1a1a22]" onChange={e => setRequestForm({...requestForm, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-widest text-[#1a1a22]/40 ml-2">Descripción</label>
                   <textarea required rows={4} placeholder="Escribe aquí los detalles de tu solicitud..." title="Descripción" className="w-full bg-black/5 border border-black/10 rounded-2xl p-5 text-sm font-bold resize-none outline-none focus:border-sasori-red transition-all text-[#1a1a22]" onChange={e => setRequestForm({...requestForm, description: e.target.value})} />
                </div>
                <button type="submit" className="w-full py-5 bg-sasori-red text-white font-black uppercase tracking-[0.2em] rounded-2xl">PROCESAR →</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Main Page Component ---

export function UserAccountPage({ lang = 'es' }: { lang?: string }) {
  const navigate = useNavigate();
  const { profile, loading, role, error } = useProfile();

  useEffect(() => {
    if (!loading && !profile) {
      navigate('/login');
    }
  }, [loading, profile, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const t = (({
    es: {
      welcome: 'Bienvenido', member: role === 'client' ? 'CLIENTE PREFERENTE' : 'SUSCRIPTOR', 
      overview: 'Panel', projects: 'Proyectos',
      payments: 'Finanzas', requests: 'Solicitudes', settings: 'Ajustes', logout: 'Cerrar Sesión',
      memberSince: 'Miembro desde', activeProjects: 'Proyectos Activos', latestPayments: 'Últimos Pagos',
      newRequest: 'PEDIR CAMBIO', noData: 'No hay datos disponibles',
    },
    en: {
      welcome: 'Welcome', member: role === 'client' ? 'PREFERRED CLIENT' : 'SUBSCRIBER', 
      overview: 'Dashboard', projects: 'Projects',
      payments: 'Finances', requests: 'Requests', settings: 'Settings', logout: 'Log Out',
      memberSince: 'Member since', activeProjects: 'Active Projects', latestPayments: 'Latest Payments',
      newRequest: 'REQUEST CHANGE', noData: 'No data available',
    },
  } as any)[lang] || {
    welcome: 'Welcome', member: 'MEMBER', overview: 'Panel', projects: 'Projects', 
    payments: 'Finances', requests: 'Requests', settings: 'Settings', logout: 'Log Out',
    memberSince: 'Since', noData: 'No data'
  });

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#f1f1f7] flex flex-col items-center justify-center">
        <MorphingSquare message="Sincronizando Sasori Node..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f1f1f7] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000">
         <div className="w-20 h-20 rounded-full bg-sasori-red/10 border border-sasori-red/30 flex items-center justify-center mb-10">
            <AlertCircle className="w-10 h-10 text-sasori-red" />
         </div>
         <h2 className="text-4xl font-black uppercase tracking-widest text-[#1a1a22] mb-6 italic">Acceso Denegado</h2>
         <p className="text-[#1a1a22]/50 max-w-lg mb-12 text-sm font-medium leading-relaxed uppercase tracking-widest">
            {error.message || 'No se pudo sincronizar el nodo de usuario. La firma digital no ha sido validada en los servidores de SasoriLabs.'}
         </p>
         <div className="flex flex-col sm:flex-row gap-4">
           <button 
             onClick={() => window.location.reload()} 
             className="px-10 py-5 bg-sasori-red text-white font-black uppercase rounded-[1.5rem] shadow-2xl shadow-sasori-red/20 hover:scale-105 transition-transform"
           >
             REPATRIAR SESIÓN
           </button>
           <button 
             onClick={() => navigate('/')} 
             className="px-10 py-5 bg-white border border-black/10 text-[#1a1a22] font-black uppercase rounded-[1.5rem] hover:bg-black/5 transition-all"
           >
             REGRESAR AL INICIO
           </button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f1f7] text-[#1a1a22] font-sans overflow-x-hidden">
      <AnimatedNavFramer lang={lang} />

      <main className="pt-32 px-4 md:px-8 max-w-7xl mx-auto pb-20 text-center md:text-left">
        
        {/* Universal Sub-Header for Auth Users */}
        <div className="mb-10 flex justify-between items-center px-4">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1a1a22]/30">Secure Session Active</span>
           </div>
           <button 
             onClick={handleLogout} 
             className="px-4 py-2 rounded-full border border-black/8 bg-white text-[10px] font-black uppercase tracking-widest text-[#1a1a22]/40 hover:text-sasori-red hover:border-sasori-red/20 hover:bg-sasori-red/5 flex items-center gap-2 transition-all group"
           >
              <LogOut className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" /> 
              {t.logout}
           </button>
        </div>

        {role === 'client' ? (
          <ClientDashboard profile={profile} lang={lang} t={t} />
        ) : (
          <SubscriberDashboard profile={profile} lang={lang} t={t} />
        )}

      </main>
    </div>
  );
}
