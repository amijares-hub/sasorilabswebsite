import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  HardDrive, 
  Activity, 
  Users, 
  Cloud, 
  AlertTriangle, 
  ArrowUpRight, 
  TrendingUp,
  Box,
  PieChart as PieChartIcon,
  Search
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function SystemResources() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Data
  const stats = [
    { label: 'Espacio Total DB', value: '4.2 GB', sub: 'de 5.0 GB limit', percent: 84, icon: Database, color: 'text-sasori-red' },
    { label: 'Ancho de Banda', value: '128 GB', sub: 'Este mes', percent: 45, icon: Activity, color: 'text-blue-500' },
    { label: 'Almacenamiento CDN', value: '12.5 GB', sub: 'Archivos/Media', percent: 62, icon: Cloud, color: 'text-emerald-500' },
    { label: 'Usuarios Activos', value: '1,240', sub: '+12% vs mes pasado', percent: 75, icon: Users, color: 'text-[#1A1A1A]' },
  ];

  const userUsage = [
    { id: 1, user: 'Constructora Alfa', email: 'admin@alfa.com', space: '1.2 GB', bandwidth: '45 GB', queries: '12.5k', status: 'normal' },
    { id: 2, user: 'Global Logistics', email: 'it@global.log', space: '0.8 GB', bandwidth: '12 GB', queries: '8.2k', status: 'normal' },
    { id: 3, user: 'Sasori Intern', email: 'dev@sasorilabs.com', space: '0.4 GB', bandwidth: '5 GB', queries: '1.1k', status: 'low' },
    { id: 4, user: 'Big Corp Inc', email: 'ops@bigcorp.io', space: '2.4 GB', bandwidth: '82 GB', queries: '45.1k', status: 'warning' },
    { id: 5, user: 'Startup X', email: 'founder@x.co', space: '0.2 GB', bandwidth: '2 GB', queries: '0.5k', status: 'normal' },
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 space-y-12">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-black/5 pb-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1A1A1A]">Recursos del Sistema</h2>
          <p className="text-black/40 text-sm mt-2">Monitoreo de infraestructura, base de datos y consumo de red en tiempo real.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-[#EDEDED] rounded-2xl border border-black/5 shadow-sm group hover:border-sasori-red/30 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-xl bg-white shadow-sm", stat.color)}>
                <stat.icon size={20} />
              </div>
              <ArrowUpRight size={16} className="text-black/10 group-hover:text-sasori-red transition-colors" />
            </div>
            <div className="text-2xl font-black text-[#1A1A1A] mb-1">{stat.value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/40 mb-4">{stat.label}</div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-black/40 uppercase">{stat.sub}</span>
                <span className="text-black">{stat.percent}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.percent}%` }}
                  className={cn("h-full", stat.percent > 80 ? "bg-sasori-red" : "bg-black/80")}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User Consumption Analysis */}
      <div className="bg-[#EDEDED] rounded-[2.5rem] p-8 md:p-10 border border-black/5 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-xl font-black uppercase tracking-widest text-[#1A1A1A]">Consumo por Entidad</h3>
            <p className="text-black/40 text-xs mt-1 uppercase font-bold tracking-wider">Desglose de uso granular por usuario de base de datos.</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" size={14} />
            <input 
              type="text" 
              placeholder="Buscar entidad..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-black/5 rounded-full pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-sasori-red w-full md:w-64 shadow-sm"
            />
          </div>
        </div>

        <div className="relative z-10 overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/30">
                <th className="px-6 py-4">Usuario / Entidad</th>
                <th className="px-6 py-4">Espacio Ocupado</th>
                <th className="px-6 py-4">Tráfico (Mensual)</th>
                <th className="px-6 py-4">Consultas API</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {userUsage.map((item) => (
                <tr key={item.id} className="group">
                  <td className="px-6 py-4 bg-white first:rounded-l-2xl border-y border-l border-black/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sasori-red/10 flex items-center justify-center text-sasori-red font-black text-xs">
                        {item.user.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-tight text-[#1A1A1A]">{item.user}</div>
                        <div className="text-[10px] text-black/30 font-medium">{item.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 bg-white border-y border-black/5">
                    <div className="text-xs font-black text-[#1A1A1A]">{item.space}</div>
                  </td>
                  <td className="px-6 py-4 bg-white border-y border-black/5">
                    <div className="text-xs font-black text-[#1A1A1A]">{item.bandwidth}</div>
                  </td>
                  <td className="px-6 py-4 bg-white border-y border-black/5">
                    <div className="text-xs font-black text-[#1A1A1A]">{item.queries}</div>
                  </td>
                  <td className="px-6 py-4 bg-white border-y border-black/5">
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                      item.status === 'warning' ? "bg-sasori-red/10 text-sasori-red" : "bg-emerald-500/10 text-emerald-600"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 bg-white last:rounded-r-2xl border-y border-r border-black/5 text-right">
                    <button className="p-2 hover:bg-black/5 rounded-lg transition-colors">
                      <Box size={14} className="text-black/30 group-hover:text-sasori-red transition-colors" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
