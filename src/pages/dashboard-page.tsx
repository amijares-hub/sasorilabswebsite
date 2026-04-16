import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Plus, Edit2, Trash2, LogOut, ArrowLeft, Image as ImageIcon, Save, CheckCircle2, Upload, Video as VideoIcon, Link, FileCode, BarChart, Code, FileText, Brain, Bold, Italic, Underline, List, Type, Strikethrough, Mail, BookOpen, User, Rocket, CreditCard, Activity, Database, Server } from 'lucide-react';
import { SasoriLogo } from '../components/ui/sasori-logo';
import { MorphingSquare } from '../components/ui/morphing-square';
import { NewsletterManager } from '../components/dashboard/newsletter-manager';
import { cn } from '../lib/utils';
import { ClientManager } from '../components/dashboard/crm-clients';
import { ProjectManager } from '../components/dashboard/crm-projects';
import { RequestManager } from '../components/dashboard/crm-requests';
import { FinanceManager } from '../components/dashboard/crm-finance';
import { SystemResources } from '../components/dashboard/system-resources';
import { BillingStats } from '../components/dashboard/billing-stats';
import { CRMAnalytics } from '../components/dashboard/crm-analytics';
import { OwnerExpenses } from '../components/dashboard/owner-expenses';

interface Blog {
  id: string;
  slug: string;
  author: string;
  author_image?: string;
  cover_image: string;
  created_at: string;
  is_published: boolean;
  read_time: number;
  translations: Record<string, { title: string; content: string }>;
  seo_score?: number;
  seo_recommendations?: string[];
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [activeModule, setActiveModule] = useState<'blogs' | 'newsletter' | 'crm_clients' | 'crm_projects' | 'crm_requests' | 'crm_finance' | 'system_resources' | 'billing_stats' | 'crm_analytics' | 'owner_expenses'>('blogs');

  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const editorRef = useRef<HTMLDivElement>(null);
  const [showFontSizes, setShowFontSizes] = useState(false);

  const [formData, setFormData] = useState({
    slug: '',
    cover_image: '',
    author: '',
    author_image: '',
    is_published: true,
    translations: {
      es: { title: '', content: '' },
      en: { title: '', content: '' },
      zh: { title: '', content: '' },
      ru: { title: '', content: '' },
      pt: { title: '', content: '' },
    } as Record<string, { title: string; content: string }>,
    seo_score: 0,
    seo_recommendations: [] as string[]
  });

  const [masterLanguage, setMasterLanguage] = useState<'es' | 'en' | 'zh' | 'ru' | 'pt'>('es');

  // Isolated editor content to prevent massive re-renders on every keystroke
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/dashboard/login');
      } else {
        setSession(session);
        fetchBlogs();
      }
    });
  }, [navigate]);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error visualizando blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/dashboard/login');
  };

  const openEditor = (blog?: Blog) => {
    if (blog) {
      setCurrentBlogId(blog.id);
      setFormData({
        slug: blog.slug,
        cover_image: blog.cover_image || '',
        author: blog.author || '',
        author_image: blog.author_image || '',
        is_published: blog.is_published,
        translations: blog.translations || { es: {title:'',content:''}, en: {title:'',content:''}, zh: {title:'',content:''}, ru: {title:'',content:''}, pt: {title:'',content:''} },
        seo_score: blog.seo_score || 0,
        seo_recommendations: blog.seo_recommendations || []
      });
      setEditorContent(blog.translations?.es?.content || '');
      setMasterLanguage('es');
    } else {
      setCurrentBlogId(null);
      setFormData({
        slug: '',
        cover_image: '',
        author: '',
        author_image: '',
        is_published: true,
        translations: { 
            es: {title:'',content:''}, 
            en: {title:'',content:''}, 
            zh: {title:'',content:''}, 
            ru: {title:'',content:''}, 
            pt: {title:'',content:''} 
        },
        seo_score: 0,
        seo_recommendations: []
      });
      setEditorContent('');
      setMasterLanguage('es');
    }
    setIsEditing(true);
  };

  const performAIAnalysis = async (title: string, content: string) => {
    // Simulated SEO analysis since we don't have a real AI endpoint here, 
    // but we can compute some basics locally
    let score = 0;
    const recommendations: string[] = [];

    if (title.length > 10) score += 20;
    else recommendations.push("El título es muy corto. Intenta usar más de 10 caracteres.");

    if (content.length > 300) score += 30;
    else recommendations.push("El contenido es breve. Los buscadores prefieren artículos de más de 300 palabras.");

    if (content.includes('<h2>') || content.includes('###')) score += 15;
    else recommendations.push("Usa encabezados (H2/H3) para estructurar mejor el contenido.");

    if (content.includes('href=') || content.includes('](')) score += 15;
    else recommendations.push("Agrega enlaces internos o externos para mejorar la autoridad.");

    // Simple keyword density check
    const keywords = ['tecnología', 'IA', 'diseño', 'inteligencia artificial', 'innovación', 'web'];
    const foundKeywords = keywords.filter(k => content.toLowerCase().includes(k.toLowerCase()));
    if (foundKeywords.length >= 2) score += 20;
    else recommendations.push("Agrega palabras clave relevantes como: " + keywords.join(", "));

    return { score, recommendations };
  };

  const autoFormatContent = (text: string) => {
    const lines = text.split('\n');
    const formatted = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<')) return line;
      
      if (trimmed.length < 50 && !trimmed.endsWith('.') && !trimmed.endsWith('?') && !trimmed.endsWith(':')) {
        return `<h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-16 mb-8 text-[#1A1A1A]">${trimmed}</h2>`;
      }
      if (trimmed.endsWith('?') || (trimmed.length < 70 && trimmed.endsWith(':'))) {
        return `<h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter mt-12 mb-6 text-[#1A1A1A]/90">${trimmed}</h3>`;
      }
      return `<p className="text-xl leading-relaxed text-[#1A1A1A]/70 mb-8 font-medium">${trimmed}</p>`;
    }).filter(l => l !== '').join('\n\n\n');
    
    return formatted;
  };

  const wrapSelection = (tagType: 'h2' | 'h3' | 'p' | 'code' | 'link' | 'img' | 'video' | 'bold' | 'italic' | 'underline' | 'strike' | 'list' | 'fontsize', value?: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    // Use document.execCommand for standard things where possible for "Word" feel
    // and custom manipulation for Sasori-styled components.
    
    editor.focus();

    if (tagType === 'bold') { document.execCommand('bold', false); }
    else if (tagType === 'italic') { document.execCommand('italic', false); }
    else if (tagType === 'underline') { document.execCommand('underline', false); }
    else if (tagType === 'strike') { document.execCommand('strikeThrough', false); }
    else if (tagType === 'p') { document.execCommand('formatBlock', false, 'p'); }
    else if (tagType === 'h2') { document.execCommand('formatBlock', false, 'h2'); }
    else if (tagType === 'h3') { document.execCommand('formatBlock', false, 'h3'); }
    else if (tagType === 'fontsize') {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            // Using a safer method for font size to avoid 'surroundContents' split node errors
            document.execCommand('fontSize', false, '7');
            const fontEls = editor.querySelectorAll('font[size="7"]');
            fontEls.forEach(el => {
                const span = document.createElement('span');
                span.style.fontSize = value || '24px';
                span.className = "font-black text-[#1A1A1A]";
                span.innerHTML = el.innerHTML;
                el.parentNode?.replaceChild(span, el);
            });
        }
    }
    else if (tagType === 'list') {
        document.execCommand('insertUnorderedList', false);
        // Custom styling for ul/li to match Sasori
        const selection = window.getSelection();
        if (selection && selection.anchorNode) {
            let parent = selection.anchorNode.parentElement;
            while(parent && parent.tagName !== 'UL') parent = parent.parentElement;
            if (parent) parent.className = "space-y-4 my-12 list-none";
        }
    }
    else if (tagType === 'link') {
        const url = prompt('Introduce la URL del link:');
        if (url) document.execCommand('createLink', false, url);
    }
    else if (tagType === 'img') {
        const url = prompt('URL de la imagen:');
        if (url) {
            const img = `<img src="${url}" class="rounded-xl shadow-2xl w-full my-32 border border-black/10" />`;
            document.execCommand('insertHTML', false, img);
        }
    }
    else if (tagType === 'video') {
        const url = prompt('URL del video (iframe src):');
        if (url) {
            const video = `<div class="aspect-video w-full my-32 overflow-hidden rounded-xl border border-black/10"><iframe src="${url}" class="w-full h-full" /></div>`;
            document.execCommand('insertHTML', false, video);
        }
    }

    // After manipulation, sync the local editor state
    setEditorContent(editor.innerHTML);
  };

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `blog/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);
    
    return publicUrl;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, target: 'cover' | 'content') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSaveStatus('saving');
      const publicUrl = await uploadFile(file);

      if (target === 'cover') {
        setFormData(prev => ({ ...prev, cover_image: publicUrl }));
      } else {
        const img = `<img src="${publicUrl}" class="rounded-xl shadow-2xl w-full my-32 border border-black/10" />`;
        if (editorRef.current) {
            editorRef.current.focus();
            document.execCommand('insertHTML', false, img);
            setEditorContent(editorRef.current.innerHTML);
        }
      }
      setSaveStatus('idle');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert('Error subiendo imagen: ' + error.message);
      setSaveStatus('idle');
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          try {
            setSaveStatus('saving');
            const publicUrl = await uploadFile(file);
            const img = `<img src="${publicUrl}" class="rounded-xl shadow-2xl w-full my-32 border border-black/10" />`;
            if (editorRef.current) {
                editorRef.current.focus();
                document.execCommand('insertHTML', false, img);
                setEditorContent(editorRef.current.innerHTML);
            }
            setSaveStatus('idle');
          } catch (err) {
            console.error('Paste upload failed', err);
            setSaveStatus('idle');
          }
        }
      }
    }
  };

  const translateContent = async (text: string, targetLang: string) => {
    if (!text || !text.trim()) return text;
    
    const langMap: Record<string, string> = {
        'es': 'es',
        'en': 'en',
        'zh': 'zh-CN',
        'ru': 'ru',
        'pt': 'pt'
    };
    const targetCode = langMap[targetLang] || targetLang;
    // ALWAYS use auto-detection - let Google figure out the source language
    const sourceCode = 'auto';

    try {
      // Protect HTML tags from being translated
      const placeholders: string[] = [];
      const protectedText = text.replace(/<[^>]+>/g, (match) => {
          const id = `[[TAG_${placeholders.length}]]`;
          placeholders.push(match);
          return id;
      });

      // Chunk by 1000 chars
      const chunks = protectedText.match(/.{1,1000}/g) || [protectedText];
      const translatedChunks = await Promise.all(chunks.map(async (chunk) => {
          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceCode}&tl=${targetCode}&dt=t&q=${encodeURIComponent(chunk)}`;
          const response = await fetch(url);
          const data = await response.json();
          return data[0].map((item: any) => item[0]).join("");
      }));
      
      let translated = translatedChunks.join("");

      // Restore HTML tags
      placeholders.forEach((tag, i) => {
          translated = translated.replace(`[[TAG_${i}]]`, tag);
          translated = translated.replace(`[[ TAG_${i} ]]`, tag);
          translated = translated.replace(`[[TAG _${i}]]`, tag);
      });

      return translated;
    } catch (error) {
      console.error(`Error de traducción para ${targetLang}:`, error);
      return text; 
    }
  };

  const saveBlog = async () => {
    setSaveStatus('saving');
    console.log("Iniciando Proceso Maestro: Análisis + Traducción + Publicación");
    
    // Sync editor content to formData before processing
    const currentContent = editorRef.current?.innerHTML || editorContent;
    
    // sourceTitle/sourceContent = whatever the user typed in the editor (always 'es' slot)
    const sourceTitle = formData.translations.es.title;
    const sourceContent = currentContent;
    
    const { score, recommendations } = await performAIAnalysis(sourceTitle, sourceContent);

    // Generate Slug if empty
    const generatedSlug = formData.slug || sourceTitle
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    // ── TRANSLATIONS ────────────────────────────────────────────────────────
    // Build from scratch. Translate the raw input into ALL 5 languages using
    // auto-detection (sl=auto). This way it works regardless of what language
    // the user typed in.
    const updatedTranslations: Record<string, { title: string; content: string }> = {};
    const targetLanguages = ['es', 'en', 'zh', 'ru', 'pt'];
    
    console.log(`Traduciendo desde texto: "${sourceTitle.substring(0, 60)}" a todos los idiomas...`);

    try {
        for (const l of targetLanguages) {
            console.log(`➡ Procesando: ${l}`);
            const [translatedTitle, translatedContent] = await Promise.all([
                translateContent(sourceTitle, l),
                translateContent(sourceContent, l)
            ]);
            updatedTranslations[l] = {
                title: translatedTitle,
                content: translatedContent
            };
            console.log(`✓ ${l.toUpperCase()} OK: "${translatedTitle.substring(0, 50)}"`);
        }

        const payload = {
          slug: generatedSlug,
          cover_image: formData.cover_image,
          author: formData.author,
          author_image: formData.author_image,
          translations: updatedTranslations,
          is_published: true, 
          seo_score: score,
          seo_recommendations: recommendations
        };

        if (currentBlogId) {
          const { error } = await supabase.from('blogs').update(payload).eq('id', currentBlogId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('blogs').insert([payload]);
          if (error) throw error;
        }
        
        console.log("¡Publicado con éxito en todos los idiomas!");
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
        fetchBlogs();
        setTimeout(() => setIsEditing(false), 500);
    } catch (error: any) {
      console.error('CRITICAL ERROR:', error);
      alert('Hubo un problema crítico. Error: ' + error.message);
      setSaveStatus('idle');
    }
  };

  const deleteBlog = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este artículo definitivamente?')) {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (!error) fetchBlogs();
    }
  };

  if (!session) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-12">
      <MorphingSquare message="Autenticando Identidad..." />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-sasori-red selection:text-white">
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex flex-col w-84 fixed h-screen z-50 bg-[#EDEDED] border-r border-black/5 py-8 md:py-12 px-4 md:px-10 justify-between relative shadow-xl">
        {/* Metallic brushed grain overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
        
        {/* Red Tech Strip */}
        <div className="absolute top-0 right-0 w-[2px] h-full bg-sasori-red shadow-[0_0_15px_#E20613] opacity-20" />

        <div className="relative z-10">
          <div className="p-8 flex items-center gap-4 mb-8">
          <SasoriLogo className="w-10 h-10 text-sasori-red" />
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-[#1A1A1A]">SasoriLabs</h1>
            <p className="text-[10px] font-bold text-sasori-red uppercase tracking-[0.2em]">Panel de Administración</p>
          </div>
        </div>
          
          <div className="flex flex-col gap-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-black/20 mb-2 pl-2">Módulos</div>
            <button 
              onClick={() => setActiveModule('blogs')}
              className={cn(
                "px-8 py-5 rounded-xl text-sm font-black uppercase tracking-widest transition-all gap-5 flex items-center w-full text-left group",
                activeModule === 'blogs' ? "bg-white text-black shadow-lg border border-black/5" : "text-black/50 hover:text-[#1A1A1A] hover:bg-black/5"
              )}
            >
              <BookOpen size={18} className={activeModule === 'blogs' ? "" : "group-hover:text-sasori-red transition-colors"} /> 
              Blog Engine
            </button>
            <button 
              onClick={() => setActiveModule('newsletter')}
              className={cn(
                "px-8 py-5 rounded-xl text-sm font-black uppercase tracking-widest transition-all gap-5 flex items-center w-full text-left group",
                activeModule === 'newsletter' ? "bg-sasori-red text-white shadow-[0_0_30px_rgba(226,6,19,0.3)]" : "text-black/50 hover:text-[#1A1A1A] hover:bg-black/5"
              )}
            >
              <Mail size={18} className={activeModule === 'newsletter' ? "" : "group-hover:text-sasori-red transition-colors"} /> 
              Newsletter Engine
            </button>

            <div className="text-[10px] font-black uppercase tracking-widest text-black/20 mb-2 mt-6 pl-2">Sistema CRM</div>
            <button 
              onClick={() => setActiveModule('crm_clients')}
              className={cn(
                "px-8 py-5 rounded-xl text-sm font-black uppercase tracking-widest transition-all gap-5 flex items-center w-full text-left group",
                activeModule === 'crm_clients' ? "bg-white text-black shadow-lg border border-black/5" : "text-black/50 hover:text-[#1A1A1A] hover:bg-black/5"
              )}
            >
              <User size={18} className={activeModule === 'crm_clients' ? "" : "group-hover:text-sasori-red transition-colors"} /> 
              Clientes
            </button>
            <button 
              onClick={() => setActiveModule('crm_projects')}
              className={cn(
                "px-8 py-5 rounded-xl text-sm font-black uppercase tracking-widest transition-all gap-5 flex items-center w-full text-left group",
                activeModule === 'crm_projects' ? "bg-white text-black shadow-lg border border-black/5" : "text-black/50 hover:text-[#1A1A1A] hover:bg-black/5"
              )}
            >
              <Rocket size={18} className={activeModule === 'crm_projects' ? "" : "group-hover:text-sasori-red transition-colors"} /> 
              Proyectos
            </button>
            <button 
              onClick={() => setActiveModule('crm_requests')}
              className={cn(
                "px-8 py-5 rounded-xl text-sm font-black uppercase tracking-widest transition-all gap-5 flex items-center w-full text-left group",
                activeModule === 'crm_requests' ? "bg-white text-black shadow-lg border border-black/5" : "text-black/50 hover:text-[#1A1A1A] hover:bg-black/5"
              )}
            >
              <BarChart size={18} className={activeModule === 'crm_requests' ? "" : "group-hover:text-sasori-red transition-colors"} /> 
              Solicitudes
            </button>
            <button 
              onClick={() => setActiveModule('crm_finance')}
              className={cn(
                "px-8 py-5 rounded-xl text-sm font-black uppercase tracking-widest transition-all gap-5 flex items-center w-full text-left group",
                activeModule === 'crm_finance' ? "bg-white text-black shadow-lg border border-black/5" : "text-black/50 hover:text-[#1A1A1A] hover:bg-black/5"
              )}
            >
              <CreditCard size={18} className={activeModule === 'crm_finance' ? "" : "group-hover:text-sasori-red transition-colors"} /> 
              Finanzas
            </button>
            <button 
              onClick={() => setActiveModule('billing_stats')}
              className={cn(
                "px-8 py-5 rounded-xl text-sm font-black uppercase tracking-widest transition-all gap-5 flex items-center w-full text-left group",
                activeModule === 'billing_stats' ? "bg-white text-black shadow-lg border border-black/5" : "text-black/50 hover:text-[#1A1A1A] hover:bg-black/5"
              )}
            >
              <CreditCard size={18} className={activeModule === 'billing_stats' ? "" : "group-hover:text-sasori-red transition-colors"} /> 
              Mensualidades
            </button>

            <div className="text-[10px] font-black uppercase tracking-widest text-black/20 mb-2 mt-6 pl-2">Análisis Avanzado</div>
            <button 
              onClick={() => setActiveModule('crm_analytics')}
              className={cn(
                "px-8 py-5 rounded-xl text-sm font-black uppercase tracking-widest transition-all gap-5 flex items-center w-full text-left group",
                activeModule === 'crm_analytics' ? "bg-sasori-red text-white shadow-lg" : "text-black/50 hover:text-[#1A1A1A] hover:bg-black/5"
              )}
            >
              <BarChart size={18} className={activeModule === 'crm_analytics' ? "" : "group-hover:text-sasori-red transition-colors"} /> 
              Analítica Maestro
            </button>
            <button 
              onClick={() => setActiveModule('system_resources')}
              className={cn(
                "px-8 py-5 rounded-xl text-sm font-black uppercase tracking-widest transition-all gap-5 flex items-center w-full text-left group",
                activeModule === 'system_resources' ? "bg-white text-black shadow-lg border border-black/5" : "text-black/50 hover:text-[#1A1A1A] hover:bg-black/5"
              )}
            >
              <Activity size={18} className={activeModule === 'system_resources' ? "" : "group-hover:text-sasori-red transition-colors"} /> 
              Infraestructura
            </button>
            <button 
              onClick={() => setActiveModule('owner_expenses')}
              className={cn(
                "px-8 py-5 rounded-xl text-sm font-black uppercase tracking-widest transition-all gap-5 flex items-center w-full text-left group",
                activeModule === 'owner_expenses' ? "bg-sasori-red text-white shadow-lg" : "text-black/50 hover:text-[#1A1A1A] hover:bg-black/5"
              )}
            >
              <Server size={18} className={activeModule === 'owner_expenses' ? "" : "group-hover:text-sasori-red transition-colors"} /> 
              Gastos Propios
            </button>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/30 hover:text-sasori-red hover:bg-sasori-red/5 transition-colors w-full text-left group relative z-10">
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Salir del Sistema
        </button>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5 py-6 px-8 flex justify-between items-center text-[#1A1A1A]">
        <div className="flex items-center gap-4">
          <SasoriLogo className="w-8 h-8 text-sasori-red" />
          <h1 className="text-xl font-black uppercase tracking-tighter">Panel de Administración</h1>
        </div>
        <button onClick={handleLogout} className="text-black/50 hover:text-sasori-red transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      {/* MOBILE SWITCHER */}
      <div className="md:hidden fixed top-[64px] w-full z-40 bg-[#EDEDED]/90 backdrop-blur-lg border-b border-black/5 p-4 flex justify-center gap-2">
          <button 
            onClick={() => setActiveModule('blogs')}
            className={cn(
              "flex-1 py-3 my-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center justify-center border border-black/5",
              activeModule === 'blogs' ? "bg-white text-black shadow-lg" : "text-black/50 hover:text-[#1A1A1A] bg-black/5"
            )}
          >
            <BookOpen size={14} /> Blog
          </button>
          <button 
            onClick={() => setActiveModule('newsletter')}
            className={cn(
              "flex-1 py-3 my-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center justify-center border border-black/5",
              activeModule === 'newsletter' ? "bg-sasori-red text-white shadow-lg" : "text-black/50 hover:text-[#1A1A1A] bg-black/5"
            )}
          >
            <Mail size={14} /> Newsletter
          </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 md:ml-84 w-full lg:max-w-[calc(100vw-336px)]">
        <main className="pt-40 md:pt-16 px-4 md:px-12 w-full mx-auto pb-20">
        
        {activeModule === 'newsletter' ? (
           <NewsletterManager />
        ) : activeModule === 'crm_clients' ? (
           <ClientManager />
        ) : activeModule === 'crm_projects' ? (
           <ProjectManager />
        ) : activeModule === 'crm_requests' ? (
           <RequestManager />
        ) : activeModule === 'crm_finance' ? (
           <FinanceManager />
        ) : activeModule === 'crm_analytics' ? (
           <CRMAnalytics />
        ) : activeModule === 'system_resources' ? (
           <SystemResources />
        ) : activeModule === 'billing_stats' ? (
           <BillingStats />
        ) : activeModule === 'owner_expenses' ? (
           <OwnerExpenses />
        ) : !isEditing ? (
          // LIST VIEW
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-between items-end mb-10 border-b border-black/5 pb-6">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1A1A1A]">Artículos Publicados</h2>
                <p className="text-black/40 text-sm mt-2">Gestiona el tejido de la información. Crea y destruye bloques de conocimiento.</p>
              </div>
              <button 
                onClick={() => openEditor()}
                className="bg-sasori-red hover:bg-white text-white hover:text-black font-black uppercase text-[10px] tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(226,6,19,0.2)] flex items-center gap-2"
              >
                <Plus size={16} /> NUEVO ARTÍCULO
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-40">
                <MorphingSquare message="Sincronizando Bóveda..." />
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-10 md:py-20 border border-dash border-black/10 rounded-xl bg-[#EDEDED]/30">
                <p className="text-black/30 text-lg uppercase tracking-widest font-black">La bóveda de información está vacía.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map(blog => (
                  <div key={blog.id} className="group relative bg-[#EDEDED] border border-black/5 rounded-xl p-6 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all overflow-hidden flex flex-col justify-between h-72">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-sasori-red/0 group-hover:bg-sasori-red/5 transition-colors duration-500 z-0" />
                    
                    <div className="relative z-10 flex-grow">
                      <div className="flex justify-between items-start mb-4 text-xs font-black tracking-widest text-black/40 uppercase">
                        <span>ES • {blog.read_time ?? 0}m Read</span>
                        <span className="text-emerald-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Público</span>
                      </div>
                      <h3 className="text-2xl font-bold uppercase tracking-tighter leading-tight line-clamp-3 text-[#1A1A1A]">
                        {blog.translations?.es?.title || blog.slug}
                      </h3>
                      <div className="flex gap-2 mt-2">
                        {['en', 'zh', 'ru', 'pt'].map(l => (
                          <span key={l} className="text-[8px] bg-black/5 px-1.5 py-0.5 rounded text-black/40 font-black">{l.toUpperCase()} OK</span>
                        ))}
                      </div>
                    </div>

                    <div className="relative z-10 flex gap-3 mt-4 pt-4 border-t border-black/5">
                      <button onClick={() => openEditor(blog)} className="flex-1 bg-white border border-black/10 hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white text-[10px] font-black tracking-widest uppercase py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <Edit2 size={12} /> Editar
                      </button>
                      <button onClick={() => deleteBlog(blog.id)} className="w-12 flex items-center justify-center border border-sasori-red/30 text-sasori-red hover:bg-sasori-red hover:text-white rounded-xl transition-all shadow-sm">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // EDITOR VIEW
          <div className="animate-in slide-in-from-bottom-8 duration-500 max-w-4xl mx-auto pb-40">
            <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-lg pt-4 pb-4 border-b border-black/5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <button onClick={() => setIsEditing(false)} className="text-[#1A1A1A]/50 hover:text-[#1A1A1A] flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors font-display">
                <ArrowLeft size={16} /> Volver a Bóveda
              </button>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 mr-4">
                    <div className={cn("w-3 h-3 rounded-full animate-pulse", formData.seo_score > 70 ? "bg-emerald-500" : formData.seo_score > 40 ? "bg-yellow-500" : "bg-sasori-red")} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/60">SEO Power: {formData.seo_score}%</span>
                </div>
                <button 
                  onClick={saveBlog} 
                  disabled={saveStatus === 'saving'}
                  className="bg-white text-black hover:bg-sasori-red hover:text-white font-black uppercase tracking-widest text-[10px] px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg min-w-[180px] justify-center"
                >
                  {saveStatus === 'saving' ? (
                    <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> Procesando...</div>
                  ) : saveStatus === 'saved' ? (
                    <><CheckCircle2 size={14} /> Logrado</>
                  ) : (
                    <><Save size={14} /> Publicar Inmediato</>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-10 space-y-12">
              {/* GLOBAL METADATA */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6 bg-[#EDEDED] p-8 rounded-xl border border-black/5 shadow-sm">
                  <h3 className="text-xl font-black uppercase tracking-widest text-[#1A1A1A]/50 border-b border-black/10 pb-4">Metadata Global</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sasori-red">ID de Ruta (Slug)</label>
                      <input 
                        type="text" 
                        placeholder="ej: revolucion-ia-2026"
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                        className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm focus:border-sasori-red outline-none transition-colors shadow-[inset_1px_1px_4px_rgba(0,0,0,0.05)]"
                      />
                      <p className="text-[10px] text-black/30">Se generará auto-mágicamente del título si lo dejas vacío.</p>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sasori-red flex items-center justify-between">
                         <span className="flex items-center gap-2"><ImageIcon size={12}/> Imagen de Portada</span>
                         <div className="relative">
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} className="hidden" id="cover-upload" />
                            <label htmlFor="cover-upload" className="cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg text-[8px] flex items-center gap-1 transition-colors">
                                <Upload size={10} /> SUBIR DE DISCO
                            </label>
                         </div>
                      </label>
                      <input 
                        type="text" 
                        placeholder="O pega una URL: https://tu-bucket/imagen.jpg"
                        value={formData.cover_image}
                        onChange={(e) => setFormData({...formData, cover_image: e.target.value})}
                        className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm focus:border-sasori-red outline-none transition-colors shadow-[inset_1px_1px_4px_rgba(0,0,0,0.05)]"
                      />
                      {formData.cover_image && <div className="h-20 w-32 mt-2 rounded-lg bg-cover bg-center border border-black/10 shadow-md" style={{ backgroundImage: `url(${formData.cover_image})` }} />}
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sasori-red">Autor (Nombre)</label>
                      <input 
                        type="text" 
                        placeholder="ej: Anita Tutić"
                        value={formData.author || ''}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm focus:border-sasori-red outline-none transition-colors shadow-[inset_1px_1px_4px_rgba(0,0,0,0.05)]"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sasori-red">Autor Image URL</label>
                      <input 
                        type="text" 
                        placeholder="URL de foto del autor"
                        value={formData.author_image || ''}
                        onChange={(e) => setFormData({...formData, author_image: e.target.value})}
                        className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm focus:border-sasori-red outline-none transition-colors shadow-[inset_1px_1px_4px_rgba(0,0,0,0.05)]"
                      />
                      {formData.author_image && <div className="h-12 w-12 mt-2 rounded-full bg-cover bg-center border border-black/10 shadow-md" style={{ backgroundImage: `url(${formData.author_image})` }} />}
                    </div>
                  </div>
                </div>

                <div className="bg-sasori-red/5 p-8 rounded-[2rem] border border-sasori-red/20 space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-sasori-red">Análisis SEO Automático</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-4xl font-black text-sasori-red">{formData.seo_score}%</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/40">Potencia Actual</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-sasori-red transition-all duration-1000" style={{ width: `${formData.seo_score}%` }} />
                        </div>
                        <div className="space-y-2 mt-4">
                            {formData.seo_recommendations.length > 0 ? (
                                formData.seo_recommendations.map((rec, i) => (
                                    <div key={i} className="flex gap-2 text-[9px] font-bold uppercase tracking-wider text-[#1A1A1A]/60 leading-relaxed border-l-2 border-sasori-red/30 pl-3">
                                        • {rec}
                                    </div>
                                ))
                            ) : (
                                <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-500">Perfectamente Optimizado</p>
                            )}
                        </div>
                    </div>
                </div>
              </div>

              {/* SINGLE LANGUAGE EDITOR */}
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                    <span className="bg-sasori-red/10 border border-sasori-red/20 text-sasori-red text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm">
                      🌐 Traducción Automática a 5 Idiomas
                    </span>
                    <span className="text-[#1A1A1A]/20 text-[10px] uppercase font-black tracking-widest italic">Escribe en cualquier idioma. El sistema detecta y traduce automáticamente.</span>
                </div>
                
                <input 
                  type="text" 
                  placeholder="Escribe el Título aquí..."
                  className="w-full bg-transparent border-none text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter placeholder-black/10 focus:outline-none text-[#1A1A1A]"
                  value={formData.translations.es.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    translations: {
                      ...formData.translations,
                      es: { ...formData.translations.es, title: e.target.value }
                    }
                  })}
                />

                {/* RICH TOOLBAR */}
                <div className="flex flex-wrap gap-2 border-y border-black/5 py-4 mt-8 bg-[#EDEDED]/50 px-4 rounded-xl items-center shadow-sm">
                  <div className="text-[8px] font-black uppercase tracking-widest text-black/30 mr-2 border-r border-black/5 pr-4">Herramientas</div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="text-[8px] font-black uppercase tracking-widest text-black/30 mr-2 border-r border-black/5 pr-4">Bloques</div>
                    {[
                      { label: 'H2', type: 'h2', icon: <FileCode size={14} /> },
                      { label: 'H3', type: 'h3', icon: <FileCode size={14} /> },
                      { label: 'PÁRRAFO', type: 'p', icon: <FileText size={14} /> },
                      { label: 'LISTA', type: 'list', icon: <List size={14} /> },
                      { label: 'CÓDIGO', type: 'code', icon: <Code size={14} /> },
                    ].map(btn => (
                      <button key={btn.label} type="button" onClick={() => wrapSelection(btn.type as any)} className="bg-white border border-black/10 hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group shadow-sm">
                        <span className="opacity-40 group-hover:opacity-100 transition-opacity">{btn.icon}</span>
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  <div className="h-6 w-px bg-black/10 mx-2" />

                  <div className="text-[8px] font-black uppercase tracking-widest text-black/30 mr-2 border-r border-black/5 pr-4">Formato</div>
                  {[
                    { label: 'NEGRITA', type: 'bold', icon: <Bold size={14} /> },
                    { label: 'CURSIVA', type: 'italic', icon: <Italic size={14} /> },
                    { label: 'SUBRAYADO', type: 'underline', icon: <Underline size={14} /> },
                    { label: 'TACHADO', type: 'strike', icon: <Strikethrough size={14} /> },
                  ].map(btn => (
                    <button key={btn.label} type="button" onClick={() => wrapSelection(btn.type as any)} className="bg-white border border-black/10 hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group shadow-sm">
                      <span className="opacity-40 group-hover:opacity-100 transition-opacity">{btn.icon}</span>
                      {btn.label}
                    </button>
                  ))}
                  
                  {/* FONT SIZE DROPDOWN */}
                  <div className="relative">
                      <button 
                          type="button" 
                          onClick={() => setShowFontSizes(!showFontSizes)} 
                          className="bg-white border border-black/10 hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group shadow-sm"
                      >
                          <Type size={14} className="opacity-40 group-hover:opacity-100 font-display" />
                          TAMAÑO
                      </button>
                      {showFontSizes && (
                          <div className="absolute top-full left-0 mt-2 bg-[#EDEDED] border border-black/10 rounded-xl shadow-2xl z-50 p-2 grid grid-cols-2 gap-1 w-32 animate-in fade-in zoom-in-95 duration-200">
                              {['12px', '16px', '18px', '20px', '24px', '32px', '48px', '64px'].map(size => (
                                  <button 
                                      key={size}
                                      onClick={() => {
                                          wrapSelection('fontsize', size);
                                          setShowFontSizes(false);
                                      }}
                                      className="text-[10px] font-black hover:bg-sasori-red hover:text-white p-2 rounded-lg transition-colors text-center text-[#1A1A1A]"
                                  >
                                      {size}
                                  </button>
                              ))}
                          </div>
                      )}
                  </div>

                  <div className="h-6 w-px bg-white/10 mx-2" />

                  <div className="flex flex-wrap gap-2 items-center">
                    {[
                      { label: 'IMG', type: 'img', icon: <ImageIcon size={14}/> },
                      { label: 'VIDEO', type: 'video', icon: <VideoIcon size={14}/> },
                      { label: 'ENLACE', type: 'link', icon: <Link size={14} /> },
                    ].map(btn => (
                      <button key={btn.label} type="button" onClick={() => wrapSelection(btn.type as any)} className="bg-white border border-black/10 hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group shadow-sm">
                        <span className="opacity-40 group-hover:opacity-100 transition-opacity">{btn.icon}</span>
                        {btn.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="h-6 w-px bg-white/10 mx-2" />
                  
                  <button 
                    type="button"
                    onClick={() => {
                        const currentText = editorRef.current?.innerText || "";
                        const newContent = autoFormatContent(currentText);
                        setEditorContent(newContent);
                        if (editorRef.current) {
                            editorRef.current.innerHTML = newContent;
                        }
                    }}
                    className="bg-sasori-red/20 hover:bg-sasori-red text-sasori-red hover:text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-sasori-red/30 animate-pulse hover:animate-none"
                  >
                    <Brain size={12} /> IA AUTO-FORMATEO
                  </button>
                </div>
                
                {/* DISK UPLOAD BUTTON */}
                <div className="flex flex-wrap gap-2 py-4 border-t border-black/5 mt-4 items-center">
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'content')} className="hidden" id="content-img-upload" />
                  <label htmlFor="content-img-upload" className="cursor-pointer bg-sasori-red/10 hover:bg-sasori-red text-sasori-red hover:text-white px-4 py-2 rounded-lg text-[9px] font-black tracking-widest transition-all flex items-center gap-2 uppercase whitespace-nowrap border border-sasori-red/30 shadow-sm">
                      <Upload size={12} /> Subir Imagen desde mi ordenador
                  </label>
                  <p className="text-[8px] uppercase font-bold text-[#1A1A1A]/20 tracking-widest ml-4 italic">Recomendado para SEO: imágenes de alta calidad {'>'} 1200px</p>
                </div>
                
                <div className="relative group mt-8">
                  <div className="absolute -left-4 top-0 h-full w-1 bg-sasori-red/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div 
                    ref={editorRef}
                    contentEditable
                    onInput={(e) => {
                        const newHTML = e.currentTarget.innerHTML;
                        setEditorContent(newHTML);
                        // Also sync to the specific translation slot in formData immediately to avoid stale state
                        setFormData(prev => ({
                            ...prev,
                            translations: {
                                ...prev.translations,
                                [masterLanguage]: { 
                                    ...prev.translations[masterLanguage], 
                                    content: newHTML 
                                }
                            }
                        }));
                    }}
                    dangerouslySetInnerHTML={{ __html: editorContent }}
                    className={cn(
                        "w-full min-h-[60vh] bg-transparent border-none text-lg text-[#1A1A1A]/70 leading-relaxed placeholder-black/5 focus:outline-none outline-none font-medium",
                        "prose max-w-none",
                        "prose-h2:text-3xl prose-h2:md:text-5xl prose-h2:font-black prose-h2:uppercase prose-h2:text-[#1A1A1A] prose-h2:mt-16 prose-h2:mb-8",
                        "prose-h3:text-xl prose-h3:md:text-3xl prose-h3:font-black prose-h3:uppercase prose-h3:text-[#1A1A1A]/90 prose-h3:mt-12 prose-h3:mb-6",
                        "prose-p:text-xl prose-p:leading-relaxed prose-p:text-[#1A1A1A]/70 prose-p:mb-8",
                        "prose-strong:text-sasori-red",
                        "prose-pre:bg-black/5 prose-pre:p-8 prose-pre:rounded-xl prose-pre:border prose-pre:border-black/5",
                        "prose-ul:space-y-4 prose-ul:my-12 prose-ul:list-none",
                        "prose-li:flex prose-li:items-start prose-li:gap-4 prose-li:text-xl prose-li:text-[#1A1A1A]/70"
                    )}
                    onPaste={handlePaste}
                    onMouseEnter={() => {
                        document.body.style.overflow = 'hidden';
                    }}
                    onMouseLeave={() => {
                        document.body.style.overflow = 'auto';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {/* End of Blogs Module */}
        </main>
      </div>
    </div>
  );
}
