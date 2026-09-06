import json
import re
import os

def clean_text(t):
    if not t:
        return ""
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def main():
    print("Preparing 2022 Master Verification & Bilingual Processor...")
    if not os.path.exists('/Users/aryanmaurya/MBA/raw_2022_ocr_dump.txt'):
        print("Waiting for raw_2022_ocr_dump.txt to finish...")
        return
    
    with open('/Users/aryanmaurya/MBA/raw_2022_ocr_dump.txt', 'r', encoding='utf-8') as f:
        content = f.read()

    pages = content.split('=== PAGE ')
    print(f"Total pages loaded: {len(pages)-1}")

if __name__ == '__main__':
    main()
