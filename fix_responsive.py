import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # 1. Ajustes tipográficos (Hero y Encabezados principales)
    # Baja un escalón el tamaño base (móvil) añadiendo sm: para proteger el salto
    content = re.sub(r'text-6xl (sm:|md:|lg:|xl:)', r'text-4xl sm:text-5xl \1', content)
    content = re.sub(r'text-5xl (sm:|md:|lg:|xl:)', r'text-4xl sm:text-5xl \1', content)
    
    # Textos que ya eran 4xl los bajamos a 3xl en mobile puro
    # Excepto si ya tienen un sm: declarando text-3xl
    content = re.sub(r'(?<!sm:)text-4xl (md:|lg:|xl:)', r'text-3xl sm:text-4xl \1', content)
    
    # 2. Ajustes de padding (No queremos p-12, p-16, p-20 estáticos sin sm/md)
    # Buscamos clases como p-20 o p-12 que esten crudas
    # Este regex busca p-## que no esté precedido por md: sm: lg: y le añade md: y crea un pequeño para base
    content = re.sub(r'(?<![:a-z-])p-20(?!\d)', r'p-6 sm:p-10 md:p-20', content)
    content = re.sub(r'(?<![:a-z-])p-16(?!\d)', r'p-6 sm:p-8 md:p-16', content)
    content = re.sub(r'(?<![:a-z-])p-12(?!\d)', r'p-5 sm:p-8 md:p-12', content)
    content = re.sub(r'(?<![:a-z-])p-10(?!\d)', r'p-5 sm:p-8 md:p-10', content)
    
    # Lo mismo para px y py extremos
    content = re.sub(r'(?<![:a-z-])px-20(?!\d)', r'px-6 md:px-20', content)
    content = re.sub(r'(?<![:a-z-])px-16(?!\d)', r'px-6 md:px-16', content)
    content = re.sub(r'(?<![:a-z-])px-12(?!\d)', r'px-5 md:px-12', content)
    content = re.sub(r'(?<![:a-z-])px-10(?!\d)', r'px-4 md:px-10', content)
    
    content = re.sub(r'(?<![:a-z-])py-20(?!\d)', r'py-10 md:py-20', content)
    content = re.sub(r'(?<![:a-z-])py-16(?!\d)', r'py-10 md:py-16', content)
    content = re.sub(r'(?<![:a-z-])py-12(?!\d)', r'py-8 md:py-12', content)

    # 3. Ajustar márgenes (mb-20 por mb-10 md:mb-20)
    content = re.sub(r'(?<![:a-z-])mb-20(?!\d)', r'mb-10 md:mb-20', content)
    content = re.sub(r'(?<![:a-z-])mb-16(?!\d)', r'mb-10 md:mb-16', content)

    # 4. Asegurarnos que "w-full" está acompañado de un max-w-full u overflow seguro (cuando están en flex o estáticos)
    # Especial en Service pages
    if "min-h-screen" in content:
        # Prevent scroll bars on min-h-screen by using relative w-full overflow-hidden where applicable
        pass 

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

def main():
    root_dirs = ['src/pages', 'src/components']
    for d in root_dirs:
        for root, dirs, files in os.walk(d):
            for file in files:
                if file.endswith('.tsx') or file.endswith('.ts'):
                    process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
