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
        "const [lang, setLang] = useState<string>('es');",
        "const [lang, setLang] = useState<string>(() => localStorage.getItem('sasori-lang') || 'es');\n  useEffect(() => {\n    localStorage.setItem('sasori-lang', lang);\n  }, [lang]);"
    ),
    (
        'subtitle={lang === \'es\' ? "LLEVAMOS TU VISIÓN AL SIGUIENTE NIVEL CON TECNOLOGÍA DE ÉLITE." : "WE TAKE YOUR VISION TO THE NEXT LEVEL WITH ELITE TECHNOLOGY."}',
        'subtitle={lang === \'es\' ? "LLEVAMOS TU VISIÓN AL SIGUIENTE NIVEL CON TECNOLOGÍA DE ÉLITE." : lang === \'zh\' ? "我們以頂級技術將您的願景提升到新的高度。" : lang === \'ru\' ? "МЫ ВЫВОДИМ ВАШЕ ВИДЕНИЕ НА НОВЫЙ УРОВЕНЬ С ПОМОЩЬЮ ЭЛИТНЫХ ТЕХНОЛОГИЙ." : lang === \'pt\' ? "LEVAMOS SUA VISÃO AO PRÓXIMO NÍVEL COM TECNOLOGIA DE ELITE." : "WE TAKE YOUR VISION TO THE NEXT LEVEL WITH ELITE TECHNOLOGY."}'
    ),
    (
        '<BlogPostSection',
        '<BlogPostSection\n                  lang={lang}'
    )
]

update_file('src/App.tsx', app_replacements)

tsa_replacements = [
    (
        "const text = serviceName \n    ? (lang === 'es' ? `descubre más sobre ` : `see more about `)\n    : (lang === 'es' ? \"descubre más de \" : \"see more from \");",
        "const text = serviceName \n    ? (lang === 'es' ? `descubre más sobre ` : lang === 'zh' ? '了解更多關於 ' : lang === 'ru' ? 'узнать больше о ' : lang === 'pt' ? 'descubra mais sobre ' : `see more about `)\n    : (lang === 'es' ? \"descubre más de \" : lang === 'zh' ? '更多來自 ' : lang === 'ru' ? 'узнать больше от ' : lang === 'pt' ? 'veja mais de ' : \"see more from \");"
    )
]

# Note: The backticks inside tsx might have different evaluation spacing so I will just replace the substrings broadly if the whole string is not found:
tsa_replacements_alt = [
    (
        "(lang === 'es' ? `descubre más sobre ` : `see more about `)",
        "(lang === 'es' ? `descubre más sobre ` : lang === 'zh' ? '了解更多關於 ' : lang === 'ru' ? 'узнать больше о ' : lang === 'pt' ? 'descubra mais sobre ' : `see more about `)"
    ),
    (
        "(lang === 'es' ? \"descubre más de \" : \"see more from \")",
        "(lang === 'es' ? \"descubre más de \" : lang === 'zh' ? '更多來自 ' : lang === 'ru' ? 'узнать больше от ' : lang === 'pt' ? 'veja mais de ' : \"see more from \")"
    )
]

update_file('src/components/ui/text-scroll-animation.tsx', tsa_replacements_alt)
print("Applied final patch!")
