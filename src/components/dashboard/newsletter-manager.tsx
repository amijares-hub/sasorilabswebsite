import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Users, Mail, Plus, Trash2, Send, CheckCircle2, Clock, AlertCircle, RefreshCw, Save, Edit2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MorphingSquare } from '../ui/morphing-square';
import { SITE_CONFIG } from '../../config/site-config';

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  status: string;
  source: string;
  lang: string;
  created_at: string;
}

interface Campaign {
  id: string;
  subject_es: string;
  content_es: string;
  status: string;
  sent_at: string | null;
  sent_count: number;
  created_at: string;
}

export function NewsletterManager() {
  const [activeTab, setActiveTab] = useState<'subscribers' | 'campaigns'>('subscribers');
  
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Campaign Form State
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [campaignForm, setCampaignForm] = useState({ subject: '', content: '' });
  
  // Sending state
  const [sendingCampaignId, setSendingCampaignId] = useState<string | null>(null);
  const [sendingProgress, setSendingProgress] = useState({ total: 0, current: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subsRes, campsRes] = await Promise.all([
        supabase.from('subscribers').select('*').order('created_at', { ascending: false }),
        supabase.from('newsletter_campaigns').select('*').order('created_at', { ascending: false })
      ]);
      if (subsRes.data) setSubscribers(subsRes.data);
      if (campsRes.data) setCampaigns(campsRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteSubscriber = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres eliminar este suscriptor permanentemente?")) return;
    await supabase.from('subscribers').delete().eq('id', id);
    fetchData();
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.subject || !campaignForm.content) return;
    
    if (editingCampaignId) {
       const { error } = await supabase.from('newsletter_campaigns').update({
         subject_es: campaignForm.subject,
         content_es: campaignForm.content
       }).eq('id', editingCampaignId);
       
       if (error) {
         console.error(error);
         alert(`Error al editar campaña: ${error.message}`);
         return;
       }
    } else {
       const { error } = await supabase.from('newsletter_campaigns').insert([{
         subject_es: campaignForm.subject,
         content_es: campaignForm.content,
         status: 'draft'
       }]);
       
       if (error) {
         console.error(error);
         alert(`Error al crear campaña: ${error.message}`);
         return;
       }
    }

    setIsCreatingCampaign(false);
    setEditingCampaignId(null);
    setCampaignForm({ subject: '', content: '' });
    fetchData();
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta campaña?")) return;
    const { error } = await supabase.from('newsletter_campaigns').delete().eq('id', id);
    if (error) {
      console.error(error);
      alert(`Error al eliminar: ${error.message}`);
    }
    fetchData();
  };

  const handleSendCampaign = async (campaign: Campaign) => {
    const activeSubs = subscribers.filter(s => s.status === 'active');
    
    if (activeSubs.length === 0) {
      alert("No hay suscriptores activos para enviar la campaña.");
      return;
    }
    
    if (!window.confirm(`¿Seguro que quieres enviar esta campaña a ${activeSubs.length} suscriptores? Esto no se puede deshacer.`)) {
      return;
    }
    
    setSendingCampaignId(campaign.id);
    setSendingProgress({ total: activeSubs.length, current: 0 });

    const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`;
    let successCount = 0;

    // We process in sequence to show nice progress and avoid rate-limits
    for (const sub of activeSubs) {
      try {
        const res = await fetch(fnUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            type: 'campaign',
            to: sub.email,
            lang: sub.lang,
            unsubscribeToken: sub.id, // we use ID as token for simplicity
            subject: campaign.subject_es,
            content: campaign.content_es,
            from: SITE_CONFIG.emails.notifications,
          })
        });

        if (res.ok) {
          successCount++;
          // Log it
          await supabase.from('email_logs').insert([{
            subscriber_id: sub.id,
            campaign_id: campaign.id,
            email: sub.email,
            type: 'campaign',
            status: 'sent'
          }]);
        } else {
          const errText = await res.text();
          console.error(`Edge function error for ${sub.email}:`, errText);
          alert(`Error enviando correo a ${sub.email}. Detalles del servidor: ${errText}`);
        }
      } catch (err) {
        console.error("Error sending to " + sub.email, err);
        alert(`Fallo de conexión al enviar a ${sub.email}. Revisa la consola.`);
      }
      
      setSendingProgress(prev => ({ ...prev, current: prev.current + 1 }));
    }

    // Update campaign status
    await supabase.from('newsletter_campaigns').update({
      status: 'sent',
      sent_at: new Date().toISOString(),
      sent_count: successCount
    }).eq('id', campaign.id);

    setSendingCampaignId(null);
    fetchData();
    alert(`Campaña enviada exitosamente a ${successCount} de ${activeSubs.length} suscriptores.`);
  };

  if (loading) return <div className="py-20 flex justify-center"><MorphingSquare message="Cargando Datos..." /></div>;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-white/5 pb-6 gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
            <Mail className="text-sasori-red w-8 h-8" /> 
            Newsletter Engine
          </h2>
          <p className="text-[#1A1A1A]/40 text-sm mt-2">Gestiona el flujo masivo de información hacia tus seguidores.</p>
        </div>
        
        <div className="flex bg-black/5 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('subscribers')}
            className={cn(
              "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all gap-2 flex items-center",
              activeTab === 'subscribers' ? "bg-sasori-red text-white shadow-lg" : "text-white/50 hover:text-white"
            )}
          >
            <Users size={14} /> Suscriptores ({subscribers.length})
          </button>
          <button 
            onClick={() => setActiveTab('campaigns')}
            className={cn(
              "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all gap-2 flex items-center",
              activeTab === 'campaigns' ? "bg-white text-black shadow-lg" : "text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
            )}
          >
            <Send size={14} /> Campañas
          </button>
        </div>
      </div>

      {activeTab === 'subscribers' && (
        <div className="bg-[#EDEDED] border border-black/5 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/5 border-b border-black/5">
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/50">Email</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/50">Nombre</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/50">Estado</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/50">Idioma</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/50">Fecha</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/50 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-[#1A1A1A]/30 text-sm italic">No hay suscriptores todavía.</td>
                  </tr>
                ) : subscribers.map(s => (
                  <tr key={s.id} className="border-b border-black/5 hover:bg-black/5 transition-colors text-[#1A1A1A]">
                    <td className="p-5 font-bold text-sm">{s.email}</td>
                    <td className="p-5 text-[#1A1A1A]/70 text-sm">{s.name || '-'}</td>
                    <td className="p-5">
                      <span className={cn(
                        "px-3 py-1 text-[10px] uppercase font-black tracking-widest flex inline-flex items-center gap-1 w-max rounded-full border",
                        s.status === 'active' ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : 
                        s.status === 'unsubscribed' ? "border-red-500/30 text-red-400 bg-red-500/10" : "border-white/10 text-white/50"
                      )}>
                        {s.status === 'active' ? <CheckCircle2 size={10}/> : <AlertCircle size={10}/>}
                        {s.status}
                      </span>
                    </td>
                    <td className="p-5 text-[#1A1A1A]/50 text-xs font-black uppercase tracking-widest">{s.lang}</td>
                    <td className="p-5 text-[#1A1A1A]/50 text-xs">{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className="p-5 text-right">
                      <button onClick={() => handleDeleteSubscriber(s.id)} className="text-[#1A1A1A]/20 hover:text-red-500 transition-colors p-2">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {!isCreatingCampaign ? (
            <>
              <div className="flex justify-end">
                <button 
                  onClick={() => {
                     setEditingCampaignId(null);
                     setCampaignForm({ subject: '', content: '' });
                     setIsCreatingCampaign(true);
                  }}
                  className="bg-sasori-red hover:bg-white text-white hover:text-black font-black uppercase text-[10px] tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(226,6,19,0.2)] flex items-center gap-2"
                >
                  <Plus size={16} /> NUEVA CAMPAÑA
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.length === 0 ? (
                  <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl">
                    <p className="text-[#1A1A1A]/30 text-lg uppercase tracking-widest font-black">No hay campañas.</p>
                  </div>
                ) : campaigns.map(c => (
                  <div key={c.id} className="bg-[#111] border border-white/5 rounded-3xl p-6 flex flex-col relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors z-0" />
                    <div className="relative z-10 flex-1">
                      <div className="flex justify-between items-start mb-4 text-xs font-black tracking-widest uppercase">
                        <span className={cn(
                          "px-2 py-1 rounded",
                          c.status === 'sent' ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-500"
                        )}>
                          {c.status}
                        </span>
                        <span className="text-[#1A1A1A]/30">{new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold uppercase tracking-tighter leading-tight mb-2 text-[#1A1A1A]">
                        {c.subject_es}
                      </h3>
                      <p className="text-[#1A1A1A]/40 text-sm line-clamp-3 mb-4">
                        {c.content_es.replace(/<[^>]+>/g, '')}
                      </p>
                    </div>

                    <div className="relative z-10 border-t border-white/5 pt-4 mt-auto">
                      {sendingCampaignId === c.id ? (
                        <div className="w-full text-center py-2">
                          <div className="w-full bg-white/10 h-2 rounded-full mb-2 overflow-hidden">
                            <div className="bg-sasori-red h-full transition-all" style={{ width: `${(sendingProgress.current / sendingProgress.total) * 100}%`}} />
                          </div>
                          <p className="text-[10px] uppercase font-black tracking-widest text-sasori-red animate-pulse">
                            Enviando {sendingProgress.current} de {sendingProgress.total}
                          </p>
                        </div>
                      ) : c.status === 'draft' ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleSendCampaign(c)}
                            className="flex-1 bg-sasori-red/20 hover:bg-sasori-red text-sasori-red hover:text-white flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                          >
                            <Send size={14} /> ENVIAR AHORA
                          </button>
                          <button 
                            onClick={() => {
                               setEditingCampaignId(c.id);
                               setCampaignForm({ subject: c.subject_es, content: c.content_es });
                               setIsCreatingCampaign(true);
                            }} 
                            className="w-12 flex items-center justify-center border border-black/10 text-[#1A1A1A]/50 hover:bg-white hover:text-black rounded-xl transition-colors shadow-sm"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteCampaign(c.id)} className="w-12 flex items-center justify-center border border-black/10 text-[#1A1A1A]/50 hover:bg-red-500 hover:text-white rounded-xl transition-colors shadow-sm">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-[#1A1A1A]/50 py-2">
                          <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-400" /> Enviado</span>
                          <span>{c.sent_count} envíos</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-[#EDEDED] border border-black/10 rounded-3xl p-8 max-w-4xl mx-auto shadow-xl">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 text-[#1A1A1A]">{editingCampaignId ? 'Editar Campaña Borrador' : 'Crear Campaña de Email'}</h3>
              <form onSubmit={handleCreateCampaign} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-sasori-red mb-2 block">Asunto del Correo</label>
                  <input 
                    type="text" 
                    required
                    value={campaignForm.subject}
                    onChange={(e) => setCampaignForm({...campaignForm, subject: e.target.value})}
                    placeholder="Ej: Novedades impactantes del Q3"
                    className="w-full bg-white border border-black/10 rounded-xl px-4 py-4 focus:border-sasori-red outline-none transition-colors font-bold text-lg text-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-sasori-red mb-2 block">Contenido (Admite HTML)</label>
                  <div className="bg-white border border-black/10 rounded-xl overflow-hidden focus-within:border-sasori-red transition-colors">
                    <textarea 
                      required
                      value={campaignForm.content}
                      onChange={(e) => setCampaignForm({...campaignForm, content: e.target.value})}
                      rows={10}
                      placeholder={`<h2>Hola equipo!</h2>\n<p>Aquí tienes las novedades de este mes...</p>`}
                      className="w-full bg-transparent p-4 outline-none resize-y font-mono text-sm text-[#1A1A1A]/80"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-black/5">
                  <button type="button" onClick={() => { setIsCreatingCampaign(false); setEditingCampaignId(null); }} className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors py-2 px-4">
                    Cancelar
                  </button>
                  <button type="submit" className="bg-[#1A1A1A] text-white hover:bg-sasori-red font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl transition-all shadow-lg flex items-center gap-2">
                    <Save size={14} /> Guardar Borrador
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
