import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Globe, 
  Database, 
  Zap, 
  ShieldCheck, 
  CreditCard, 
  Calendar, 
  ArrowUpRight,
  RefreshCcw,
  AlertCircle,
  HardDrive,
  Cpu,
  BarChart3
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function OwnerExpenses() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock Data (Representing Real-time state from Netlify/Supabase)
  const services = [
    { 
      name: 'Supabase DB', 
      icon: Database, 
      usage: '4.2 GB / 5 GB', 
      percent: 84, 
      cost: '$25.00', 
      next_billing: '12/04/2026',
      status: 'Pro Plan',
      items: [
        { label: 'Database Size', value: '4.2 GB', limit: '5 GB' },
        { label: 'Bandwidth', value: '128 GB', limit: '250 GB' },
        { label: 'Edge Functions', value: '1.2M', limit: '2.5M' },
      ],
      color: 'text-emerald-500'
    },
    { 
      name: 'Netlify Hosting', 
      icon: Globe, 
      usage: '450 GB / 1 TB', 
      percent: 45, 
      cost: '$19.00', 
      next_billing: '15/04/2026',
      status: 'Team Plan',
      items: [
        { label: 'Bandwidth', value: '450 GB', limit: '1 TB' },
        { label: 'Build Minutes', value: '1,200', limit: '3,000' },
        { label: 'Active Sites', value: '3', limit: 'Unlimited' },
      ],
      color: 'text-blue-500'
    },
    { 
      name: 'Google Analytics', 
      icon: BarChart3, 
      usage: '12M Hits', 
      percent: 12, 
      cost: '$0.00', 
      next_billing: 'N/A',
      status: 'Free Tier',
      items: [
        { label: 'Monthly Hits', value: '1.2M', limit: '10M' },
        { label: 'Data Retention', value: '14 Months', limit: '14' },
      ],
      color: 'text-yellow-500'
    },
    { 
      name: 'Resend (Email)', 
      icon: Zap, 
      usage: '2.5k / 3k', 
      percent: 83, 
      cost: '$0.00', 
      next_billing: '01/05/2026',
      status: 'Free',
      items: [
        { label: 'Emails Sent', value: '2.5k', limit: '3k' },
        { label: 'Domains', value: '1', limit: '1' },
      ],
      color: 'text-sasori-red'
    }
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 space-y-12 pb-40">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/5 pb-6 gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1A1A1A]">Gastos Propios Engine</h2>
          <p className="text-black/40 text-sm mt-2">Control maestro de costos fijos, límites de infraestructura y consumo de herramientas.</p>
        </div>
        
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-3 bg-[#EDEDED] hover:bg-black/5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-[#1A1A1A]"
        >
          <RefreshCcw size={14} className={cn("text-sasori-red", refreshing && "animate-spin")} />
          {refreshing ? 'Sincronizando APIs...' : 'Actualizar Real-time'}
        </button>
      </div>

      {loading ? (
        <div className="py-40 text-center uppercase font-black text-black/10 tracking-[0.5em] animate-pulse">Consultando Bóveda Financiera...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-black/5 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sasori-red/5 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:bg-sasori-red/10 transition-colors" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-5">
                    <div className={cn("p-4 rounded-2xl bg-black/5", service.color)}>
                        <service.icon size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A]">{service.name}</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/30 px-2 py-1 bg-black/5 rounded-md">{service.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#1A1A1A]">{service.cost}</div>
                    <div className="text-[9px] font-black uppercase text-black/20">Mensual</div>
                  </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase text-black/40">Uso Total de Capacidad</span>
                            <span className={cn("text-xs font-black", service.percent > 80 ? "text-sasori-red" : "text-black")}>{service.usage}</span>
                        </div>
                        <div className="h-2 w-full bg-[#EDEDED] rounded-full overflow-hidden p-0.5">
                            <div 
                                className={cn("h-full rounded-full transition-all duration-1000", service.percent > 80 ? "bg-sasori-red" : "bg-black")}
                                style={{ width: `${service.percent}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4">
                        {service.items.map((item, idx) => (
                            <div key={idx} className="p-4 bg-[#EDEDED]/50 rounded-2xl border border-black/5">
                                <span className="text-[8px] font-black uppercase text-black/30 block mb-1">{item.label}</span>
                                <span className="text-[10px] font-black text-[#1A1A1A]">{item.value}</span>
                                <span className="text-[8px] text-black/20 block">de {item.limit}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-black/5">
                        <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-sasori-red" />
                            <span className="text-[9px] font-black uppercase text-black/40">Próximo Débito: <span className="text-black">{service.next_billing}</span></span>
                        </div>
                        <button className="text-[9px] font-black uppercase tracking-widest text-sasori-red flex items-center gap-1 hover:translate-x-1 transition-transform">
                            Acceder Console <ArrowUpRight size={10} />
                        </button>
                    </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cumulative Control Panel */}
      <div className="bg-[#1A1A1A] rounded-[3rem] p-5 sm:p-8 md:p-10 md:p-12 border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Resumen Operativo Mensual</h3>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Inversión total en mantenimiento de la infraestructura Sasorilabs.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                        <span className="text-[10px] font-black uppercase text-white/20 block mb-2">Total Gastos Fijos</span>
                        <span className="text-4xl font-black text-white">$44.00</span>
                    </div>
                    <div className="bg-sasori-red p-6 rounded-3xl shadow-xl shadow-sasori-red/20 rotate-1">
                        <span className="text-[10px] font-black uppercase text-white/50 block mb-2">Eficiencia de Costos</span>
                        <span className="text-4xl font-black text-white">92%</span>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-1/3 bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-sasori-red/20 rounded-xl">
                        <ShieldCheck className="text-sasori-red" size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-white tracking-widest">Estado Sistémico: Saludable</span>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between text-[9px] font-black text-white/40 uppercase">
                        <span>CPU Load (Global)</span>
                        <span>12%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[12%]" />
                    </div>
                    
                    <div className="flex justify-between text-[9px] font-black text-white/40 uppercase">
                        <span>Storage (Global)</span>
                        <span>68%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-sasori-red w-[68%]" />
                    </div>
                </div>
                
                <div className="pt-4 flex justify-center">
                    <button className="text-[9px] font-black uppercase tracking-widest text-white/60 bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full transition-all">
                        Ver Logs Maestro
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
