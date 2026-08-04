"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, 
  Smartphone, Database, Lock, Cloud, Workflow, 
  BrainCircuit, CreditCard, Cpu, Network, BarChart3, 
  Megaphone, ShieldAlert, Send
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { supabase } from "@/src/lib/supabaseClient";

interface FunnelProps {
  lang?: string;
  onClose?: () => void;
}

const STORAGE_KEY = "sasori_funnel_draft";

const SERVICES = [
  { id: "frontend", icon: Smartphone, label: { es: "Frontend & UX/UI", en: "Frontend & UX/UI", pt: "Front-end e UX/UI", ru: "Фронтенд и UX/UI", zh: "前端和用户体验/用户界面" } },
  { id: "backend", icon: Database, label: { es: "Backend & Bases de Datos", en: "Backend & Databases", pt: "Back-end e bancos de dados", ru: "Бэкэнд и базы данных", zh: "后端和数据库" } },
  { id: "cybersec", icon: Lock, label: { es: "Ciberseguridad", en: "Cybersecurity", pt: "Cibersegurança", ru: "Кибербезопасность", zh: "网络安全" } },
  { id: "devops", icon: Cloud, label: { es: "DevOps & Cloud", en: "DevOps & Cloud", pt: "DevOps e nuvem", ru: "DevOps и облако", zh: "开发运营与云" } },
  { id: "ipaas", icon: Network, label: { es: "Integración iPaaS", en: "iPaaS integration", pt: "Integração iPaaS", ru: "iPaaS-интеграция", zh: "iPaaS 集成" } },
  { id: "ai", icon: BrainCircuit, label: { es: "IA Predictiva", en: "Predictive AI", pt: "IA preditiva", ru: "Прогнозирующий ИИ", zh: "预测人工智能" } },
  { id: "finops", icon: CreditCard, label: { es: "FinOps & SaaS", en: "FinOps & SaaS", pt: "FinOps e SaaS", ru: "FinOps и SaaS", zh: "金融运营与 SaaS" } },
  { id: "agents", icon: Cpu, label: { es: "Agentes Autónomos", en: "Autonomous Agents", pt: "Agentes Autônomos", ru: "Автономные агенты", zh: "自主代理" } },
  { id: "itsm", icon: Workflow, label: { es: "ITSM & Automatización", en: "ITSM & Automation", pt: "ITSM e automação", ru: "ИТСМ и автоматизация", zh: "ITSM 与自动化" } },
  { id: "bi", icon: BarChart3, label: { es: "BI & Gemelos Digitales", en: "BI & Digital Twins", pt: "BI e gêmeos digitais", ru: "BI и цифровые двойники", zh: "商业智能和数字孪生" } },
  { id: "marketing", icon: Megaphone, label: { es: "Marketing Generativo", en: "Generative Marketing", pt: "Marketing Generativo", ru: "Генеративный маркетинг", zh: "生成营销" } },
  { id: "devsecops", icon: ShieldAlert, label: { es: "DevSecOps & Compliance", en: "DevSecOps & Compliance", pt: "DevSecOps e conformidade", ru: "DevSecOps и соответствие требованиям", zh: "DevSecOps 与合规性" } },
];

export function InteractiveFunnel({ lang = "es", onClose }: FunnelProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const tDict = {
    es: {
      step1Title: "¿En qué podemos acelerar tu empresa?",
      step1Subtitle: "Paso 1 de 3 • Selecciona el pilar principal",
      step2Title: "Cuéntanos sobre tu proyecto",
      step2Subtitle: "Paso 2 de 3 • Guardado automático",
      company: "Empresa (Opcional)",
      website: "Sitio Web (Opcional)",
      techDesc: "Descripción técnica o retos",
      techDescPlaceholder: "Detalla lo que necesitas construir o solucionar...",
      limitExceeded: "Has excedido el límite.",
      step3Title: "¿A dónde enviamos el diagnóstico?",
      step3Subtitle: "Paso 3 de 3 • Privacidad garantizada",
      fullName: "Nombre Completo",
      corpEmail: "Correo Corporativo",
      guarantee: "Garantía de respuesta en menos de 2 horas laborables. Tus datos están cifrados de extremo a extremo y nunca enviaremos spam.",
      successTitle: "¡Solicitud Recibida!",
      successDesc: "Nuestro equipo técnico está evaluando tu requerimiento. Recibirás un diagnóstico en tu correo en breve.",
      whatsapp: "Hablar ahora por WhatsApp",
      return: "Volver al sitio",
      back: "Atrás",
      next: "Siguiente",
      sending: "Enviando...",
      submit: "Enviar Solicitud",
      errorSubmit: "Error al enviar. Inténtalo de nuevo.",
    },
    en: {
      step1Title: "How can we accelerate your business?",
      step1Subtitle: "Step 1 of 3 • Select the main pillar",
      step2Title: "Tell us about your project",
      step2Subtitle: "Step 2 of 3 • Auto-saving",
      company: "Company (Optional)",
      website: "Website (Optional)",
      techDesc: "Technical description or challenges",
      techDescPlaceholder: "Detail what you need to build or solve...",
      limitExceeded: "Limit exceeded.",
      step3Title: "Where do we send the diagnosis?",
      step3Subtitle: "Step 3 of 3 • Privacy guaranteed",
      fullName: "Full Name",
      corpEmail: "Corporate Email",
      guarantee: "Guaranteed response in under 2 business hours. Your data is E2E encrypted and we will never send spam.",
      successTitle: "Request Received!",
      successDesc: "Our technical team is evaluating your request. You will receive a diagnosis in your email shortly.",
      whatsapp: "Chat now on WhatsApp",
      return: "Return to site",
      back: "Back",
      next: "Next",
      sending: "Sending...",
      submit: "Submit Request",
      errorSubmit: "Error sending. Please try again.",
    },
    pt: {
      step1Title: "Como podemos acelerar sua empresa?",
      step1Subtitle: "Passo 1 de 3 • Selecione o pilar principal",
      step2Title: "Conte-nos sobre seu projeto",
      step2Subtitle: "Passo 2 de 3 • Salvamento automático",
      company: "Empresa (opcional)",
      website: "Site (opcional)",
      techDesc: "Descrição técnica ou desafios",
      techDescPlaceholder: "Detalhe o que você precisa construir ou resolver...",
      limitExceeded: "Você excedeu o limite.",
      step3Title: "Para onde enviamos o diagnóstico?",
      step3Subtitle: "Passo 3 de 3 • Privacidade garantida",
      fullName: "Nome completo",
      corpEmail: "E-mail Corporativo",
      guarantee: "Garantia de resposta em menos de 2 horas úteis. Seus dados são criptografados de ponta a ponta e nunca enviaremos spam.",
      successTitle: "Solicitação recebida!",
      successDesc: "Nossa equipe técnica está avaliando sua necessidade. Você receberá um diagnóstico em seu e-mail em breve.",
      whatsapp: "Fale agora no WhatsApp",
      return: "Voltar ao site",
      back: "Voltar",
      next: "Seguindo",
      sending: "Enviando...",
      submit: "Enviar solicitação",
      errorSubmit: "Erro ao enviar. Tente novamente.",
    },
    ru: {
      step1Title: "Как мы можем ускорить работу вашей компании?",
      step1Subtitle: "Шаг 1 из 3 • Выберите основной столбец",
      step2Title: "Расскажите нам о своем проекте",
      step2Subtitle: "Шаг 2 из 3 • Автоматическое сохранение",
      company: "Компания (необязательно)",
      website: "Веб-сайт (необязательно)",
      techDesc: "Техническое описание или проблемы",
      techDescPlaceholder: "Подробно опишите, что вам нужно построить или решить...",
      limitExceeded: "Вы превысили лимит.",
      step3Title: "Куда отправить диагноз?",
      step3Subtitle: "Шаг 3 из 3 • Конфиденциальность гарантирована",
      fullName: "Полное имя",
      corpEmail: "Корпоративная электронная почта",
      guarantee: "Гарантия ответа менее чем за 2 рабочих часа. Ваши данные полностью зашифрованы, и мы никогда не будем рассылать спам.",
      successTitle: "Запрос получен!",
      successDesc: "Наша техническая команда оценивает ваше требование. В ближайшее время вы получите диагноз на свою электронную почту.",
      whatsapp: "Поговорите сейчас в WhatsApp",
      return: "Вернуться на сайт",
      back: "Назад",
      next: "Следующий",
      sending: "Отправка...",
      submit: "Отправить запрос",
      errorSubmit: "Ошибка отправки. Попробуйте еще раз.",
    },
    zh: {
      step1Title: "我们如何才能加速您的公司发展？",
      step1Subtitle: "第 1 步（共 3 步） • 选择主要支柱",
      step2Title: "告诉我们您的项目",
      step2Subtitle: "第 2 步（共 3 步） • 自动保存",
      company: "公司（可选）",
      website: "网站（可选）",
      techDesc: "技术描述或挑战",
      techDescPlaceholder: "详细说明您需要构建或解决什么...",
      limitExceeded: "您已超出限制。",
      step3Title: "我们将诊断结果发送到哪里？",
      step3Subtitle: "第 3 步（共 3 步） • 保证隐私",
      fullName: "姓名",
      corpEmail: "企业邮箱",
      guarantee: "保证在2个工作小时内响应。您的数据经过端到端加密，我们绝不会发送垃圾邮件。",
      successTitle: "请求已收到！",
      successDesc: "我们的技术团队正在评估您的要求。您很快就会在电子邮件中收到诊断结果。",
      whatsapp: "立即通过 WhatsApp 交谈",
      return: "返回网站",
      back: "后退",
      next: "下列的",
      sending: "正在发送...",
      submit: "提交请求",
      errorSubmit: "发送错误。再试一次。",
    },
  };
  const t = tDict[lang as keyof typeof tDict] || tDict.en;


  const [formData, setFormData] = useState({
    serviceType: "",
    description: "",
    company: "",
    website: "",
    name: "",
    email: "",
  });

  // Cargar borrador al montar (Solo lado cliente)
  useEffect(() => {
    const draft = sessionStorage.getItem(STORAGE_KEY);
    if (draft) {
      try { setFormData(JSON.parse(draft)); } catch (e) {}
    }
  }, []);

  // Autoguardado cada vez que formData cambia
  useEffect(() => {
    if (step < 4) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, step]);

  const handleNext = () => setStep((p) => p + 1);
  const handleBack = () => setStep((p) => p - 1);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.description) return;
    
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const { error } = await supabase
        .from('contact_leads')
        .insert([{
          service_type: formData.serviceType,
          description: formData.description.trim(),
          company: formData.company.trim() || null,
          website: formData.website.trim() || null,
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          lang: lang,
          status: 'pending'
        }]);

      if (error) throw error;

      // Limpiar borrador tras el éxito
      sessionStorage.removeItem(STORAGE_KEY);
      setStep(4); // Pantalla de éxito
    } catch (err: any) {
      console.error("Error saving lead:", err);
      setErrorMsg(lang === "es" ? "Error al enviar. Inténtalo de nuevo." : "Error sending. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

    const charCount = formData.description.length;
  const maxChars = 20000;
  const progressPercent = (step / 4) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-black/5 overflow-hidden flex flex-col min-h-[600px] relative">
      
      {/* Barra de progreso global */}
      <div className="w-full h-1.5 bg-zinc-100">
        <motion.div 
          className="h-full bg-sasori-red"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="p-8 md:p-12 flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* PASO 1: Selección de Servicio */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-grow flex flex-col"
            >
              <h2 className="text-2xl md:text-3xl font-black text-[#1A1A1A] uppercase tracking-tight mb-2">
                {t.step1Title}
              </h2>
              <p className="text-zinc-500 text-sm mb-8">
                {t.step1Subtitle}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 flex-grow content-start">
                {SERVICES.map((srv) => {
                  const Icon = srv.icon;
                  const isSelected = formData.serviceType === srv.id;
                  return (
                    <button
                      key={srv.id}
                      onClick={() => {
                        setFormData({ ...formData, serviceType: srv.id });
                        setTimeout(handleNext, 300); // Auto-avance suave
                      }}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 text-center gap-3 group",
                        isSelected 
                          ? "border-sasori-red bg-sasori-red/5 shadow-[0_0_15px_rgba(226,6,19,0.1)]" 
                          : "border-black/5 hover:border-sasori-red/40 hover:bg-zinc-50"
                      )}
                    >
                      <Icon className={cn("w-6 h-6 transition-colors", isSelected ? "text-sasori-red" : "text-zinc-400 group-hover:text-sasori-red")} />
                      <span className={cn("text-xs font-bold uppercase tracking-wide", isSelected ? "text-sasori-red" : "text-zinc-600")}>
                        {srv.label[lang as keyof typeof srv.label] || srv.label.en}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* PASO 2: Descripción y Detalles */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-grow flex flex-col"
            >
              <h2 className="text-2xl md:text-3xl font-black text-[#1A1A1A] uppercase tracking-tight mb-2">
                {t.step2Title}
              </h2>
              <p className="text-zinc-500 text-sm mb-8 flex items-center gap-2">
                {t.step2Subtitle}
                <Cloud size={14} className="text-emerald-500 animate-pulse" />
              </p>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase text-zinc-800 tracking-wider">
                      {t.company}
                    </label>
                    <input 
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-black/10 focus:outline-none focus:border-sasori-red focus:ring-1 focus:ring-sasori-red transition-all"
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase text-zinc-800 tracking-wider">
                      {t.website}
                    </label>
                    <input 
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-black/10 focus:outline-none focus:border-sasori-red focus:ring-1 focus:ring-sasori-red transition-all"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-1.5 relative">
                  <label className="text-xs font-extrabold uppercase text-zinc-800 tracking-wider flex justify-between">
                    <span>{t.techDesc} *</span>
                    <span className={cn(charCount > maxChars ? "text-sasori-red" : "text-zinc-400")}>
                      {charCount.toLocaleString()} / {maxChars.toLocaleString()}
                    </span>
                  </label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 h-48 resize-none rounded-xl bg-zinc-50 border border-black/10 focus:outline-none focus:border-sasori-red focus:ring-1 focus:ring-sasori-red transition-all"
                    placeholder={t.techDescPlaceholder}
                  />
                  {charCount > maxChars && (
                    <span className="text-xs font-bold text-sasori-red absolute -bottom-5 right-0">
                      {t.limitExceeded}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* PASO 3: Datos de Contacto */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-grow flex flex-col"
            >
              <h2 className="text-2xl md:text-3xl font-black text-[#1A1A1A] uppercase tracking-tight mb-2">
                {t.step3Title}
              </h2>
              <p className="text-zinc-500 text-sm mb-8">
                {t.step3Subtitle}
              </p>

              <div className="space-y-6 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase text-zinc-800 tracking-wider">
                    {t.fullName} *
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-black/10 focus:outline-none focus:border-sasori-red focus:ring-1 focus:ring-sasori-red transition-all"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase text-zinc-800 tracking-wider">
                    {t.corpEmail} *
                  </label>
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-black/10 focus:outline-none focus:border-sasori-red focus:ring-1 focus:ring-sasori-red transition-all"
                    placeholder="john@company.com"
                  />
                </div>

                <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {t.guarantee}
                  </p>
                </div>

                {errorMsg && (
                  <div className="text-xs font-bold text-sasori-red p-3 bg-sasori-red/10 rounded-lg text-center">
                    {errorMsg}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* PASO 4: Success (Éxito) */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="flex-grow flex flex-col items-center justify-center text-center space-y-6 py-10"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A] uppercase tracking-tight">
                {t.successTitle}
              </h2>
              <p className="text-zinc-500 text-sm max-w-md mx-auto leading-relaxed">
                {t.successDesc}
              </p>

              <div className="w-full max-w-xs space-y-3 pt-6">
                <a 
                  href="https://wa.me/MESSAGE_LINK" // CAMBIAR POR TU WHATSAPP REAL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#25D366] hover:bg-[#1EBE53] shadow-[0_4px_15px_rgba(37,211,102,0.3)] transition-all"
                >
                  {t.whatsapp}
                </a>
                {onClose && (
                  <button 
                    onClick={onClose}
                    className="w-full px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-zinc-600 hover:bg-zinc-100 transition-all"
                  >
                    {t.return}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controles de Navegación Inferior (Footer) */}
      {step < 4 && (
        <div className="border-t border-black/5 bg-zinc-50/50 p-6 md:px-12 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className={cn(
              "flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-wider transition-all",
              step === 1 ? "opacity-0 pointer-events-none" : "text-zinc-500 hover:text-zinc-900"
            )}
          >
            <ArrowLeft size={16} /> {t.back}
          </button>

          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !formData.serviceType) || 
                (step === 2 && (!formData.description || charCount > maxChars))
              }
              className="flex items-center gap-2 px-8 py-3 rounded-full font-extrabold text-xs uppercase tracking-widest text-white bg-sasori-red hover:bg-sasori-red/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(226,6,19,0.3)] transition-all"
            >
              {t.next} <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name || !formData.email}
              className="flex items-center gap-2 px-8 py-3 rounded-full font-extrabold text-xs uppercase tracking-widest text-white bg-sasori-red hover:bg-sasori-red/90 disabled:opacity-50 shadow-[0_4px_15px_rgba(226,6,19,0.3)] transition-all"
            >
              {isSubmitting ? (
                <span className="animate-pulse">{t.sending}</span>
              ) : (
                <>{t.submit} <Send size={16} /></>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default InteractiveFunnel;
