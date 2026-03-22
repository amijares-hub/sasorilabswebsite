import codecs

def update_file(path, replacements):
    with codecs.open(path, 'r', 'utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        if old not in content:
            print(f"Warning: could not find:\n{old}\nin {path}")
            old_alt = old.replace('"', "'")
            if old_alt in content:
                content = content.replace(old_alt, new)
        else:
            content = content.replace(old, new)
        
    with codecs.open(path, 'w', 'utf-8') as f:
        f.write(content)

app_replacements = [
    (
        "title: lang === 'es' ? 'Automatización IA' : 'AI Automation',",
        "title: lang === 'es' ? 'Automatización IA' : lang === 'zh' ? '人工智能自動化' : lang === 'ru' ? 'ИИ Автоматизация' : lang === 'pt' ? 'Automação IA' : 'AI Automation',"
    ),
    (
        "title: lang === 'es' ? 'Webs Inmersivas' : 'Immersive Webs',",
        "title: lang === 'es' ? 'Webs Inmersivas' : lang === 'zh' ? '沉浸式網站' : lang === 'ru' ? 'Иммерсивные Веб-сайты' : lang === 'pt' ? 'Webs Imersivas' : 'Immersive Webs',"
    ),
    (
        "title: lang === 'es' ? 'Modernización' : 'Modernization',",
        "title: lang === 'es' ? 'Modernización' : lang === 'zh' ? '現代化' : lang === 'ru' ? 'Модернизация' : lang === 'pt' ? 'Modernização' : 'Modernization',"
    ),
    (
        "title: lang === 'es' ? 'Ingeniería' : 'Engineering',",
        "title: lang === 'es' ? 'Ingeniería' : lang === 'zh' ? '工程' : lang === 'ru' ? 'Инженерия' : lang === 'pt' ? 'Engenharia' : 'Engineering',"
    ),
    (
        "title: lang === 'es' ? 'Estrategia Digital' : 'Digital Strategy',",
        "title: lang === 'es' ? 'Estrategia Digital' : lang === 'zh' ? '數字戰略' : lang === 'ru' ? 'Цифровая стратегия' : lang === 'pt' ? 'Estratégia Digital' : 'Digital Strategy',"
    )
]

parallax_replacements = [
    (
        "subheading: lang === 'es' ? 'Inteligencia' : 'Intelligence',",
        "subheading: lang === 'es' ? 'Inteligencia' : lang === 'zh' ? '智能' : lang === 'ru' ? 'Интеллект' : lang === 'pt' ? 'Inteligência' : 'Intelligence',"
    ),
    (
        "subheading: lang === 'es' ? 'Inmersión' : 'Immersion',",
        "subheading: lang === 'es' ? 'Inmersión' : lang === 'zh' ? '沉浸' : lang === 'ru' ? 'Погружение' : lang === 'pt' ? 'Imersão' : 'Immersion',"
    ),
    (
        "subheading: lang === 'es' ? 'Evolución' : 'Evolution',",
        "subheading: lang === 'es' ? 'Evolución' : lang === 'zh' ? '進化' : lang === 'ru' ? 'Эволюция' : lang === 'pt' ? 'Evolução' : 'Evolution',"
    ),
    (
        "{lang === 'es' ? 'Conocer más' : 'Learn more'}",
        "{lang === 'es' ? 'Conocer más' : lang === 'zh' ? '了解更多' : lang === 'ru' ? 'Узнать больше' : lang === 'pt' ? 'Saber mais' : 'Learn more'}"
    )
]

ssfx_replacements = [
    (
        'const ctaLabel = lang === "es" ? "Explorar Servicio" : "Explore Service";',
        'const ctaLabel = lang === "es" ? "Explorar Servicio" : lang === "zh" ? "探索服務" : lang === "ru" ? "Изучить услугу" : lang === "pt" ? "Explorar Serviço" : "Explore Service";'
    ),
    (
        '{lang === "es" ? "NUESTRAS CAPACIDADES" : "OUR CAPABILITIES"}',
        '{lang === "es" ? "NUESTRAS CAPACIDADES" : lang === "zh" ? "我們的能力" : lang === "ru" ? "НАШИ ВОЗМОЖНОСТИ" : lang === "pt" ? "NOSSAS CAPACIDADES" : "OUR CAPABILITIES"}'
    ),
    (
        '{lang === "es" ? "TECNOLOGÍA DE PRÓXIMA GENERACIÓN" : "NEXT GENERATION TECHNOLOGY"}',
        '{lang === "es" ? "TECNOLOGÍA DE PRÓXIMA GENERACIÓN" : lang === "zh" ? "下一代技術" : lang === "ru" ? "ТЕХНОЛОГИИ НОВОГО ПОКОЛЕНИЯ" : lang === "pt" ? "TECNOLOGIA DA PRÓXIMA GERAÇÃO" : "NEXT GENERATION TECHNOLOGY"}'
    )
]

update_file('src/App.tsx', app_replacements)
update_file('src/components/ui/services-parallax.tsx', parallax_replacements)
update_file('src/components/ui/services-scroll-fx.tsx', ssfx_replacements)

print("Updated remaining cards!")
