import codecs

def normalize_file(input_path, output_path):
    encodings = ['utf-16-le', 'utf-16', 'utf-8-sig', 'utf-8', 'latin-1']
    content = None
    for enc in encodings:
        try:
            with codecs.open(input_path, 'r', enc) as f:
                content = f.read()
            print(f"Successfully read {input_path} with {enc}")
            break
        except:
            continue
    
    if content:
        # Check for the corrupted pattern I saw: }; followed by something weird
        # Actually, let's just write it as UTF-8 first.
        with codecs.open(output_path, 'w', 'utf-8') as f:
            f.write(content)
        print(f"Wrote normalized content to {output_path}")

if __name__ == "__main__":
    normalize_file('src/i18n/translations.ts', 'src/i18n/translations.fixed.ts')
