import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, User, MessageSquare, Building, 
  ArrowRight, Sparkles, CheckCircle, Clock, Globe, Shield, Zap
} from 'lucide-react';

export function PremiumContact({ lang = 'es', hideTitle = false }: { lang?: string, hideTitle?: boolean }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const t = {
    es: {
      email: "Email",
      emailDesc: "Escríbenos directamente",
      phone: "Teléfono",
      phoneDesc: "Habla con nuestro equipo",
      visit: "Visítanos",
      visitDesc: "Nuestra sede central",
      stats: {
        response: "Tiempo de Respuesta",
        clients: "Clientes Globales",
        security: "Nivel de Seguridad",
        success: "Tasa de Éxito"
      },
      connect: "Conectemos",
      title1: "Ponte en",
      title2: "Contacto",
      subtitle: "¿Listo para transformar tu negocio con tecnología? Iniciemos una conversación sobre tus metas.",
      formTitle: "Envíanos un mensaje",
      formSubtitle: "Cuéntanos sobre tu proyecto y te responderemos en 24 horas.",
      namePlaceholder: "Tu Nombre",
      nameReq: "El nombre es requerido",
      emailPlaceholder: "Correo Electrónico",
      emailReq: "El correo es requerido",
      emailInv: "Por favor ingresa un correo válido",
      companyPlaceholder: "Empresa (Opcional)",
      msgPlaceholder: "Cuéntanos sobre tu proyecto...",
      msgReq: "El mensaje es requerido",
      msgInv: "El mensaje debe tener al menos 10 caracteres",
      send: "Enviar Mensaje",
      successTitle: "¡Mensaje Enviado!",
      successDesc: "Gracias por contactarnos. Te responderemos en menos de 24 horas.",
      sendAnother: "Enviar Otro Mensaje",
      otherWays: "Otras formas de contactarnos",
      otherWaysDesc: "Elige el método que mejor se adapte a ti.",
      guaranteeTitle: "Garantía de Respuesta Rápida",
      guaranteeDesc: "Nos enorgullecemos de nuestros tiempos de respuesta rápidos. Todas las consultas son respondidas en menos de 2 horas en horario laboral."
    },
    en: {
      email: "Email",
      emailDesc: "Write to us directly",
      phone: "Phone",
      phoneDesc: "Speak with our team",
      visit: "Visit Us",
      visitDesc: "Our headquarters",
      stats: {
        response: "Response Time",
        clients: "Global Clients",
        security: "Security Level",
        success: "Success Rate"
      },
      connect: "Let's Connect",
      title1: "Get in",
      title2: "Touch",
      subtitle: "Ready to transform your business with technology? Let's start a conversation about your goals.",
      formTitle: "Send us a message",
      formSubtitle: "Tell us about your project and we'll reply within 24 hours.",
      namePlaceholder: "Your Name",
      nameReq: "Name is required",
      emailPlaceholder: "Email Address",
      emailReq: "Email is required",
      emailInv: "Please enter a valid email",
      companyPlaceholder: "Company (Optional)",
      msgPlaceholder: "Tell us about your project...",
      msgReq: "Message is required",
      msgInv: "Message must be at least 10 characters",
      send: "Send Message",
      successTitle: "Message Sent!",
      successDesc: "Thank you for reaching out. We will get back to you within 24 hours.",
      sendAnother: "Send Another Message",
      otherWays: "Other ways to reach us",
      otherWaysDesc: "Choose the method that works best for you.",
      guaranteeTitle: "Quick Response Guarantee",
      guaranteeDesc: "We pride ourselves on rapid response times. All inquiries are typically answered within 2 hours during business hours."
    },
    zh: {
      email: "電子郵件",
      emailDesc: "直接寫信給我們",
      phone: "電話",
      phoneDesc: "與我們的團隊通話",
      visit: "訪問我們",
      visitDesc: "我們的總部",
      stats: {
        response: "響應時間",
        clients: "全球客戶",
        security: "安全級別",
        success: "成功率"
      },
      connect: "讓我們建立聯繫",
      title1: "保持",
      title2: "聯繫",
      subtitle: "準備好用技術轉型您的業務了嗎？讓我們開始討論您的目標。",
      formTitle: "發送消息",
      formSubtitle: "告訴我們您的項目，我們將在24小時內回覆。",
      namePlaceholder: "您的姓名",
      nameReq: "姓名是必填項",
      emailPlaceholder: "電子郵件地址",
      emailReq: "電子郵件是必填項",
      emailInv: "請輸入有效的電子郵件",
      companyPlaceholder: "公司名稱（可選）",
      msgPlaceholder: "告訴我們您的項目...",
      msgReq: "消息是必填項",
      msgInv: "消息必須至少包含10個字符",
      send: "發送消息",
      successTitle: "消息已發送！",
      successDesc: "感謝您的聯繫。我們將在24小時內回覆您。",
      sendAnother: "發送另一條消息",
      otherWays: "其他聯繫方式",
      otherWaysDesc: "選擇最適合您的方法。",
      guaranteeTitle: "快速響應保證",
      guaranteeDesc: "我們以快速響應時間為榮。所有諮詢通常在工作時間內2小時內得到答覆。"
    },
    ru: {
      email: "Email",
      emailDesc: "Напишите нам напрямую",
      phone: "Телефон",
      phoneDesc: "Поговорите с нашей командой",
      visit: "Посетите нас",
      visitDesc: "Наша штаб-квартира",
      stats: {
        response: "Время ответа",
        clients: "Клиенты по миру",
        security: "Уровень безопасности",
        success: "Процент успеха"
      },
      connect: "Давайте свяжемся",
      title1: "Будьте на",
      title2: "связи",
      subtitle: "Готовы трансформировать свой бизнес с помощью технологий? Давайте начнем разговор о ваших целях.",
      formTitle: "Отправьте нам сообщение",
      formSubtitle: "Расскажите нам о своем проекте, и мы ответим в течение 24 часов.",
      namePlaceholder: "Ваше имя",
      nameReq: "Имя обязательно",
      emailPlaceholder: "Электронная почта",
      emailReq: "Email обязателен",
      emailInv: "Пожалуйста, введите корректный email",
      companyPlaceholder: "Компания (необязательно)",
      msgPlaceholder: "Расскажите нам о своем проекте...",
      msgReq: "Сообщение обязательно",
      msgInv: "Сообщение должно содержать не менее 10 символов",
      send: "Отправить сообщение",
      successTitle: "Сообщение отправлено!",
      successDesc: "Спасибо за обращение. Мы свяжемся с вами в течение 24 часов.",
      sendAnother: "Отправить еще одно сообщение",
      otherWays: "Другие способы связи",
      otherWaysDesc: "Выберите наиболее подходящий для вас способ.",
      guaranteeTitle: "Гарантия быстрого ответа",
      guaranteeDesc: "Мы гордимся скоростью ответов. На все запросы обычно отвечаем в течение 2 часов в рабочее время."
    },
    pt: {
      email: "E-mail",
      emailDesc: "Escreva-nos diretamente",
      phone: "Telefone",
      phoneDesc: "Fale com nossa equipe",
      visit: "Visite-nos",
      visitDesc: "Nossa sede",
      stats: {
        response: "Tempo de Resposta",
        clients: "Clientes Globais",
        security: "Nível de Segurança",
        success: "Taxa de Sucesso"
      },
      connect: "Vamos Conectar",
      title1: "Entre em",
      title2: "Contato",
      subtitle: "Pronto para transformar seu negócio com tecnologia? Vamos iniciar uma conversa sobre seus objetivos.",
      formTitle: "Envie-nos uma mensagem",
      formSubtitle: "Conte-nos sobre seu projeto e responderemos em 24 horas.",
      namePlaceholder: "Seu Nome",
      nameReq: "O nome é obrigatório",
      emailPlaceholder: "Endereço de E-mail",
      emailReq: "O e-mail é obrigatório",
      emailInv: "Por favor, insira um e-mail válido",
      companyPlaceholder: "Empresa (Opcional)",
      msgPlaceholder: "Conte-nos sobre seu projeto...",
      msgReq: "A mensagem é obrigatória",
      msgInv: "A mensagem deve ter pelo menos 10 caracteres",
      send: "Enviar Mensagem",
      successTitle: "Mensagem Enviada!",
      successDesc: "Obrigado por entrar em contato. Retornaremos em 24 horas.",
      sendAnother: "Enviar Outra Mensagem",
      otherWays: "Outras formas de contato",
      otherWaysDesc: "Escolha o método que melhor lhe atenda.",
      guaranteeTitle: "Garantia de Resposta Rápida",
      guaranteeDesc: "Orgulhamo-nos de nossos tempos de resposta rápidos. Todas as consultas são normalmente respondidas em 2 horas durante o horário comercial."
    }
  }[lang as 'es' | 'en' | 'zh' | 'ru' | 'pt'] || {
    // Fallback
    email: "Email",
    emailDesc: "Write to us directly",
    phone: "Phone",
    phoneDesc: "Speak with our team",
    visit: "Visit Us",
    visitDesc: "Our headquarters",
    stats: {
      response: "Response Time",
      clients: "Global Clients",
      security: "Security Level",
      success: "Success Rate"
    },
    connect: "Let's Connect",
    title1: "Get in",
    title2: "Touch",
    subtitle: "Ready to transform your business with technology? Let's start a conversation about your goals.",
    formTitle: "Send us a message",
    formSubtitle: "Tell us about your project and we'll reply within 24 hours.",
    namePlaceholder: "Your Name",
    nameReq: "Name is required",
    emailPlaceholder: "Email Address",
    emailReq: "Email is required",
    emailInv: "Please enter a valid email",
    companyPlaceholder: "Company (Optional)",
    msgPlaceholder: "Tell us about your project...",
    msgReq: "Message is required",
    msgInv: "Message must be at least 10 characters",
    send: "Send Message",
    successTitle: "Message Sent!",
    successDesc: "Thank you for reaching out. We will get back to you within 24 hours.",
    sendAnother: "Send Another Message",
    otherWays: "Other ways to reach us",
    otherWaysDesc: "Choose the method that works best for you.",
    guaranteeTitle: "Quick Response Guarantee",
    guaranteeDesc: "We pride ourselves on rapid response times. All inquiries are typically answered within 2 hours during business hours."
  };

  const contactMethods = [
    {
      icon: Mail,
      title: t.email,
      description: t.emailDesc,
      value: "hello@sasorilabs.com",
      link: "mailto:hello@sasorilabs.com",
      gradient: "from-red-500/20 to-red-900/20",
    },
    {
      icon: Phone,
      title: t.phone,
      description: t.phoneDesc,
      value: "+1 (555) 123-4567",
      link: "tel:+15551234567",
      gradient: "from-rose-500/20 to-red-600/20",
    },
    {
      icon: MapPin,
      title: t.visit,
      description: t.visitDesc,
      value: "Ciudad de México",
      link: "#",
      gradient: "from-red-700/20 to-rose-900/20",
    }
  ];

  const companyStats = [
    { label: t.stats.response, value: "< 2 hrs", icon: Clock },
    { label: t.stats.clients, value: "50+", icon: Globe },
    { label: t.stats.security, value: "Enterprise", icon: Shield },
    { label: t.stats.success, value: "99.9%", icon: Zap }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t.nameReq;
    if (!formData.email.trim()) newErrors.email = t.emailReq;
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t.emailInv;
    if (!formData.message.trim()) newErrors.message = t.msgReq;
    else if (formData.message.trim().length < 10) newErrors.message = t.msgInv;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 0.86, 0.39, 0.96] } }
  } as any;

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
  } as any;

  return (
    <section id="contact" className="relative py-16 md:py-32 bg-[#F2F2F2] text-[#1A1A1A] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-sasori-red/[0.03] via-black/[0.01] to-sasori-red/[0.03]"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: '400% 400%' }}
        />
        <motion.div
          className="absolute top-1/3 left-1/5 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]"
          animate={{ x: [0, 200, 0], y: [0, 100, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/5 w-80 h-80 bg-sasori-red/10 rounded-full blur-[100px]"
          animate={{ x: [0, -150, 0], y: [0, -80, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div 
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto px-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Header */}
        {!hideTitle && (
          <motion.div className="text-center mb-20" variants={fadeInUp}>

            <motion.h2 className="text-3xl sm:text-6xl md:text-7xl font-black uppercase mb-6 md:mb-8 tracking-tighter" variants={fadeInUp}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1A1A1A] to-black/60">
                {t.title1}
              </span>
              <br className="hidden sm:block" />
              <motion.span 
                className="text-sasori-red"
                style={{ textShadow: '0 0 30px rgba(226,6,19,0.3)' }}
              >
                {t.title2}
              </motion.span>
            </motion.h2>
            
            <motion.p className="text-base sm:text-xl md:text-2xl text-black/50 max-w-4xl mx-auto leading-relaxed px-4 md:px-0" variants={fadeInUp}>
              {t.subtitle}
            </motion.p>
          </motion.div>
        )}

        {/* Stats */}
        {!hideTitle && (
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-12 md:mb-20" variants={fadeInUp}>
            {companyStats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-4 md:p-6 metallic-vinotinto-card rounded-2xl border border-white/5 group hover:border-sasori-red/30 transition-all shadow-lg"
                whileHover={{ scale: 1.05, y: -5 }}
                variants={fadeInUp}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:bg-sasori-red/20 transition-all">
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-white mb-0.5 md:mb-1">{stat.value}</div>
                <div className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div className="space-y-8" variants={fadeInUp}>
            <div>
              <h3 className="text-3xl font-bold text-[#1A1A1A] mb-4 uppercase tracking-tighter">{t.formTitle}</h3>
              <p className="text-black/50 text-lg">{t.formSubtitle}</p>
            </div>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black/20" />
                      <input
                        type="text"
                        placeholder={t.namePlaceholder}
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full pl-12 pr-4 py-4 bg-black/5 border rounded-xl text-[#1A1A1A] placeholder-black/20 focus:outline-none focus:border-sasori-red focus:bg-black/[0.08] transition-all ${errors.name ? 'border-red-500' : 'border-black/10'}`}
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black/20" />
                      <input
                        type="email"
                        placeholder={t.emailPlaceholder}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-12 pr-4 py-4 bg-black/5 border rounded-xl text-[#1A1A1A] placeholder-black/20 focus:outline-none focus:border-sasori-red focus:bg-black/[0.08] transition-all ${errors.email ? 'border-red-500' : 'border-black/10'}`}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black/20" />
                    <input
                      type="text"
                      placeholder={t.companyPlaceholder}
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-black/5 border border-black/10 rounded-xl text-[#1A1A1A] placeholder-black/20 focus:outline-none focus:border-sasori-red focus:bg-black/[0.08] transition-all"
                    />
                  </div>

                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-black/20" />
                    <textarea
                      placeholder={t.msgPlaceholder}
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 bg-black/5 border rounded-xl text-[#1A1A1A] placeholder-black/20 focus:outline-none focus:border-sasori-red focus:bg-black/[0.08] transition-all resize-none ${errors.message ? 'border-red-500' : 'border-black/10'}`}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative group overflow-hidden bg-sasori-red hover:bg-red-700 text-white font-bold tracking-widest uppercase py-4 px-6 rounded-xl transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          {t.send}
                        </>
                      )}
                    </span>
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 metallic-vinotinto-card border border-white/10 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                >
                  <div className="w-20 h-20 rounded-full bg-sasori-red/20 border border-sasori-red flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(226,6,19,0.3)]">
                    <CheckCircle className="w-10 h-10 text-sasori-red" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 uppercase">{t.successTitle}</h3>
                  <p className="text-white/50 text-lg mb-8 max-w-sm mx-auto">{t.successDesc}</p>
                  <button
                    onClick={() => { setIsSubmitted(false); setFormData({ name: '', email: '', company: '', message: '' }); }}
                    className="px-8 py-3 bg-sasori-red text-white border border-sasori-red rounded-full hover:bg-white hover:text-black hover:border-white transition-all font-semibold text-sm uppercase tracking-widest"
                  >
                    {t.sendAnother}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Methods */}
          <motion.div className="space-y-8 lg:pl-12" variants={fadeInUp}>
            <div>
              <h3 className="text-3xl font-bold text-[#1A1A1A] mb-4 uppercase tracking-tighter">{t.otherWays}</h3>
              <p className="text-black/50 text-lg">{t.otherWaysDesc}</p>
            </div>

            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.link}
                  className="block p-5 metallic-vinotinto-card rounded-2xl border border-white/5 hover:border-sasori-red/30 transition-all group overflow-hidden shadow-lg"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-xl bg-white/10 border border-white/10 flex flex-shrink-0 items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                      <method.icon className="w-6 h-6 text-white group-hover:text-sasori-red" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white uppercase tracking-widest">{method.title}</h4>
                      <p className="text-sasori-red text-sm font-medium">{method.value}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-sasori-red group-hover:translate-x-2 transition-all" />
                  </div>
                </a>
              ))}
            </div>

            <div className="p-6 metallic-vinotinto-card backdrop-blur-xl rounded-2xl border border-white/5 shadow-lg">
              <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">{t.guaranteeTitle}</h4>
              <p className="text-white/40 text-sm leading-relaxed">{t.guaranteeDesc}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
