import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { User, Mail, Calendar, Search, ExternalLink, Shield } from 'lucide-react';

type Client = {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  avatar_url?: string;
  company?: string;
};

export function ClientManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedClientDiagnostic, setSelectedClientDiagnostic] = useState<any>(null);
  const [viewingDiagnostic, setViewingDiagnostic] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchDiagnostic = async (clientId: string) => {
    const { data, error } = await supabase
      .from('onboarding_submissions')
      .select('*')
      .eq('subscriber_id', clientId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (data) {
      setSelectedClientDiagnostic(data);
      setViewingDiagnostic(true);
    } else {
      alert('Este usuario aún no ha completado el diagnóstico.');
    }
  };

  useEffect(() => {
    const filtered = clients.filter(c => 
      c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
      setFilteredClients(data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center uppercase font-black text-[#1A1A1A]/20 tracking-widest">Accediendo al Directorio de Clientes...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* DIAGNOSTIC MODAL */}
      {viewingDiagnostic && selectedClientDiagnostic && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setViewingDiagnostic(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-[3rem] p-12 shadow-2xl overflow-hidden text-[#1A1A1A]"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-sasori-red/5 -mr-20 -mt-20 rounded-full blur-3xl opacity-50" />
            
            <div className="flex justify-between items-start mb-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sasori-red mb-1">Expediente de Diagnóstico</p>
                <h3 className="text-3xl font-black uppercase tracking-tighter italic">{selectedClientDiagnostic.company_name}</h3>
              </div>
              <button 
                onClick={() => setViewingDiagnostic(false)}
                className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-sasori-red hover:text-white transition-all text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-8">
              {/* CONTACT PREFERENCES HIGHLIGHT */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-[2rem] bg-sasori-red/5 border border-sasori-red/10 flex flex-col items-center text-center">
                  <Calendar className="w-8 h-8 text-sasori-red mb-2" />
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Día Preferido</p>
                  <p className="text-xl font-black">{selectedClientDiagnostic.pref_fecha_contacto || 'PENDIENTE'}</p>
                </div>
                <div className="p-6 rounded-[2rem] bg-black/5 border border-black/5 flex flex-col items-center text-center">
                  <Clock className="w-8 h-8 text-[#1A1A1A]/40 mb-2" />
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Franja Horaria</p>
                  <p className="text-xl font-black uppercase">{selectedClientDiagnostic.pref_franja_horaria || 'PENDIENTE'}</p>
                </div>
              </div>

              <div className="space-y-4">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2">Industria / Sector</p>
                    <p className="text-sm font-bold bg-black/5 px-4 py-3 rounded-xl border border-black/5">{selectedClientDiagnostic.industry}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2">Desafío Principal</p>
                    <p className="text-sm font-medium bg-black/5 px-4 py-3 rounded-xl border border-black/5 leading-relaxed italic text-black/60">
                       "{selectedClientDiagnostic.challenge}"
                    </p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2">Presupuesto Estimado</p>
                    <span className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 inline-block">
                       {selectedClientDiagnostic.estimated_budget}
                    </span>
                 </div>
              </div>

               <div className="pt-6">
                 <button 
                   onClick={() => window.open(`https://wa.me/34672106989?text=Hola%20${selectedClientDiagnostic.company_name},%20he%20visto%20vuestro%20diagnóstico...`, '_blank')}
                   className="w-full py-5 bg-sasori-red text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-2"
                 >
                    CONTACTAR VÍA COORDINACIÓN <ArrowRight size={14} />
                 </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1A1A1A]">Directorio de Clientes</h2>
          <p className="text-[#1A1A1A]/40 text-sm mt-2">Base de datos centralizada de usuarios y socios estratégicos.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/20" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:border-sasori-red outline-none transition-all text-[#1A1A1A]"
          />
        </div>
      </div>

      <div className="bg-[#EDEDED] border border-black/5 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/5 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/30 bg-black/5">
              <th className="py-8 px-8">Cliente</th>
              <th className="py-8 px-4">Compañía</th>
              <th className="py-8 px-4">Fecha de Registro</th>
              <th className="py-8 px-8 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {filteredClients.map(client => (
              <tr key={client.id} className="group hover:bg-black/5 transition-colors text-[#1A1A1A]">
                <td className="py-6 px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-sasori-red/10 border border-sasori-red/20 flex items-center justify-center text-sasori-red overflow-hidden">
                      {client.avatar_url ? <img src={client.avatar_url} className="w-full h-full object-cover" /> : <User size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight">{client.full_name || 'Sin Nombre'}</p>
                      <p className="text-[10px] text-[#1A1A1A]/30 font-medium">{client.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-4 text-xs font-bold uppercase">
                  {client.company || '—'}
                </td>
                <td className="py-6 px-4">
                  <div className="flex items-center gap-2 text-[#1A1A1A]/40">
                    <Calendar size={12} />
                    <span className="text-[10px] font-black uppercase">{new Date(client.created_at).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="py-6 px-8 text-right flex justify-end gap-2">
                  <button 
                    onClick={() => fetchDiagnostic(client.id)}
                    className="p-3 rounded-xl bg-sasori-red/10 border border-sasori-red/20 text-sasori-red hover:bg-sasori-red hover:text-white transition-all shadow-sm"
                    title="Ver Diagnóstico y Preferencias"
                  >
                    <Search size={16} />
                  </button>
                  <button 
                    onClick={() => alert(`Accediendo al perfil detallado de: ${client.full_name || client.email}`)}
                    className="p-3 rounded-xl bg-white border border-black/10 hover:bg-[#1A1A1A] text-[#1A1A1A]/40 hover:text-white transition-all shadow-sm"
                  >
                    <ExternalLink size={16} />
                  </button>
                </td>
              </tr>
            ))} 
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={4} className="py-20 text-center text-[#1A1A1A]/20 font-black uppercase">No se encontraron clientes</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-12 p-8 bg-white border border-black/5 rounded-3xl flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sasori-red/10 flex items-center justify-center text-sasori-red">
               <Shield size={24} />
            </div>
            <div>
               <p className="text-sm font-black uppercase text-[#1A1A1A]">Privacidad Blindada</p>
               <p className="text-[10px] text-[#1A1A1A]/40 uppercase font-bold tracking-widest">Todos los datos están encriptados bajo protocolo Sasori Ghost.</p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-2xl font-black text-sasori-red">{clients.length}</p>
            <p className="text-[9px] font-black uppercase text-[#1A1A1A]/20">Clientes Totales</p>
         </div>
      </div>
    </div>
  );
}
