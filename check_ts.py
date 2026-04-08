def check_structure(filepath):
    for enc in ['utf-16-le', 'utf-16', 'utf-8', 'latin-1']:
        try:
            with open(filepath, 'r', encoding=enc) as f:
                content = f.read()
            print(f"Success with {enc}")
            lines = content.splitlines()
            print(f"Total lines: {len(lines)}")
            for i, line in enumerate(lines):
                if '};",' in line or '};"' in line:
                    print(f"Potential corruption at line {i+1}: {line.strip()}")
                if i > 0 and 'desc: "' in line and '};' in lines[i-1]:
                    print(f"Potential break at line {i+1}: {line.strip()}")
            return
        except Exception as e:
            print(f"Failed {enc}: {e}")

if __name__ == "__main__":
    check_structure('src/i18n/translations.ts')
