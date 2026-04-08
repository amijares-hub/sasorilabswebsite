
with open('tmp_translations_utf8.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# The file seems to be:
# es: lines 0 to 323 (index 0-indexed)
# en: lines 324 to 641
# zh: lines 642 to 961
# ru: lines 962 to 1263
# corruption at 1264
# pt content: 1265 to end

# Let's find the actual indices by searching for the keys
indices = {}
for i, line in enumerate(lines):
    if '  es: {' in line: indices['es'] = i
    if '  en: {' in line: indices['en'] = i
    if '  zh: {' in line: indices['zh'] = i
    if '  ru: {' in line: indices['ru'] = i
    if 'pt:' in line: indices['pt'] = i

print(f"Indices found: {indices}")

# Reconstruct
# We want the file to start with export const translations = {
# Then es, en, zh, ru blocks.
# Then pt block.
# Then close with };

# I'll manually define the start of pt to fix the corruption.

new_content = [
    "export const translations = {\n",
]

# Copy es, en, zh, ru
# ru ends before the corruption at line 1262-ish
ru_end = 0
for i in range(indices.get('ru', 0), len(lines)):
    if '  },' in lines[i] and i > indices.get('ru', 0) + 1:
        # check if it's the end of ru
        # ru structure typically has demos ending at the last level
        pass
    if '};",' in lines[i]: # found the corruption line
        ru_end = i
        break

print(f"RU end found at: {ru_end}")

# Actually, let's just use the known structure.
# I will grab everything from lines[0] to ru_end-1
# but remove the 'export const translations = {' if it's there (it is at line 0)

for i in range(indices.get('es', 0), ru_end):
    new_content.append(lines[i])

# Now append PT
new_content.append("  pt: {\n")
new_content.append("    common: {\n")
new_content.append("      viewDetails: \"Ver Detalhes\",\n")
new_content.append("      startProject: \"Iniciar Projeto\",\n")
new_content.append("      contactUs: \"Contate-nos\",\n")
new_content.append("      loading: \"Sincronizando...\",\n")
new_content.append("      back: \"Voltar\",\n")
new_content.append("      learnMore: \"Saiba Mais\",\n")
new_content.append("      dashboard: \"Painel Administrativo\",\n")
new_content.append("      viewFullBlog: \"Ver Blog Completo\",\n")
new_content.append("      transformFuture: \"TRANSFORME O FUTURO\",\n")
new_content.append("      techVision: \"LEVAMOS SUA VISÃƒO AO PRÃ“XIMO NÃ VEL COM TECNOLOGIAS DE ELITE.\",\n")
new_content.append("      scheduleConsultation: \"Agendar Consultoria\",\n")
new_content.append("      ecosystem: \"Nosso Ecossistema\",\n")
new_content.append("      exploreEcosystem: \"Explorar Ecossistema\",\n")
new_content.append("    },\n")
new_content.append("    blog: {\n")
new_content.append("      title: \"Blog\",\n")
new_content.append("      desc: \"Nossas Ãºltimas notÃ­cias e artigos sobre tecnologia.\",\n")
new_content.append("    },\n")
new_content.append("    otherServices: {\n")
new_content.append("      engineering: {\n")
new_content.append("          title: \"Engenharia de Sistemas\",\n")
# Start picking up from line ru_end + 1 (the fragment after corruption)
for i in range(ru_end + 1, len(lines)):
    new_content.append(lines[i])

# Final check: does it end with };? 
# The last line of lines is };
# So it should be fine.

with open('translations_fixed_final.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_content)

print("Created translations_fixed_final.ts")
