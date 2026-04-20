import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useProfile, UserProfile } from '../hooks/useProfile';
import { 
  User, Settings, Bell, BookOpen, LogOut, Sparkles, Mail, CheckCircle, 
  Rocket, Clock, CreditCard, PlusCircle, AlertCircle, ChevronRight, 
  MessageSquare, FileText, Globe, Send, Calendar, Shield, Zap, Target,
  ArrowRight, ShieldCheck, Database, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SasoriLogo } from '../components/ui/sasori-logo';
import { Footer } from '../components/ui/footer';
import { AnimatedNavFramer } from '../components/ui/navigation-menu';
import { MorphingSquare } from '../components/ui/morphing-square';
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
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Hero Welcome */}
      <div className="relative p-10 md:p-16 rounded-[3rem] bg-gradient-to-br from-sasori-red/10 via-zinc-900 to-black border border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sasori-red/5 blur-[100px] -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-24 h-24 rounded-3xl bg-sasori-red/20 border border-sasori-red/30 flex items-center justify-center rotate-3 flex-shrink-0">
            <Sparkles className="w-12 h-12 text-sasori-red" />
          </div>
          <div className="text-center md:text-left space-y-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight italic">
              {lang === 'es' ? 'Tu viaje con' : 'Your journey with'} <span className="text-sasori-red">Sasori Labs</span> {lang === 'es' ? 'comienza aquí' : 'starts here'}
            </h2>
            <p className="text-zinc-400 text-lg font-medium max-w-2xl leading-relaxed">
              {lang === 'es' 
                ? 'Como suscriptor, tienes acceso a nuestro contenido exclusivo y actualizaciones anticipadas. Estamos listos para elevar tu negocio con IA cuando tú lo estés.' 
                : 'As a subscriber, you have access to our exclusive content and early updates. We are ready to elevate your business with AI when you are.'}
            </p>
          </div>
        </div>
      </div>

      {/* Conversion Funnel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 hover:border-sasori-red/30 transition-all group flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-sasori-red group-hover:scale-110 transition-transform">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black uppercase mb-3 tracking-tighter">Plan de Automatización</h3>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
              {lang === 'es' ? 'Recibe una hoja de ruta personalizada para implementar agentes de IA en tu flujo de trabajo.' : 'Receive a personalized roadmap to implement AI agents in your workflow.'}
            </p>
          </div>
          <button onClick={() => navigate('/services/ai-automation')} className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-sasori-red group-hover:gap-4 transition-all">
            {lang === 'es' ? 'EXPLORAR' : 'EXPLORE'} <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 hover:border-sasori-red/30 transition-all group flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-sasori-red group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black uppercase mb-3 tracking-tighter">Auditoría Técnica</h3>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
              {lang === 'es' ? '¿Tu stack está listo para el futuro? Analizamos tus sistemas actuales y detectamos cuellos de botella.' : 'Is your stack future-ready? We analyze your current systems and detect bottlenecks.'}
            </p>
          </div>
          <button onClick={() => navigate('/services/modernization')} className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-sasori-red group-hover:gap-4 transition-all">
            {lang === 'es' ? 'SOLICITAR' : 'REQUEST'} <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-sasori-red border border-sasori-red shadow-[0_20px_50px_rgba(226,6,19,0.2)] group flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black uppercase mb-3 tracking-tighter text-white">Inicia un Proyecto</h3>
            <p className="text-white/80 text-sm font-medium leading-relaxed">
              {lang === 'es' ? 'Conviértete en Cliente Sasori y desbloquea el panel de gestión de proyectos y soporte prioritario.' : 'Become a Sasori Client and unlock the project management dashboard and priority support.'}
            </p>
          </div>
          <button onClick={() => window.scrollTo({top: document.getElementById('contact')?.offsetTop, behavior: 'smooth'})} className="mt-8 py-4 bg-white text-sasori-red rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-black hover:text-white">
            {lang === 'es' ? 'AGENDAR LLAMADA' : 'BOOK A CALL'}
          </button>
        </div>
      </div>
      
      {/* Recommended Content */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
           <h3 className="text-2xl font-black uppercase tracking-tighter italic">Contenido para Ti</h3>
           <button onClick={() => navigate('/blog')} className="text-[10px] font-black underline text-zinc-500 uppercase">Ver Todo</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[1, 2].map(i => (
             <div key={i} className="h-48 rounded-[2rem] bg-zinc-900 border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                <img src={`https://images.unsplash.com/photo-${1550000000000+i}?auto=format&fit=crop&q=80&w=800`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" />
                <div className="absolute bottom-6 left-6 z-20">
                   <div className="px-2 py-1 bg-sasori-red text-[8px] font-black uppercase tracking-widest inline-block mb-2">Exclusive</div>
                   <h4 className="text-lg font-bold uppercase tracking-tight">El auge de los Agentes Autónomos en 2026</h4>
                </div>
             </div>
           ))}
        </div>
      </div>
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

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-sasori-red/10 border border-sasori-red/20 flex items-center justify-center">
             {profile.full_name ? <span className="text-3xl font-black text-sasori-red">{profile.full_name[0]}</span> : <User className="w-10 h-10 text-sasori-red" />}
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-sasori-red mb-1">{t.member}</p>
            <h1 className="text-3xl font-black uppercase tracking-tighter">{profile.full_name || t.welcome}</h1>
            <p className="text-white/40 text-xs mt-1">{profile.email}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setIsNewProjectModalOpen(true)} className="px-6 py-3 bg-white/5 border border-white/10 hover:border-sasori-red text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all">
             SOLICITAR PROYECTO NUEVO
          </button>
          <button onClick={() => setIsRequestModalOpen(true)} className="px-6 py-3 bg-sasori-red hover:bg-white text-white hover:text-sasori-red font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all">
            {t.newRequest}
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scroll-hide">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
            className={cn("flex flex-shrink-0 items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
              activeTab === tab.id ? "bg-sasori-red border-sasori-red text-white shadow-lg shadow-sasori-red/30" : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10")}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/30 truncate">Fases del Proyecto</h3>
                    {projects.length > 1 && (
                      <select 
                        value={selectedProjectId || ''} 
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:border-sasori-red transition-all text-white"
                      >
                        {projects.map(p => <option key={p.id} value={p.id} className="bg-black">{p.name}</option>)}
                      </select>
                    )}
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {milestones.filter(m => m.project_id === selectedProjectId).length > 0 ? 
                      milestones.filter(m => m.project_id === selectedProjectId).map(m => (
                      <div key={m.id} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 group hover:border-sasori-red/30 transition-all">
                         <div className="flex justify-between items-start mb-6">
                            <div><p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">HIT {m.id.slice(0,3)}</p><h4 className="text-lg font-black uppercase truncate">{m.name}</h4></div>
                            <span className={cn("text-[8px] font-black px-2 py-1 rounded-md uppercase", m.status === 'completed' ? "bg-emerald-500/10 text-emerald-400" : "bg-white/10 text-white/40")}>{m.status}</span>
                         </div>
                         <div className="relative pt-4">
                            <div className="flex justify-between text-[10px] font-black mb-2 uppercase"><span>Progreso</span><span className={m.progress === 100 ? "text-emerald-400" : "text-sasori-red"}>{m.progress}%</span></div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                               <motion.div initial={{ width: 0 }} animate={{ width: `${m.progress}%` }} className={cn("h-full rounded-full Shadows-red", m.progress === 100 ? "bg-emerald-400" : "bg-sasori-red")} />
                            </div>
                         </div>
                      </div>
                    )) : <div className="col-span-2 py-20 text-center text-white/10 uppercase font-black tracking-widest">Selecciona un proyecto para ver sus hitos</div>}
                 </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-sasori-red/20 to-gray-900 border border-sasori-red/30 rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col items-center justify-center">
               <h3 className="text-xs font-black uppercase tracking-widest text-white/50 mb-10 text-center">Total Completado</h3>
               <div className="relative w-48 h-48">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                     <circle className="text-white/5" strokeWidth="6" fill="transparent" r="42" cx="50" cy="50" />
                     <motion.circle initial={{ pathLength: 0 }} animate={{ pathLength: getProjectProgress(selectedProjectId || '') / 100 }} transition={{ duration: 1.5, ease: "easeOut" }} className="text-sasori-red Shadow-red" strokeWidth="6" strokeDasharray="100 100" strokeLinecap="round" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-5xl font-black">{getProjectProgress(selectedProjectId || '')}%</span>
                  </div>
               </div>
               <p className="mt-10 text-center text-[10px] text-white/40 leading-relaxed font-black uppercase tracking-widest">
                  {getProjectProgress(selectedProjectId || '') === 100 ? '✓ Proyecto Entregado' : '⚡ Desarrollo en Curso'}
               </p>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 uppercase">
              {projects.map(p => (
                <div key={p.id} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
                  <h4 className="text-2xl font-black tracking-tighter mb-4">{p.name}</h4>
                  <p className="text-white/40 text-[10px] font-black tracking-widest mb-6">ID: {p.id.slice(0, 8)}</p>
                  <div className="flex gap-4">
                     <button className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black">DOCUMENTACIÓN</button>
                     <button className="flex-1 py-4 rounded-2xl bg-sasori-red text-white text-[10px] font-black">DETALLES</button>
                  </div>
                </div>
              ))}
           </div>
        )}

        {/* 3. PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Historial de Pagos</h3>
              <button onClick={() => window.print()} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                 Imprimir Resumen Anual
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-white/30">
                    <th className="pb-6">ID</th><th className="pb-6">FECHA</th>
                    <th className="pb-6 text-right">MONTO</th><th className="pb-6 text-center">ESTADO</th><th className="pb-6 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {payments.length > 0 ? payments.map(p => (
                    <tr key={p.id} className="text-white/80">
                      <td className="py-6 font-mono text-[10px]">#{p.id.slice(0, 8)}</td>
                      <td className="py-6 text-xs">{new Date(p.payment_date).toLocaleDateString()}</td>
                      <td className="py-6 text-right text-sm font-bold">${p.amount} <small className="text-white/30 font-medium">{p.currency}</small></td>
                      <td className="py-6 text-center">
                         <span className={cn("px-2 py-1 rounded-md text-[8px] font-black uppercase", p.status === 'paid' ? "bg-emerald-500/10 text-emerald-400" : "bg-sasori-red/10 text-sasori-red")}>{p.status}</span>
                      </td>
                      <td className="py-6 text-right">
                         <button 
                           onClick={() => alert(`Generando Factura #${p.id.slice(0, 8)}...`)}
                           className="text-[9px] font-black uppercase tracking-widest text-sasori-red hover:text-white transition-colors border-b border-sasori-red/30 hover:border-white"
                         >
                           RECIBO PDF
                         </button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan={5} className="py-20 text-center text-white/10 font-black uppercase">{t.noData}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. REQUESTS HISTORY */}
        {activeTab === 'requests' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                  <div>
                     <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Mis Solicitudes</h3>
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/30 truncate">Seguimiento de ajustes y cambios de hitos</p>
                  </div>
                  <button onClick={() => setIsRequestModalOpen(true)} className="px-6 py-4 bg-sasori-red text-white text-[10px] font-black rounded-[1.2rem] hover:bg-white hover:text-sasori-red transition-all shadow-xl shadow-sasori-red/20">
                     + NUEVA SOLICITUD
                  </button>
               </div>
               
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                        <th className="pb-6 pl-4">Ticket / Asunto</th>
                        <th className="pb-6">Asociado a</th>
                        <th className="pb-6 text-center">Estado</th>
                        <th className="pb-6 text-right pr-4">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      <tr className="group hover:bg-white/[0.01] transition-colors">
                        <td className="py-8 pl-4">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-sasori-red/10 flex items-center justify-center text-sasori-red font-black text-xs">#01</div>
                              <div>
                                 <p className="text-xs font-black uppercase mb-1 tracking-tight">Análisis Inicial de Proyecto</p>
                                 <p className="text-[8px] font-mono opacity-30">REF: SYNC-PRO</p>
                              </div>
                           </div>
                        </td>
                        <td className="py-8">
                           <p className="text-[10px] font-black uppercase mb-1">General</p>
                        </td>
                        <td className="py-8 text-center">
                           <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[8px] font-black uppercase tracking-widest">ACTIVA</span>
                        </td>
                        <td className="py-8 text-right pr-4">
                           <button className="text-[10px] font-black opacity-40 hover:opacity-100 hover:text-sasori-red transition-all underline underline-offset-4 decoration-sasori-red/30">DETALLES →</button>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsRequestModalOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-gradient-to-b from-[#111] to-black border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-2xl"
            >
              <form onSubmit={handleRequestSubmit} className="space-y-6 text-white text-left">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Nueva Solicitud</h2>
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Asunto</label>
                   <input type="text" placeholder="¿Qué necesitas?" required className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold outline-none focus:border-sasori-red transition-all" onChange={e => setRequestForm({...requestForm, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Descripción</label>
                   <textarea required rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold resize-none outline-none focus:border-sasori-red transition-all" onChange={e => setRequestForm({...requestForm, description: e.target.value})} />
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
  const { profile, loading, role } = useProfile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const t = {
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
  }[lang as 'es'|'en'] || {};

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <MorphingSquare message="Sincronizando Sasori Node..." />
      </div>
    );
  }

  if (!profile) {
    // Redired handled by useEffect in App if session is lost, but safety check here
    setTimeout(() => navigate('/login'), 100);
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <AnimatedNavFramer lang={lang} />

      <main className="pt-32 px-4 md:px-8 max-w-7xl mx-auto pb-20 text-center md:text-left">
        
        {/* Universal Sub-Header for Auth Users */}
        <div className="mb-10 flex justify-between items-center px-4">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Secure Session Active</span>
           </div>
           <button 
             onClick={handleLogout} 
             className="px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-sasori-red hover:border-sasori-red/20 hover:bg-sasori-red/5 flex items-center gap-2 transition-all group"
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

      <Footer lang={lang as any} />
    </div>
  );
}
