import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Rocket, Layers, Edit3, CheckCircle, Clock, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

type Milestone = {
  id: string;
  name: string;
  progress: number;
  status: string;
  project_id: string;
};

type Project = {
  id: string;
  name: string;
  status: string;
  progress: number;
  client_name?: string;
  milestones?: Milestone[];
};

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data: projectsData, error: projErr } = await supabase
        .from('projects')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });

      if (projErr) throw projErr;

      const { data: milestonesData, error: mileErr } = await supabase
        .from('milestones')
        .select('*');

      if (mileErr) throw mileErr;

      const enrichedProjects = projectsData.map(p => ({
        ...p,
        client_name: p.profiles?.full_name,
        milestones: milestonesData.filter(m => m.project_id === p.id)
      }));

      setProjects(enrichedProjects);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateMilestoneProgress = async (mId: string, newProgress: number) => {
    try {
      const { error } = await supabase.from('milestones').update({ progress: newProgress }).eq( 'id', mId);
      if (error) throw error;
      fetchProjects();
    } catch (err) {
      alert('Error actualizando hito');
    }
  };

  const updateProjectStatus = async (pId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('projects').update({ status: newStatus }).eq('id', pId);
      if (error) throw error;
      fetchProjects();
    } catch (err) {
      alert('Error actualizando proyecto');
    }
  };

  if (loading) return <div className="p-20 text-center uppercase font-black text-[#1A1A1A]/20 tracking-widest">Desplegando Mapa de Operaciones...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1A1A1A]">Pipeline de Proyectos</h2>
          <p className="text-[#1A1A1A]/40 text-sm mt-2">Control total sobre la ejecución y entrega de valor.</p>
        </div>
        <button 
          onClick={() => {
            const name = prompt('Nombre del nuevo proyecto:');
            if (name) alert(`Iniciando creación de proyecto: ${name}`);
          }}
          className="bg-sasori-red text-white py-3 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#1A1A1A] transition-all shadow-lg"
        >
          <Plus size={14} /> NUEVO PROYECTO
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-[#EDEDED] border border-black/5 rounded-[2.5rem] overflow-hidden group shadow-sm">
            <div 
              className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer hover:bg-black/5 transition-all"
              onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
            >
               <div className="flex gap-6 items-center uppercase">
                 <div className="w-16 h-16 rounded-2xl bg-sasori-red/10 flex items-center justify-center text-sasori-red">
                   <Rocket size={32} />
                 </div>
                 <div>
                   <h3 className="text-xl font-black tracking-tight text-[#1A1A1A]">{project.name}</h3>
                   <p className="text-[10px] font-black tracking-widest text-[#1A1A1A]/30">CLIENTE: {project.client_name || 'Anónimo'}</p>
                 </div>
               </div>

               <div className="flex flex-wrap items-center gap-8">
                 <div className="text-center">
                    <div className="text-2xl font-black text-[#1A1A1A]">{project.progress}%</div>
                    <div className="text-[8px] font-black text-[#1A1A1A]/20 tracking-widest uppercase">Progreso Total</div>
                 </div>

                 <select 
                   value={project.status}
                   onClick={(e) => e.stopPropagation()}
                   onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                                       className="bg-white border border-black/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:border-sasori-red transition-all cursor-pointer text-[#1A1A1A] shadow-sm"
                 >
                    <option value="active" className="bg-white">En Desarrollo</option>
                    <option value="completed" className="bg-white">Finalizado</option>
                    <option value="paused" className="bg-white">Pausado</option>
                    <option value="maintenance" className="bg-white">Mantenimiento</option>
                 </select>

                 <div className="text-[#1A1A1A]/20">
                   {expandedProject === project.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                 </div>
               </div>
            </div>

            {expandedProject === project.id && (
               <div className="px-8 pb-10 pt-4 border-t border-black/5 animate-in slide-in-from-top-4 duration-300">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-sasori-red mb-8">Gestión de Hitos (Milestones)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {project.milestones?.map(m => (
                      <div key={m.id} className="p-6 rounded-2xl bg-white border border-black/5 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                          <p className="text-xs font-black uppercase tracking-tight text-[#1A1A1A]">{m.name}</p>
                          <span className="text-[10px] font-black text-sasori-red">{m.progress}%</span>
                        </div>
                        
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={m.progress}
                          onChange={(e) => updateMilestoneProgress(m.id, parseInt(e.target.value))}
                          className="w-full accent-sasori-red bg-black/5 h-1 rounded-full appearance-none cursor-pointer mb-6"
                        />

                        <div className="flex justify-between items-center">
                           <span className="text-[8px] font-black uppercase text-[#1A1A1A]/20">ID: {m.id.slice(0, 8)}</span>
                           <button className="text-[#1A1A1A]/20 hover:text-sasori-red transition-colors">
                              <Edit3 size={14} />
                           </button>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const hito = prompt('Nombre del nuevo hito:');
                        if (hito) alert(`Añadiendo hito "${hito}" al proyecto ${project.name}`);
                      }}
                      className="flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed border-black/10 hover:border-sasori-red hover:bg-sasori-red/5 transition-all gap-2 text-[#1A1A1A]/20 hover:text-sasori-red shadow-sm"
                    >
                       <Plus size={20} />
                       <span className="text-[9px] font-black uppercase">Añadir Hito</span>
                    </button>
                  </div>
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
