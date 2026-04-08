
import os

def fix_encoding():
    input_path = r'c:\Users\wilma\OneDrive\Escritorio\Antigravity Apps\Sasori Website\Codigo Sasorilabs website\tmp_translations_utf8.txt'
    output_path = r'c:\Users\wilma\OneDrive\Escritorio\Antigravity Apps\Sasori Website\Codigo\Sasorilabs website\translations_decoded.ts'
    
    try:
        with open(input_path, 'rb') as f:
            content = f.read()
        
        # Step 1: Decode the file which is currently UTF-8
        s = content.decode('utf-8')
        
        # Step 2: Encode it back to the bytes it "should" have been (Latin-1)
        # These bytes are actually the original UTF-8 bytes.
        original_utf8_bytes = s.encode('latin-1')
        
        # Step 3: Decode those original bytes as UTF-8
        real_string = original_utf8_bytes.decode('utf-8')
        
        print("Success! Encoding fixed.")
        
        # Now let's handle the specific line corruptions I found
        # (Where lines were truncated or joined incorrectly)
        
        lines = real_string.splitlines()
        fixed_lines = []
        
        for i, line in enumerate(lines):
            # Fix Russian 1187 (was RU_modernization.subtitle)
            if 'subtitle: "Сверхбыстрые и безопасные системы, предназн' in line:
                line = '            subtitle: "Сверхбыстрые и безопасные системы, предназначенные для масштабирования без границ."'
            
            # Fix Chinese 788
            if 'audit: "流程审计' in line and i < 790: # heuristic
                 line = '            audit: "流程审计",'
                 # The line after was broken too
                 # auditDesc: "Идентифицируем повторяющиеся задачи, которые отнимают время у вашей команды.",
                 # Wait, line 789 in my view was '},'
                 # I'll check the context again
            
            # Fix Portuguese 1262
            if '};",' in line:
                 line = '    },' # Close the ru block or similar
            
            fixed_lines.append(line)
            
        final_content = '\n'.join(fixed_lines)
        
        with open('translations_cleaned.ts', 'w', encoding='utf-8') as f:
            f.write(final_content)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    fix_encoding()
