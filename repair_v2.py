
import os

def fix_mojibake(text):
    try:
        # Try to fix the double encoding
        # The text is currently: "Ã“" (UTF-8 bytes interpreted as CP1252)
        # We want to get back the original bytes and decode as UTF-8.
        return text.encode('cp1252').decode('utf-8')
    except:
        return text

def repair():
    input_path = r'c:\Users\wilma\OneDrive\Escritorio\Antigravity Apps\Sasori Website\Codigo Sasorilabs website\tmp_translations_utf8.txt'
    
    with open(input_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    fixed_lines = []
    for line in lines:
        # Heuristic: if it contains "Ã", it's likely mojibake
        if 'Ã' in line or 'Ð' in line or 'æ' in line:
            # But wait, RU uses Ð, ZH uses æ
            # Let's try to fix the whole line
            try:
                # We need to find the string literals and fix them
                import re
                def repl(match):
                    return '"' + fix_mojibake(match.group(1)) + '"'
                
                fixed_line = re.sub(r'"([^"]*)"', repl, line)
                fixed_lines.append(fixed_line)
            except:
                fixed_lines.append(line)
        else:
            fixed_lines.append(line)
            
    # Manual repairs for the structural breaks
    # RU Modernization subtitle
    for i in range(len(fixed_lines)):
        if 'Сверхбыстрые и безопасные системы, предназн' in fixed_lines[i]:
            fixed_lines[i] = '            subtitle: "Сверхбыстрые и безопасные системы, предназначенные для масштабирования без границ.",\n'
            # And the next lines might be missing in the original dump or mixed
        
        if 'audit: "流程审计' in fixed_lines[i]:
            fixed_lines[i] = '            audit: "流程审计",\n'
            # Add missing auditDesc if it was lost
            if 'auditDesc' not in fixed_lines[i+1]:
                fixed_lines.insert(i+1, '            auditDesc: "识别消耗团队时间的重复性任务。",\n')
                
    with open('translations_fixed_v2.ts', 'w', encoding='utf-8') as f:
        f.writelines(fixed_lines)

if __name__ == '__main__':
    repair()
