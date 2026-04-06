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

  useEffect(() => {
    fetchClients();
  }, []);

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
                <td className="py-6 px-8 text-right">
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
