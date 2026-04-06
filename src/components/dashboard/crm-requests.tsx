import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { CheckCircle2, Clock, Trash2, ArrowRight, MessageSquare, Briefcase } from 'lucide-react';
import { cn } from '../../lib/utils';

type ChangeRequest = {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  client_name?: string;
  project_name?: string;
  type: 'change' | 'new_project';
};

export function RequestManager() {
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // 1. Fetch Change Requests
      const { data: changes, error: changeErr } = await supabase
        .from('change_requests')
        .select('*, projects(name), profiles(full_name)')
        .order('created_at', { ascending: false });

      // 2. Fetch New Project Requests
      const { data: newProjects, error: newErr } = await supabase
        .from('project_requests')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });

      const combined: ChangeRequest[] = [
        ...(changes?.map(c => ({
          id: c.id,
          title: c.title,
          description: c.description,
          status: c.status,
          created_at: c.created_at,
          client_name: c.profiles?.full_name,
          project_name: c.projects?.name,
          type: 'change' as const
        })) || []),
        ...(newProjects?.map(n => ({
          id: n.id,
          title: n.project_name,
          description: n.description,
          status: n.status,
          created_at: n.created_at,
          client_name: n.profiles?.full_name,
          type: 'new_project' as const
        })) || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setRequests(combined);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, table: 'change_requests' | 'project_requests', newStatus: string) => {
    try {
      const { error } = await supabase.from(table).update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      fetchRequests();
    } catch (err) {
      alert('Error actualizando estado');
    }
  };

  if (loading) return <div className="p-20 text-center uppercase font-black text-[#1A1A1A]/20 tracking-widest">Sincronizando Bóveda de Solicitudes...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Centro de Solicitudes</h2>
        <p className="text-[#1A1A1A]/40 text-sm mt-2">Gestiona cambios técnicos y nuevas propuestas de negocio.</p>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl text-[#1A1A1A]/20 uppercase font-black">No hay solicitudes pendientes</div>
        ) : (
          requests.map(req => (
            <div key={req.id} className="bg-[#EDEDED] border border-black/5 shadow-sm rounded-3xl p-8 shadow-md transition-all group-hover:bg-black/5">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex gap-6">
                   <div className={cn(
                     "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                     req.type === 'new_project' ? "bg-emerald-500/10 text-emerald-500" : "bg-sasori-red/10 text-sasori-red"
                   )}>
                     {req.type === 'new_project' ? <Briefcase size={28} /> : <MessageSquare size={28} />}
                   </div>
                   
                   <div>
                     <div className="flex flex-wrap items-center gap-3 mb-2">
                       <span className={cn(
                         "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                         req.type === 'new_project' ? "bg-emerald-500 text-black" : "bg-sasori-red text-white"
                       )}>
                         {req.type === 'new_project' ? 'NUEVA VISIÓN' : 'AJUSTE TÉCNICO'}
                       </span>
                       <span className="text-[10px] font-black tracking-widest text-[#1A1A1A]/30 uppercase">{new Date(req.created_at).toLocaleDateString()}</span>
                       <span className="text-[10px] font-black tracking-widest text-[#1A1A1A]/30 uppercase">• {req.client_name || 'Cliente Sasori'}</span>
                     </div>
                     
                     <h3 className="text-xl font-black uppercase tracking-tight mb-2">{req.title}</h3>
                     {req.project_name && <p className="text-xs font-black uppercase text-sasori-red mb-3">Proyecto: {req.project_name}</p>}
                     <p className="text-[#1A1A1A]/60 text-sm line-clamp-2 max-w-2xl">{req.description}</p>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-end gap-3 justify-center">
                   <select 
                     value={req.status}
                     onChange={(e) => updateStatus(req.id, req.type === 'new_project' ? 'project_requests' : 'change_requests', e.target.value)}
                     className="bg-white border border-black/10 text-[#1A1A1A] shadow-sm rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:border-sasori-red transition-all cursor-pointer"
                   >
                     <option value="pending">Pendiente</option>
                     <option value="reviewing">En Revisión</option>
                     <option value="approved">Aprobado</option>
                     <option value="completed">Completado</option>
                     <option value="rejected">Rechazado</option>
                   </select>
                   
                   <button 
                     onClick={() => alert(`Cargando expediente completo:\n\nID: ${req.id}\nTítulo: ${req.title}\nCliente: ${req.client_name}`)}
                     className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/20 hover:text-sasori-red transition-all flex items-center gap-2"
                   >
                     VER DETALLES COMPLETOS <ArrowRight size={12} />
                   </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
