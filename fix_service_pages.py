#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Regenerates src/pages/service-pages.tsx with:
  - Clean UTF-8 encoding
  - All 3 required exports: AIAutomationPage, ImmersiveWebsPage, ModernizationPage
  - Correct JSX return types (not void)
  - Full multilingual content (es, en, zh, ru, pt)
"""

content = '''\
import React from "react";
import { ServicePage } from "../components/ui/service-page";

/* =========================================================
   AI AUTOMATION PAGE
   Route: /services/ai-automation
   ========================================================= */

export function AIAutomationPage({ lang = "es" }: { lang?: string }): JSX.Element {
  const content = {
    es: {
      serviceName: "Automatización IA",
      tagline: "Agentes Inteligentes que\\nTrabajan para su Éxito",
      description:
        "Diseñamos ecosistemas de agentes de IA de élite que automatizan procesos críticos, toman decisiones autónomas y escalan operaciones más allá de los límites humanos.",
      sections: [
        {
          imgUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80",
          subheading: "Multi-Agente",
          heading: "Orquestación Autónoma",
          bodyTitle: "Sistemas que piensan y actúan",
          bodyText1:
            "Nuestros agentes multimodelo coordinan tareas complejas entre departamentos: ventas, soporte, operaciones y análisis, sin intervención humana constante.",
          bodyText2:
            "Integramos modelos GPT-4, Claude y Gemini con sus sistemas existentes para crear un cerebro operativo que funciona 24/7.",
          ctaLabel: "Ver Demo",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80",
          subheading: "RAG & Memoria",
          heading: "IA con Contexto de Negocio",
          bodyTitle: "Su empresa como una base de conocimiento viva",
          bodyText1:
            "Implementamos sistemas RAG (Retrieval-Augmented Generation) que convierten su documentación, CRM y datos históricos en el contexto que su IA necesita.",
          bodyText2:
            "El resultado: respuestas precisas, relevantes y específicas para su industria en lugar de respuestas genéricas de modelos base.",
          ctaLabel: "Saber Más",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600&q=80",
          subheading: "ROI",
          heading: "Rentabilidad desde el Primer Día",
          bodyTitle: "Resultados medibles, no promesas",
          bodyText1:
            "Cada despliegue de IA incluye métricas de impacto: horas ahorradas, costos reducidos, errores eliminados. Nuestros clientes reportan 60-80% de reducción en tareas repetitivas.",
          bodyText2:
            "Comenzamos con una prueba piloto de 30 días para validar el valor antes de escalar a toda la organización.",
          ctaLabel: "Iniciar Proyecto",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=1600&q=80",
          subheading: "Voz e Interacción",
          heading: "Agentes de Voz con IA",
          bodyTitle: "Comunicación fluida y natural 24/7",
          bodyText1:
            "Implementamos sistemas de voz inteligentes que gestionan llamadas entrantes y salientes con lenguaje natural, resolviendo hasta el 70% de las consultas sin operadores.",
          bodyText2:
            "Nuestros agentes de voz se integran con CRM, calendarios y bases de datos en tiempo real para una atención personalizada a escala.",
          ctaLabel: "Explorar Solución",
        },
      ],
    },
    en: {
      serviceName: "AI Automation",
      tagline: "Intelligent Agents that\\nWork for Your Success",
      description:
        "We design elite AI agent ecosystems that automate critical processes, make autonomous decisions, and scale operations beyond human limits.",
      sections: [
        {
          imgUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80",
          subheading: "Multi-Agent",
          heading: "Autonomous Orchestration",
          bodyTitle: "Systems that think and act",
          bodyText1:
            "Our multi-model agents coordinate complex tasks across departments — sales, support, operations, and analytics — without constant human intervention.",
          bodyText2:
            "We integrate GPT-4, Claude, and Gemini models with your existing systems to create an operational brain that works 24/7.",
          ctaLabel: "View Demo",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80",
          subheading: "RAG & Memory",
          heading: "AI with Business Context",
          bodyTitle: "Your company as a living knowledge base",
          bodyText1:
            "We implement RAG (Retrieval-Augmented Generation) systems that convert your documentation, CRM, and historical data into the context your AI needs.",
          bodyText2:
            "The result: precise, relevant, and industry-specific answers instead of generic base model responses.",
          ctaLabel: "Learn More",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600&q=80",
          subheading: "ROI",
          heading: "Profitability from Day One",
          bodyTitle: "Measurable results, not promises",
          bodyText1:
            "Every AI deployment includes impact metrics: hours saved, costs reduced, errors eliminated. Our clients report 60-80% reduction in repetitive tasks.",
          bodyText2:
            "We start with a 30-day pilot test to validate value before scaling to the entire organization.",
          ctaLabel: "Start Project",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=1600&q=80",
          subheading: "Voice & Interaction",
          heading: "AI Voice Agents",
          bodyTitle: "Fluid, natural communication 24/7",
          bodyText1:
            "We implement intelligent voice systems that handle inbound and outbound calls with natural language, resolving up to 70% of inquiries without operators.",
          bodyText2:
            "Our voice agents integrate with CRM, calendars, and databases in real time for personalized service at scale.",
          ctaLabel: "Explore Solution",
        },
      ],
    },
    zh: {
      serviceName: "AI 自动化",
      tagline: "智能代理\\n为您的成功而工作",
      description:
        "我们设计精英 AI 代理生态系统，自动化关键流程，做出自主决策，并将运营规模扩展到人类极限之外。",
      sections: [
        {
          imgUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80",
          subheading: "多代理",
          heading: "自主编排",
          bodyTitle: "思考和行动的系统",
          bodyText1:
            "我们的多模型代理协调跨部门的复杂任务——销售、支持、运营和分析——无需持续的人工干预。",
          bodyText2:
            "我们将 GPT-4、Claude 和 Gemini 模型与您现有的系统集成，创建一个全天候运作的运营大脑。",
          ctaLabel: "查看演示",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80",
          subheading: "RAG 与记忆",
          heading: "具有业务背景的 AI",
          bodyTitle: "您的公司作为活知识库",
          bodyText1:
            "我们实施 RAG（检索增强生成）系统，将您的文档、CRM 和历史数据转化为 AI 所需的背景信息。",
          bodyText2:
            "结果：精确、相关且特定于行业的答案，而非通用的基础模型响应。",
          ctaLabel: "了解更多",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600&q=80",
          subheading: "投资回报率",
          heading: "从第一天起盈利",
          bodyTitle: "可衡量的结果，而非承诺",
          bodyText1:
            "每次 AI 部署都包括影响指标：节省的小时数、降低的成本、消除的错误。我们的客户报告重复性任务减少了 60-80%。",
          bodyText2:
            "我们从 30 天试点开始验证价值，然后再扩展到整个组织。",
          ctaLabel: "启动项目",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=1600&q=80",
          subheading: "语音与交互",
          heading: "AI 语音代理",
          bodyTitle: "全天候流畅自然的沟通",
          bodyText1:
            "我们实施智能语音系统，以自然语言处理入站和出站呼叫，无需操作员即可解决高达 70% 的查询。",
          bodyText2:
            "我们的语音代理实时与 CRM、日历和数据库集成，实现大规模个性化服务。",
          ctaLabel: "探索解决方案",
        },
      ],
    },
    ru: {
      serviceName: "ИИ-Автоматизация",
      tagline: "Интеллектуальные агенты,\\nработающие для вашего успеха",
      description:
        "Мы разрабатываем элитные экосистемы ИИ-агентов, которые автоматизируют критические процессы, принимают автономные решения и масштабируют операции за пределы человеческих возможностей.",
      sections: [
        {
          imgUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80",
          subheading: "Мультиагент",
          heading: "Автономная Оркестрация",
          bodyTitle: "Системы, которые думают и действуют",
          bodyText1:
            "Наши мультимодельные агенты координируют сложные задачи между отделами — продажи, поддержку, операции и аналитику — без постоянного вмешательства человека.",
          bodyText2:
            "Мы интегрируем модели GPT-4, Claude и Gemini с вашими существующими системами для создания операционного мозга, работающего 24/7.",
          ctaLabel: "Смотреть Демо",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80",
          subheading: "RAG и Память",
          heading: "ИИ с Бизнес-Контекстом",
          bodyTitle: "Ваша компания как живая база знаний",
          bodyText1:
            "Мы внедряем системы RAG (Retrieval-Augmented Generation), которые превращают вашу документацию, CRM и исторические данные в контекст, необходимый вашему ИИ.",
          bodyText2:
            "Результат: точные, релевантные и специфичные для вашей отрасли ответы вместо общих ответов базовых моделей.",
          ctaLabel: "Узнать Больше",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600&q=80",
          subheading: "ROI",
          heading: "Прибыльность с первого дня",
          bodyTitle: "Измеримые результаты, не обещания",
          bodyText1:
            "Каждое внедрение ИИ включает метрики воздействия: сэкономленные часы, сниженные затраты, устранённые ошибки. Наши клиенты сообщают о сокращении повторяющихся задач на 60-80%.",
          bodyText2:
            "Мы начинаем с 30-дневного пилотного проекта для проверки ценности перед масштабированием на всю организацию.",
          ctaLabel: "Начать Проект",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=1600&q=80",
          subheading: "Голос и Взаимодействие",
          heading: "Голосовые ИИ-Агенты",
          bodyTitle: "Свободное и естественное общение 24/7",
          bodyText1:
            "Мы внедряем интеллектуальные голосовые системы, которые обрабатывают входящие и исходящие звонки на естественном языке, решая до 70% запросов без операторов.",
          bodyText2:
            "Наши голосовые агенты интегрируются с CRM, календарями и базами данных в режиме реального времени для персонализированного обслуживания в масштабе.",
          ctaLabel: "Изучить Решение",
        },
      ],
    },
    pt: {
      serviceName: "Automação IA",
      tagline: "Agentes Inteligentes que\\nTrabalham para o seu Sucesso",
      description:
        "Projetamos ecossistemas de agentes de IA de elite que automatizam processos críticos, tomam decisões autônomas e escalam operações além dos limites humanos.",
      sections: [
        {
          imgUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80",
          subheading: "Multi-Agente",
          heading: "Orquestração Autônoma",
          bodyTitle: "Sistemas que pensam e agem",
          bodyText1:
            "Nossos agentes multimodelo coordenam tarefas complexas entre departamentos — vendas, suporte, operações e análise — sem intervenção humana constante.",
          bodyText2:
            "Integramos modelos GPT-4, Claude e Gemini com seus sistemas existentes para criar um cérebro operacional que funciona 24/7.",
          ctaLabel: "Ver Demo",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80",
          subheading: "RAG & Memória",
          heading: "IA com Contexto de Negócio",
          bodyTitle: "Sua empresa como uma base de conhecimento viva",
          bodyText1:
            "Implementamos sistemas RAG (Retrieval-Augmented Generation) que convertem sua documentação, CRM e dados históricos no contexto que sua IA precisa.",
          bodyText2:
            "O resultado: respostas precisas, relevantes e específicas para seu setor, em vez de respostas genéricas de modelos base.",
          ctaLabel: "Saiba Mais",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600&q=80",
          subheading: "ROI",
          heading: "Rentabilidade desde o Primeiro Dia",
          bodyTitle: "Resultados mensuráveis, não promessas",
          bodyText1:
            "Cada implantação de IA inclui métricas de impacto: horas economizadas, custos reduzidos, erros eliminados. Nossos clientes relatam 60-80% de redução em tarefas repetitivas.",
          bodyText2:
            "Começamos com um piloto de 30 dias para validar o valor antes de escalar para toda a organização.",
          ctaLabel: "Iniciar Projeto",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=1600&q=80",
          subheading: "Voz e Interação",
          heading: "Agentes de Voz com IA",
          bodyTitle: "Comunicação fluida e natural 24/7",
          bodyText1:
            "Implementamos sistemas de voz inteligentes que gerenciam chamadas recebidas e realizadas com linguagem natural, resolvendo até 70% das consultas sem operadores.",
          bodyText2:
            "Nossos agentes de voz se integram com CRM, calendários e bancos de dados em tempo real para atendimento personalizado em escala.",
          ctaLabel: "Explorar Solução",
        },
      ],
    },
  };

  const c = content[lang as keyof typeof content] ?? content.es;
  return <ServicePage {...c} serviceName={c.serviceName} lang={lang} />;
}

/* =========================================================
   IMMERSIVE WEBS PAGE
   Route: /services/immersive-webs
   ========================================================= */

export function ImmersiveWebsPage({ lang = "es" }: { lang?: string }): JSX.Element {
  const content = {
    es: {
      serviceName: "Webs Inmersivas",
      tagline: "Experiencias Digitales que\\nCaptivan y Convierten",
      description:
        "Construimos plataformas web de alto impacto para pymes y comercios locales que quieren competir con los grandes: diseño premium, velocidad nativa y presencia digital omnipresente.",
      sections: [
        {
          imgUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1600&q=80",
          subheading: "Diseño de Élite",
          heading: "Interfaces que Convierten",
          bodyTitle: "Tu presencia digital como ventaja competitiva",
          bodyText1:
            "Cada píxel está diseñado para cautivar: animaciones cinematográficas, tipografía de impacto y paletas que comunican autoridad de marca desde el primer vistazo.",
          bodyText2:
            "Nuestras interfaces superan los estándares de UX de las grandes marcas, llevando ese nivel de excelencia al mercado local y pyme.",
          ctaLabel: "Ver Portafolio",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1600&q=80",
          subheading: "Rendimiento",
          heading: "Velocidad como Superpoder",
          bodyTitle: "Sitios que cargan en menos de 1 segundo",
          bodyText1:
            "Utilizamos arquitecturas JAMstack, edge computing y optimización de assets para lograr puntuaciones Core Web Vitals perfectas que favorecen el posicionamiento SEO.",
          bodyText2:
            "Un sitio más rápido no solo mejora la experiencia del usuario: aumenta las conversiones hasta un 32% según estudios de Google.",
          ctaLabel: "Auditoría Gratuita",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600&q=80",
          subheading: "Ecosistema Digital",
          heading: "Más que un Sitio Web",
          bodyTitle: "Una plataforma completa de captación",
          bodyText1:
            "Integramos booking online, pagos, CRM, chatbots con IA y analítica avanzada para convertir tu web en una máquina de ventas autónoma.",
          bodyText2:
            "Desde una tienda local hasta un despacho profesional: construimos el ecosistema digital que elimina fricciones y maximiza cada interacción con el cliente.",
          ctaLabel: "Diseñar mi Ecosistema",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
          subheading: "Omnipresencia",
          heading: "SEO & Presencia Local Total",
          bodyTitle: "Que te encuentren antes que a la competencia",
          bodyText1:
            "Dominamos las búsquedas locales con estrategias de SEO técnico, contenido semántico y optimización de Google Business Profile para que aparezcas primero en tu zona.",
          bodyText2:
            "Combinamos posicionamiento orgánico con campañas de retargeting digital para mantener tu marca visible en cada etapa del proceso de compra del cliente.",
          ctaLabel: "Liderar mi Zona",
        },
      ],
    },
    en: {
      serviceName: "Immersive Webs",
      tagline: "Digital Experiences that\\nCaptivate and Convert",
      description:
        "We build high-impact web platforms for SMEs and local businesses that want to compete with the big players: premium design, native speed, and omnipresent digital presence.",
      sections: [
        {
          imgUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1600&q=80",
          subheading: "Elite Design",
          heading: "Interfaces that Convert",
          bodyTitle: "Your digital presence as a competitive advantage",
          bodyText1:
            "Every pixel is designed to captivate: cinematic animations, impactful typography, and palettes that communicate brand authority at first glance.",
          bodyText2:
            "Our interfaces surpass the UX standards of major brands, bringing that level of excellence to the local and SME market.",
          ctaLabel: "View Portfolio",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1600&q=80",
          subheading: "Performance",
          heading: "Speed as a Superpower",
          bodyTitle: "Sites that load in under 1 second",
          bodyText1:
            "We use JAMstack architectures, edge computing, and asset optimization to achieve perfect Core Web Vitals scores that favor SEO positioning.",
          bodyText2:
            "A faster site not only improves user experience: it increases conversions by up to 32% according to Google studies.",
          ctaLabel: "Free Audit",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600&q=80",
          subheading: "Digital Ecosystem",
          heading: "More than a Website",
          bodyTitle: "A complete customer acquisition platform",
          bodyText1:
            "We integrate online booking, payments, CRM, AI chatbots, and advanced analytics to turn your website into an autonomous sales machine.",
          bodyText2:
            "From a local store to a professional office: we build the digital ecosystem that eliminates friction and maximizes every customer interaction.",
          ctaLabel: "Design My Ecosystem",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
          subheading: "Omnipresence",
          heading: "SEO & Total Local Presence",
          bodyTitle: "Be found before the competition",
          bodyText1:
            "We dominate local searches with technical SEO strategies, semantic content, and Google Business Profile optimization so you appear first in your area.",
          bodyText2:
            "We combine organic positioning with digital retargeting campaigns to keep your brand visible at every stage of the customer buying process.",
          ctaLabel: "Lead My Area",
        },
      ],
    },
    zh: {
      serviceName: "沉浸式网站",
      tagline: "数字体验\\n迷人且转化率高",
      description:
        "我们为希望与大品牌竞争的中小企业和本地商户构建高影响力网络平台：高端设计、原生速度和无处不在的数字存在。",
      sections: [
        {
          imgUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1600&q=80",
          subheading: "精英设计",
          heading: "能转化的界面",
          bodyTitle: "您的数字形象作为竞争优势",
          bodyText1:
            "每个像素都经过精心设计：电影级动画、震撼排版和传达品牌权威的配色方案，第一眼就令人印象深刻。",
          bodyText2:
            "我们的界面超越了大品牌的用户体验标准，将这种卓越水平带到本地和中小企业市场。",
          ctaLabel: "查看作品集",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1600&q=80",
          subheading: "性能",
          heading: "速度作为超级武器",
          bodyTitle: "在1秒内加载的网站",
          bodyText1:
            "我们使用 JAMstack 架构、边缘计算和资源优化，实现完美的 Core Web Vitals 分数，有利于 SEO 排名。",
          bodyText2:
            "更快的网站不仅能改善用户体验：根据谷歌研究，它还能将转化率提高多达 32%。",
          ctaLabel: "免费审计",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600&q=80",
          subheading: "数字生态系统",
          heading: "不仅仅是一个网站",
          bodyTitle: "完整的客户获取平台",
          bodyText1:
            "我们整合在线预订、支付、CRM、AI 聊天机器人和高级分析，将您的网站变成自主销售机器。",
          bodyText2:
            "从本地店铺到专业办公室：我们构建消除摩擦并最大化每次客户互动的数字生态系统。",
          ctaLabel: "设计我的生态系统",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
          subheading: "无处不在",
          heading: "SEO 和全方位本地存在",
          bodyTitle: "在竞争对手之前被找到",
          bodyText1:
            "我们通过技术 SEO 策略、语义内容和谷歌商家资料优化主导本地搜索，让您在所在区域排名第一。",
          bodyText2:
            "我们将自然排名与数字再营销活动相结合，在客户购买过程的每个阶段保持您的品牌可见度。",
          ctaLabel: "引领我的区域",
        },
      ],
    },
    ru: {
      serviceName: "Иммерсивные Сайты",
      tagline: "Цифровые Опыты, которые\\nЗавораживают и Конвертируют",
      description:
        "Мы создаём высокоэффективные веб-платформы для МСП и местного бизнеса, который хочет конкурировать с крупными игроками: премиум-дизайн, нативная скорость и вездесущее цифровое присутствие.",
      sections: [
        {
          imgUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1600&q=80",
          subheading: "Элитный Дизайн",
          heading: "Интерфейсы, которые Конвертируют",
          bodyTitle: "Ваше цифровое присутствие как конкурентное преимущество",
          bodyText1:
            "Каждый пиксель разработан, чтобы завораживать: кинематографические анимации, яркая типографика и палитры, передающие авторитет бренда с первого взгляда.",
          bodyText2:
            "Наши интерфейсы превосходят стандарты UX крупных брендов, принося этот уровень совершенства на локальный и МСП рынок.",
          ctaLabel: "Посмотреть Портфолио",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1600&q=80",
          subheading: "Производительность",
          heading: "Скорость как Суперспособность",
          bodyTitle: "Сайты, загружающиеся менее чем за 1 секунду",
          bodyText1:
            "Мы используем архитектуры JAMstack, edge computing и оптимизацию ресурсов для достижения идеальных показателей Core Web Vitals, способствующих SEO-позиционированию.",
          bodyText2:
            "Более быстрый сайт не только улучшает пользовательский опыт: по данным Google, он увеличивает конверсию до 32%.",
          ctaLabel: "Бесплатный Аудит",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600&q=80",
          subheading: "Цифровая Экосистема",
          heading: "Больше чем Сайт",
          bodyTitle: "Полная платформа привлечения клиентов",
          bodyText1:
            "Мы интегрируем онлайн-бронирование, платежи, CRM, чат-боты на ИИ и расширенную аналитику, чтобы превратить ваш сайт в автономную машину продаж.",
          bodyText2:
            "От местного магазина до профессионального офиса: мы строим цифровую экосистему, которая устраняет трения и максимизирует каждое взаимодействие с клиентом.",
          ctaLabel: "Создать Мою Экосистему",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
          subheading: "Вездесущность",
          heading: "SEO и Полное Локальное Присутствие",
          bodyTitle: "Пусть вас найдут раньше конкурентов",
          bodyText1:
            "Мы доминируем в локальных поисках с помощью технических SEO-стратегий, семантического контента и оптимизации Google Business Profile, чтобы вы появлялись первыми в своём районе.",
          bodyText2:
            "Мы сочетаем органическое позиционирование с кампаниями цифрового ретаргетинга, чтобы ваш бренд оставался видимым на каждом этапе процесса покупки клиента.",
          ctaLabel: "Лидировать в Моём Районе",
        },
      ],
    },
    pt: {
      serviceName: "Webs Imersivas",
      tagline: "Experiências Digitais que\\nCativam e Convertem",
      description:
        "Construímos plataformas web de alto impacto para PMEs e comércios locais que querem competir com os grandes: design premium, velocidade nativa e presença digital onipresente.",
      sections: [
        {
          imgUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1600&q=80",
          subheading: "Design de Elite",
          heading: "Interfaces que Convertem",
          bodyTitle: "Sua presença digital como vantagem competitiva",
          bodyText1:
            "Cada pixel é projetado para cativar: animações cinematográficas, tipografia de impacto e paletas que comunicam autoridade de marca à primeira vista.",
          bodyText2:
            "Nossas interfaces superam os padrões de UX das grandes marcas, trazendo esse nível de excelência para o mercado local e de PMEs.",
          ctaLabel: "Ver Portfólio",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1600&q=80",
          subheading: "Desempenho",
          heading: "Velocidade como Superpoder",
          bodyTitle: "Sites que carregam em menos de 1 segundo",
          bodyText1:
            "Usamos arquiteturas JAMstack, edge computing e otimização de assets para alcançar pontuações perfeitas de Core Web Vitals que favorecem o posicionamento SEO.",
          bodyText2:
            "Um site mais rápido não só melhora a experiência do usuário: aumenta as conversões em até 32% segundo estudos do Google.",
          ctaLabel: "Auditoria Gratuita",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600&q=80",
          subheading: "Ecossistema Digital",
          heading: "Mais do que um Site",
          bodyTitle: "Uma plataforma completa de captação",
          bodyText1:
            "Integramos agendamento online, pagamentos, CRM, chatbots com IA e análises avançadas para transformar seu site em uma máquina de vendas autônoma.",
          bodyText2:
            "De uma loja local a um escritório profissional: construímos o ecossistema digital que elimina fricções e maximiza cada interação com o cliente.",
          ctaLabel: "Criar Meu Ecossistema",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
          subheading: "Onipresença",
          heading: "SEO & Presença Local Total",
          bodyTitle: "Seja encontrado antes da concorrência",
          bodyText1:
            "Dominamos as buscas locais com estratégias de SEO técnico, conteúdo semântico e otimização do Google Business Profile para que você apareça primeiro em sua área.",
          bodyText2:
            "Combinamos posicionamento orgânico com campanhas de retargeting digital para manter sua marca visível em cada etapa do processo de compra do cliente.",
          ctaLabel: "Liderar Minha Área",
        },
      ],
    },
  };

  const c = content[lang as keyof typeof content] ?? content.es;
  return <ServicePage {...c} serviceName={c.serviceName} lang={lang} />;
}

/* =========================================================
   MODERNIZATION PAGE
   Route: /services/modernization
   ========================================================= */

export function ModernizationPage({ lang = "es" }: { lang?: string }): JSX.Element {
  const content = {
    es: {
      serviceName: "Modernización",
      tagline: "Transmutación de Sistemas\\nLegacy en Arquitecturas de Élite",
      description:
        "Convertimos infraestructuras tecnológicas obsoletas en plataformas de alto rendimiento. Eliminamos la deuda técnica, modernizamos el stack y preparamos tu empresa para el 2026 y más allá.",
      sections: [
        {
          imgUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80",
          subheading: "Auditoría Técnica",
          heading: "Diagnóstico Quirúrgico",
          bodyTitle: "Conoce exactamente dónde estás",
          bodyText1:
            "Realizamos una auditoría exhaustiva de tu stack actual: bases de datos, APIs, arquitectura de microservicios, seguridad y rendimiento. Identificamos cuellos de botella y vulnerabilidades con precisión milimétrica.",
          bodyText2:
            "El resultado es un plan de modernización priorizado con ROI estimado para cada mejora, no una lista genérica de recomendaciones.",
          ctaLabel: "Solicitar Auditoría",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
          subheading: "Migración Zero-Downtime",
          heading: "Evolución sin Interrupción",
          bodyTitle: "Tu negocio no puede parar, y nosotros lo sabemos",
          bodyText1:
            "Utilizamos estrategias de migración blue-green, feature flags y despliegue progresivo para modernizar sistemas críticos sin afectar la disponibilidad del servicio.",
          bodyText2:
            "Cada migración incluye planes de rollback, pruebas exhaustivas y monitoreo en tiempo real para garantizar continuidad de negocio al 100%.",
          ctaLabel: "Ver Proceso",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&q=80",
          subheading: "Cloud & DevOps",
          heading: "Infraestructura de Nueva Generación",
          bodyTitle: "De monolito a arquitectura cloud-native",
          bodyText1:
            "Migramos aplicaciones legacy a contenedores Kubernetes, arquitecturas serverless y pipelines CI/CD automatizados que reducen el tiempo de despliegue de semanas a minutos.",
          bodyText2:
            "Implementamos observabilidad completa con Datadog, Grafana o similares para una visibilidad total de tus sistemas en producción.",
          ctaLabel: "Modernizar Infraestructura",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80",
          subheading: "Transformación de Datos",
          heading: "Del Caos a la Inteligencia",
          bodyTitle: "Convierte tus datos en ventaja competitiva",
          bodyText1:
            "Consolidamos fuentes de datos dispersas en data warehouses modernos (Snowflake, BigQuery) con pipelines ETL automatizados y dashboards de business intelligence en tiempo real.",
          bodyText2:
            "Preparamos tu arquitectura de datos para integración nativa con modelos de IA, convirtiendo datos históricos en predicciones accionables.",
          ctaLabel: "Transformar mis Datos",
        },
      ],
    },
    en: {
      serviceName: "Modernization",
      tagline: "Transmutation of Legacy Systems\\ninto Elite Architectures",
      description:
        "We convert obsolete technology infrastructures into high-performance platforms. We eliminate technical debt, modernize the stack, and prepare your company for 2026 and beyond.",
      sections: [
        {
          imgUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80",
          subheading: "Technical Audit",
          heading: "Surgical Diagnosis",
          bodyTitle: "Know exactly where you stand",
          bodyText1:
            "We conduct a comprehensive audit of your current stack: databases, APIs, microservice architecture, security, and performance. We identify bottlenecks and vulnerabilities with pinpoint accuracy.",
          bodyText2:
            "The result is a prioritized modernization plan with estimated ROI for each improvement, not a generic list of recommendations.",
          ctaLabel: "Request Audit",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
          subheading: "Zero-Downtime Migration",
          heading: "Evolution Without Interruption",
          bodyTitle: "Your business can't stop, and we know it",
          bodyText1:
            "We use blue-green migration strategies, feature flags, and progressive deployment to modernize critical systems without affecting service availability.",
          bodyText2:
            "Every migration includes rollback plans, exhaustive testing, and real-time monitoring to guarantee 100% business continuity.",
          ctaLabel: "See Process",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&q=80",
          subheading: "Cloud & DevOps",
          heading: "Next-Generation Infrastructure",
          bodyTitle: "From monolith to cloud-native architecture",
          bodyText1:
            "We migrate legacy applications to Kubernetes containers, serverless architectures, and automated CI/CD pipelines that reduce deployment time from weeks to minutes.",
          bodyText2:
            "We implement complete observability with Datadog, Grafana, or similar tools for total visibility of your production systems.",
          ctaLabel: "Modernize Infrastructure",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80",
          subheading: "Data Transformation",
          heading: "From Chaos to Intelligence",
          bodyTitle: "Turn your data into competitive advantage",
          bodyText1:
            "We consolidate scattered data sources into modern data warehouses (Snowflake, BigQuery) with automated ETL pipelines and real-time business intelligence dashboards.",
          bodyText2:
            "We prepare your data architecture for native AI model integration, converting historical data into actionable predictions.",
          ctaLabel: "Transform My Data",
        },
      ],
    },
    zh: {
      serviceName: "现代化",
      tagline: "将遗留系统转变为\\n精英架构",
      description:
        "我们将过时的技术基础设施转化为高性能平台。消除技术债务，现代化技术栈，为您的公司做好迎接2026年及未来的准备。",
      sections: [
        {
          imgUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80",
          subheading: "技术审计",
          heading: "精准诊断",
          bodyTitle: "准确了解您的现状",
          bodyText1:
            "我们对您当前的技术栈进行全面审计：数据库、API、微服务架构、安全性和性能。以毫米级精度识别瓶颈和漏洞。",
          bodyText2:
            "结果是一个优先级排序的现代化计划，包含每项改进的预估投资回报率，而非通用建议清单。",
          ctaLabel: "申请审计",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
          subheading: "零停机迁移",
          heading: "不间断的演进",
          bodyTitle: "您的业务无法停止，我们深知这一点",
          bodyText1:
            "我们使用蓝绿迁移策略、功能标志和渐进式部署，在不影响服务可用性的情况下现代化关键系统。",
          bodyText2:
            "每次迁移都包含回滚计划、全面测试和实时监控，以确保100%的业务连续性。",
          ctaLabel: "查看流程",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&q=80",
          subheading: "云与DevOps",
          heading: "下一代基础设施",
          bodyTitle: "从单体到云原生架构",
          bodyText1:
            "我们将遗留应用迁移到Kubernetes容器、无服务器架构和自动化CI/CD流水线，将部署时间从数周缩短至数分钟。",
          bodyText2:
            "我们使用Datadog、Grafana等工具实现完整可观察性，让您对生产系统有全面的可见性。",
          ctaLabel: "现代化基础设施",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80",
          subheading: "数据转型",
          heading: "从混乱到智能",
          bodyTitle: "将您的数据转化为竞争优势",
          bodyText1:
            "我们将分散的数据源整合到现代数据仓库（Snowflake、BigQuery）中，配合自动化ETL流水线和实时商业智能仪表板。",
          bodyText2:
            "我们为您的数据架构做好与AI模型原生集成的准备，将历史数据转化为可操作的预测。",
          ctaLabel: "转型我的数据",
        },
      ],
    },
    ru: {
      serviceName: "Модернизация",
      tagline: "Трансмутация Устаревших Систем\\nв Элитные Архитектуры",
      description:
        "Мы преобразуем устаревшие технологические инфраструктуры в высокопроизводительные платформы. Устраняем технический долг, модернизируем стек и готовим вашу компанию к 2026 году и далее.",
      sections: [
        {
          imgUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80",
          subheading: "Технический Аудит",
          heading: "Хирургическая Диагностика",
          bodyTitle: "Знайте точно, где вы находитесь",
          bodyText1:
            "Мы проводим комплексный аудит вашего текущего стека: базы данных, API, микросервисная архитектура, безопасность и производительность. Выявляем узкие места и уязвимости с точностью до миллиметра.",
          bodyText2:
            "Результат — приоритизированный план модернизации с расчётным ROI для каждого улучшения, а не общий список рекомендаций.",
          ctaLabel: "Запросить Аудит",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
          subheading: "Миграция без Простоя",
          heading: "Эволюция без Перерывов",
          bodyTitle: "Ваш бизнес не может останавливаться, и мы это знаем",
          bodyText1:
            "Мы используем стратегии сине-зелёной миграции, флаги функций и постепенное развёртывание для модернизации критических систем без влияния на доступность сервиса.",
          bodyText2:
            "Каждая миграция включает планы отката, исчерпывающее тестирование и мониторинг в реальном времени для гарантии 100% непрерывности бизнеса.",
          ctaLabel: "Посмотреть Процесс",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&q=80",
          subheading: "Cloud & DevOps",
          heading: "Инфраструктура Следующего Поколения",
          bodyTitle: "От монолита к облачно-нативной архитектуре",
          bodyText1:
            "Мы мигрируем устаревшие приложения в контейнеры Kubernetes, бессерверные архитектуры и автоматизированные CI/CD-конвейеры, сокращая время развёртывания с недель до минут.",
          bodyText2:
            "Внедряем полную наблюдаемость с Datadog, Grafana и аналогами для полной видимости ваших производственных систем.",
          ctaLabel: "Модернизировать Инфраструктуру",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80",
          subheading: "Трансформация Данных",
          heading: "От Хаоса к Интеллекту",
          bodyTitle: "Превратите ваши данные в конкурентное преимущество",
          bodyText1:
            "Консолидируем разрозненные источники данных в современные хранилища данных (Snowflake, BigQuery) с автоматизированными ETL-конвейерами и дашбордами бизнес-аналитики в реальном времени.",
          bodyText2:
            "Готовим вашу архитектуру данных к нативной интеграции с моделями ИИ, превращая исторические данные в действенные прогнозы.",
          ctaLabel: "Трансформировать Данные",
        },
      ],
    },
    pt: {
      serviceName: "Modernização",
      tagline: "Transmutação de Sistemas Legacy\\nem Arquiteturas de Elite",
      description:
        "Convertemos infraestruturas tecnológicas obsoletas em plataformas de alto desempenho. Eliminamos a dívida técnica, modernizamos o stack e preparamos sua empresa para 2026 e além.",
      sections: [
        {
          imgUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80",
          subheading: "Auditoria Técnica",
          heading: "Diagnóstico Cirúrgico",
          bodyTitle: "Saiba exatamente onde você está",
          bodyText1:
            "Realizamos uma auditoria abrangente do seu stack atual: bancos de dados, APIs, arquitetura de microsserviços, segurança e desempenho. Identificamos gargalos e vulnerabilidades com precisão milimétrica.",
          bodyText2:
            "O resultado é um plano de modernização priorizado com ROI estimado para cada melhoria, não uma lista genérica de recomendações.",
          ctaLabel: "Solicitar Auditoria",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
          subheading: "Migração Zero-Downtime",
          heading: "Evolução sem Interrupção",
          bodyTitle: "Seu negócio não pode parar, e nós sabemos disso",
          bodyText1:
            "Usamos estratégias de migração blue-green, feature flags e implantação progressiva para modernizar sistemas críticos sem afetar a disponibilidade do serviço.",
          bodyText2:
            "Cada migração inclui planos de rollback, testes exaustivos e monitoramento em tempo real para garantir 100% de continuidade de negócio.",
          ctaLabel: "Ver Processo",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&q=80",
          subheading: "Cloud & DevOps",
          heading: "Infraestrutura de Nova Geração",
          bodyTitle: "Do monolito à arquitetura cloud-native",
          bodyText1:
            "Migramos aplicações legadas para contêineres Kubernetes, arquiteturas serverless e pipelines CI/CD automatizados que reduzem o tempo de implantação de semanas para minutos.",
          bodyText2:
            "Implementamos observabilidade completa com Datadog, Grafana ou similares para visibilidade total dos seus sistemas em produção.",
          ctaLabel: "Modernizar Infraestrutura",
        },
        {
          imgUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80",
          subheading: "Transformação de Dados",
          heading: "Do Caos à Inteligência",
          bodyTitle: "Transforme seus dados em vantagem competitiva",
          bodyText1:
            "Consolidamos fontes de dados dispersas em data warehouses modernos (Snowflake, BigQuery) com pipelines ETL automatizados e dashboards de business intelligence em tempo real.",
          bodyText2:
            "Preparamos sua arquitetura de dados para integração nativa com modelos de IA, convertendo dados históricos em previsões acionáveis.",
          ctaLabel: "Transformar Meus Dados",
        },
      ],
    },
  };

  const c = content[lang as keyof typeof content] ?? content.es;
  return <ServicePage {...c} serviceName={c.serviceName} lang={lang} />;
}
'''

output_path = "src/pages/service-pages.tsx"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"SUCCESS: Written {len(content)} chars to {output_path}")

# Verify
with open(output_path, "r", encoding="utf-8") as f:
    verify = f.read()
exports = [line.strip() for line in verify.split("\n") if line.strip().startswith("export function")]
print(f"Exports found ({len(exports)}):")
for e in exports:
    print(f"  {e}")
