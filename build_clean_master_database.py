import json
import os
import re
import fitz
import pytesseract
from PIL import Image
import io

BASE_DIR = "/Users/aryanmaurya/MBA"
JSON_DIR = os.path.join(BASE_DIR, "CUET_PG_MBA_JSON")
WEB_JSON_DIR = os.path.join(BASE_DIR, "web/public/CUET_PG_MBA_JSON")
PDF_DIR = os.path.join(BASE_DIR, "CUET_PG_MBA")

os.makedirs(JSON_DIR, exist_ok=True)
os.makedirs(WEB_JSON_DIR, exist_ok=True)

def clean_str(s):
    if not s:
        return ""
    s = re.sub(r'MP\.\s*(?:oNiegedunia|sliegedunia|ecedunia|aliesedunia|collegedunia)\b', '', s, flags=re.IGNORECASE)
    s = re.sub(r'https?://\S+', '', s)
    s = re.sub(r'cdn3\.digialm\.com\S*', '', s)
    s = re.sub(r'www\.abhiconcept\.com\S*', '', s)
    s = re.sub(r'ABHI\s*CONCEPT', '', s, flags=re.IGNORECASE)
    s = re.sub(r'GET IT ON.*?Google Play', '', s, flags=re.IGNORECASE)
    s = re.sub(r'Complete CUET.*?Visit\s*:', '', s, flags=re.DOTALL|re.IGNORECASE)
    s = re.sub(r'Enquire\s*:\s*\d+', '', s)
    s = re.sub(r'[\r\n]+', '\n', s)
    return s.strip()

def extract_pdf_qids_and_ocr(pdf_path):
    print(f"Extracting OCR from {pdf_path}...")
    doc = fitz.open(pdf_path)
    qid_data = {}
    
    for pno in range(len(doc)):
        page = doc[pno]
        text = page.get_text()
        qids = re.findall(r'Question Id\s*:\s*(\d+)', text)
        if not qids:
            continue
        qid = qids[0]
        
        # Check option IDs in text
        opt_ids = re.findall(r'Option\s*([1-4])\s*ID\s*:\s*(\d+)', text)
        opt_id_map = {opt_num: opt_id for opt_num, opt_id in opt_ids}
        
        images = page.get_images()
        ocr_texts = []
        for img_info in images:
            xref = img_info[0]
            base_img = doc.extract_image(xref)
            w, h = base_img['width'], base_img['height']
            if w > 180 and h > 60:
                img = Image.open(io.BytesIO(base_img['image']))
                ocr = pytesseract.image_to_string(img).strip()
                clean_ocr_txt = clean_str(ocr)
                if len(clean_ocr_txt) > 5:
                    ocr_texts.append(clean_ocr_txt)
                    
        if qid not in qid_data:
            qid_data[qid] = {
                "page": pno + 1,
                "opt_id_map": opt_id_map,
                "ocr_texts": []
            }
        qid_data[qid]["ocr_texts"].extend(ocr_texts)
        
    print(f"Finished extraction for {pdf_path}: {len(qid_data)} questions.")
    return qid_data

def parse_question_and_options(ocr_list):
    full_text = "\n".join(ocr_list).strip()
    lines = [l.strip() for l in full_text.split('\n') if l.strip()]
    
    q_lines = []
    options = {}
    
    # Pattern for 1. / (1) / 1)
    opt_regex = re.compile(r'^(?:\(?([1-4])\)?[\.\:\-\s]+|\(([1-4])\))\s*(.*)$')
    
    for line in lines:
        m = opt_regex.match(line)
        if m:
            num = m.group(1) or m.group(2)
            val = m.group(3).strip()
            options[num] = val
        else:
            if not options:
                q_lines.append(line)
            else:
                last_num = str(max([int(k) for k in options.keys()]))
                options[last_num] = (options[last_num] + " " + line).strip()
                
    q_text = "\n".join(q_lines).strip()
    return q_text, options

print("Master Database Builder Engine ready.")
