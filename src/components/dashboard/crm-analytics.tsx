import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  Globe, 
  Search, 
  BarChart, 
  TrendingUp, 
  Zap, 
  Shield, 
  Phone, 
  Mail, 
  ArrowUpRight,
  Filter,
  Download,
  Share2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function CRMAnalytics() {
  const [activeTab, setActiveTab] = useState<'users' | 'visitors' | 'conversion'>('users');

  // Mock User Data
  const mainStats = [
    { label: 'Usuarios Registrados', value: '45,210', trend: '+12.5%', icon: Users, color: 'text-sasori-red' },
    { label: 'Nuevos Visitantes', value: '128,450', trend: '+18.2%', icon: Globe, color: 'text-blue-500' },
    { label: 'Consultas Realizadas', value: '1.2M', trend: '+24.1%', icon: Zap, color: 'text-emerald-500' },
    { label: 'Tiempo Promedio', value: '4:12m', trend: '-2.1%', icon: Zap, color: 'text-sasori-red' },
  ];

  const recentUsers = [
    { id: 1, name: 'Alice Johnson', city: 'Madrid, ES', email: 'alice@corp.com', activity: 'Activa', last_seen: 'Hace 2 min', conversion: '84%' },
    { id: 2, name: 'Bob Smith', city: 'London, UK', email: 'bob@tech.io', activity: 'Inactiva', last_seen: 'Hace 4 hrs', conversion: '12%' },
    { id: 3, name: 'Carlos Ruíz', city: 'Tenerife, ES', email: 'carlos@sasori.io', activity: 'Activa', last_seen: 'Hace 12 min', conversion: '95%' },
    { id: 4, name: 'Diana Prince', city: 'New York, US', email: 'diana@amazon.com', activity: 'Activa', last_seen: 'Hace 1 hr', conversion: '50%' },
    { id: 5, name: 'Eduardo M.', city: 'Berlin, DE', email: 'edu@startup.de', activity: 'Inactiva', last_seen: 'Hace 2 días', conversion: '0%' },
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 space-y-12 pb-40">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/5 pb-6 gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1A1A1A]">Analítica CRM Maestro</h2>
          <p className="text-black/40 text-sm mt-2">Visibilidad total del comportamiento de usuario, adquisición y métricas de retención proactiva.</p>
        </div>
        
        <div className="flex gap-4">
          <button className="bg-white border border-black/5 p-3 rounded-xl hover:bg-black/5 transition-colors shadow-sm">
            <Filter size={18} className="text-black/50" />
          </button>
          <button className="bg-white border border-black/5 p-3 rounded-xl hover:bg-black/5 transition-colors shadow-sm">
            <Download size={18} className="text-black/50" />
          </button>
          <button className="bg-sasori-red text-white flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-sasori-red/20 transition-all hover:translate-y-[-2px]">
            <Share2 size={16} /> Compartir Informe
          </button>
        </div>
      </div>

      {/* Main KPI Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-[#EDEDED] rounded-[2rem] border border-black/5 shadow-sm group hover:bg-white transition-all duration-500"
          >
            <div className="flex justify-between items-center mb-6">
              <div className={cn("p-4 rounded-2xl bg-white shadow-xl", stat.color)}>
                <stat.icon size={22} />
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp size={12} className={stat.trend.includes('+') ? "text-emerald-500" : "text-sasori-red"} />
                <span className={cn("text-[10px] font-black uppercase", stat.trend.includes('+') ? "text-emerald-500" : "text-sasori-red")}>
                  {stat.trend}
                </span>
              </div>
            </div>
            <div className="text-3xl font-black text-[#1A1A1A] tracking-tighter mb-1">{stat.value}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Advanced Behavioral Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Geographic/Activity Overview */}
        <div className="lg:col-span-2 bg-[#1A1A1A] rounded-[3rem] p-10 border border-white/5 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-sasori-red" />
                    <h3 className="text-2xl font-black uppercase tracking-widest text-white leading-none">Matriz de Usuarios</h3>
                </div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-none">Análisis de procedencia y engagement en tiempo real.</p>
            </div>
            
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                {['users', 'visitors', 'conversion'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === tab ? "bg-sasori-red text-white shadow-lg" : "text-white/30 hover:text-white/60"
                        )}
                    >{tab}</button>
                ))}
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            {recentUsers.map((user, idx) => (
              <motion.div 
                key={user.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-5 w-1/3">
                  <div className="w-12 h-12 rounded-xl bg-sasori-red text-white flex items-center justify-center font-black text-lg shadow-lg rotate-2 group-hover:rotate-0 transition-all">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-white mb-0.5">{user.name}</h4>
                    <span className="text-[10px] text-white/30 font-medium flex items-center gap-1">
                        <MapPin size={10} className="text-sasori-red" /> {user.city}
                    </span>
                  </div>
                </div>

                <div className="hidden md:flex flex-col gap-1 w-1/4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Conversión</span>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-sasori-red" style={{ width: user.conversion }} />
                        </div>
                        <span className="text-[10px] font-black text-white">{user.conversion}</span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest py-1 px-3 rounded-full border",
                        user.activity === 'Activa' ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5" : "border-sasori-red/30 text-sasori-red bg-sasori-red/5"
                    )}>{user.activity}</span>
                </div>

                <div className="text-right flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Último Acceso</span>
                    <span className="text-[10px] font-black text-white/60">{user.last_seen}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Global Overview Breakdown */}
        <div className="bg-[#EDEDED] rounded-[3rem] p-10 border border-black/5 shadow-inner space-y-12">
            <div>
                <h3 className="text-xl font-black uppercase tracking-widest text-[#1A1A1A] mb-2">Resumen Global</h3>
                <p className="text-black/30 text-[10px] font-black uppercase tracking-widest">Saturación del mercado digital por regiones.</p>
            </div>

            <div className="space-y-8">
                {[
                    { country: 'España', users: '12.4k', growth: '+5.2%', percent: 85 },
                    { country: 'UK', users: '8.1k', growth: '+12.4%', percent: 62 },
                    { country: 'Estados Unidos', users: '15.2k', growth: '+2.1%', percent: 45 },
                    { country: 'Brasil', users: '4.5k', growth: '+24.5%', percent: 30 },
                    { country: 'China', users: '25.1k', growth: '+15.2%', percent: 92 },
                ].map((item, idx) => (
                    <div key={idx} className="space-y-3">
                        <div className="flex justify-between items-end">
                            <div className="text-xs font-black uppercase tracking-tighter text-[#1A1A1A]">{item.country}</div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-black/20">{item.users}</span>
                                <span className="text-[10px] font-black text-emerald-500">{item.growth}</span>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden p-0.5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percent}%` }}
                                className="h-full bg-sasori-red rounded-full"
                                transition={{ delay: idx * 0.1, duration: 1 }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-8 border-t border-black/5 space-y-4">
                <div className="bg-white/80 p-6 rounded-2xl flex items-center justify-between border border-black/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-sasori-red/10 rounded-xl">
                            <Shield className="w-5 h-5 text-sasori-red" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-black/30 block">Seguridad CRM</span>
                            <span className="text-xs font-black uppercase tracking-tight text-[#1A1A1A]">Acceso Encriptado</span>
                        </div>
                    </div>
                    <ArrowUpRight size={16} className="text-black/20" />
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
