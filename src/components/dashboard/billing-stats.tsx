import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Database,
  BarChart3,
  Layers,
  ChevronRight,
  RefreshCcw,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function BillingStats() {
  const [viewType, setViewType] = useState<'individual' | 'global'>('global');

  // Mock Data
  const mainStats = [
    { label: 'MRR Proyectado', value: '$8,450.00', trend: '+14%', icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Créditos Globales', value: '850,000', trend: 'de 1M limit', icon: Database, color: 'text-sasori-red' },
    { label: 'Pagos Pendientes', value: '$1,200.00', trend: '3 Facturas', icon: CreditCard, color: 'text-yellow-500' },
    { label: 'Eficiencia DB', value: '98%', trend: 'Optimized', icon: ShieldCheck, color: 'text-blue-500' },
  ];

  const userCredits = [
    { user: 'Delta Studio', plan: 'Enterprise', credits_used: '450k', credits_remaining: '550k', usage: 45, renewal: '15/04/2026', status: 'active' },
    { user: 'Constructora Alfa', plan: 'Pro', credits_used: '82k', credits_remaining: '18k', usage: 82, renewal: '12/04/2026', status: 'warning' },
    { user: 'Marketing X', plan: 'Basic', credits_used: '12k', credits_remaining: '8k', usage: 60, renewal: '20/04/2026', status: 'active' },
    { user: 'Global Logistics', plan: 'Enterprise', credits_used: '120k', credits_remaining: '880k', usage: 12, renewal: '05/05/2026', status: 'active' },
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/5 pb-6 gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1A1A1A]">Mensualidades & Créditos</h2>
          <p className="text-black/40 text-sm mt-2">Control financiero y de consumo API/Database para cada cuenta activa.</p>
        </div>
        
        <div className="flex bg-[#F5F5F5] p-1 rounded-2xl border border-black/5">
          <button 
            onClick={() => setViewType('global')}
            className={cn(
              "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              viewType === 'global' ? "bg-white text-black shadow-sm" : "text-black/30 hover:text-black/50"
            )}
          >General</button>
          <button 
            onClick={() => setViewType('individual')}
            className={cn(
              "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              viewType === 'individual' ? "bg-white text-black shadow-sm" : "text-black/30 hover:text-black/50"
            )}
          >Por Usuario</button>
        </div>
      </div>

      {/* Stats Table/Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white border border-black/5 rounded-[2rem] shadow-sm relative overflow-hidden group hover:border-sasori-red/20 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={cn("p-4 rounded-2xl bg-black/5", stat.color)}>
                <stat.icon size={24} />
              </div>
              <div className="flex flex-col items-end">
                <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full", stat.trend.includes('+') ? "bg-emerald-500/10 text-emerald-600" : "bg-sasori-red/10 text-sasori-red")}>
                  {stat.trend}
                </span>
              </div>
            </div>
            <div className="text-3xl font-black text-[#1A1A1A] tracking-tighter mb-1">{stat.value}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30">{stat.label}</div>
            
            <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <stat.icon size={80} strokeWidth={1} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Credit Control Section */}
      <div className="bg-[#EDEDED] rounded-[2.5rem] p-8 md:p-12 border border-black/5 shadow-inner">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <RefreshCcw className="w-5 h-5 text-sasori-red animate-spin-slow" />
                <h3 className="text-xl font-black uppercase tracking-widest text-[#1A1A1A]">Control de Créditos Engine</h3>
            </div>
            <p className="text-black/40 text-[10px] font-black uppercase tracking-widest pl-7">Relación directa entre suscripción mensual y uso de Base de Datos.</p>
          </div>
          <button className="bg-white hover:bg-sasori-red text-black hover:text-white border border-black/5 font-black uppercase tracking-widest text-[9px] px-8 py-4 rounded-full transition-all flex items-center gap-2 shadow-sm">
            <Calendar size={14} /> EXPORTAR REPORTES (PDF)
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {userCredits.map((user, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between border border-black/5 group hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-6 mb-6 md:mb-0 md:w-1/4">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-xl", idx % 2 === 0 ? "bg-sasori-red rotate-3" : "bg-[#1A1A1A] -rotate-3")}>
                  {user.user.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-black uppercase tracking-tighter text-[#1A1A1A] mb-1">{user.user}</h4>
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/20 bg-black/5 px-2 py-0.5 rounded-md">Plan {user.plan}</span>
                </div>
              </div>

              <div className="flex-1 md:px-12 mb-8 md:mb-0">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-black/40">Uso de Créditos</div>
                  <div className="text-xs font-black text-[#1A1A1A]">{user.credits_used} / {user.credits_remaining} Restantes</div>
                </div>
                <div className="h-3 w-full bg-[#EDEDED] rounded-full overflow-hidden p-1 shadow-inner relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${user.usage}%` }}
                    className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        user.usage > 80 ? "bg-sasori-red" : "bg-black"
                    )}
                  />
                  {user.usage > 90 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white animate-pulse" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:w-1/5">
                <div className="flex justify-between md:flex-col gap-4 text-center md:text-left">
                  <div className="flex-1">
                    <div className="text-[9px] font-black uppercase tracking-widest text-black/20 mb-1">Próximo Pago</div>
                    <div className="text-[11px] font-black text-[#1A1A1A] flex items-center gap-2">
                        <Calendar size={12} className="text-sasori-red" />
                        {user.renewal}
                    </div>
                  </div>
                  <button className="hidden md:flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-sasori-red hover:translate-x-2 transition-all">
                    Ver Historial <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
