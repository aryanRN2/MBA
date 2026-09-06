import json
import os
import re
import fitz
import pytesseract
from PIL import Image
import io
import shutil

BASE_DIR = "/Users/aryanmaurya/MBA"
JSON_DIR = os.path.join(BASE_DIR, "CUET_PG_MBA_JSON")
WEB_JSON_DIR = os.path.join(BASE_DIR, "web/public/CUET_PG_MBA_JSON")
PDF_DIR = os.path.join(BASE_DIR, "CUET_PG_MBA")

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

def infer_section(q_text):
    t = q_text.lower()
    if any(k in t for k in ['synonym', 'antonym', 'spelling', 'grammat', 'voice', 'speech', 'idiom', 'phrase', 'passage', 'comprehension', 'meaning of the word', 'one word substitute', 'preposition']):
        return "Language Comprehension & Verbal Ability"
    elif any(k in t for k in ['ratio', 'cost price', 'selling price', 'profit', 'interest', 'tank', 'pipes', 'speed', 'train', 'work', 'days', 'mensuration', 'area', 'perimeter', 'volume', 'hcf', 'lcm', 'percentage', 'average', 'mixture', 'alligation']):
        return "Quantitative Techniques"
    elif any(k in t for k in ['table', 'chart', 'graph', 'diagram', 'production', 'export', 'import', 'chocolates', 'sales', 'percentage distribution']):
        return "Data Interpretation"
    elif any(k in t for k in ['coded as', 'series', 'blood relation', 'syllogism', 'seating arrangement', 'direction', 'statement', 'argument', 'assumption', 'conclusion', 'mirror image']):
        return "Logical Reasoning"
    elif any(k in t for k in ['computer', 'ram', 'rom', 'hardware', 'software', 'cpu', 'internet', 'byte', 'operating system', 'network', 'cyber']):
        return "Computer Basics"
    return "General Aptitude & Awareness"

def parse_question_and_options(ocr_list):
    full_text = "\n".join(ocr_list).strip()
    lines = [l.strip() for l in full_text.split('\n') if l.strip()]
    
    q_lines = []
    options = {}
    
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

def extract_pdf_questions(pdf_path):
    doc = fitz.open(pdf_path)
    qid_dict = {}
    
    for pno in range(len(doc)):
        page = doc[pno]
        text = page.get_text()
        qids = re.findall(r'Question Id\s*:\s*(\d+)', text)
        if not qids:
            continue
        qid = qids[0]
        
        images = page.get_images()
        ocr_texts = []
        for img_info in images:
            xref = img_info[0]
            base_img = doc.extract_image(xref)
            w, h = base_img['width'], base_img['height']
            if w > 180 and h > 60:
                img = Image.open(io.BytesIO(base_img['image']))
                ocr = pytesseract.image_to_string(img).strip()
                clean_txt = clean_str(ocr)
                if len(clean_txt) > 5:
                    ocr_texts.append(clean_txt)
                    
        if qid not in qid_dict:
            qid_dict[qid] = []
        qid_dict[qid].extend(ocr_texts)
        
    return qid_dict

def run_all_updates():
    print("Step 1: Fixing 2022 and 2023...")
    # Fix 2022
    import rebuild_all_cuet_questions
    rebuild_all_cuet_questions.fix_2022()
    rebuild_all_cuet_questions.fix_2023()
    
    # Step 2: Fix 2024
    print("Step 2: Processing 2024 PDF...")
    pdf_2024 = os.path.join(PDF_DIR, "CUET_PG_2024_Question_Paper_General_MBA_3b641e9ed4efa281b8625a28412806d5.pdf")
    qid_map_2024 = extract_pdf_questions(pdf_2024)
    
    json_2024_path = os.path.join(JSON_DIR, "CUET_PG_MBA_2024.json")
    with open(json_2024_path, "r", encoding="utf-8") as f:
        data_2024 = json.load(f)
        
    for q in data_2024:
        qid = q.get("question_id")
        if qid in qid_map_2024:
            q_txt, opts = parse_question_and_options(qid_map_2024[qid])
            if q_txt and len(opts) >= 2:
                # Merge options
                for k, v in opts.items():
                    if k in ["1", "2", "3", "4"] and v.strip():
                        q["options"][k] = v
                if len(q_txt) > len(q.get("question", "")):
                    q["question"] = clean_str(q_txt)
                q["section"] = infer_section(q["question"])
                
        # Fix any remaining placeholder options
        opts = q.get("options", {})
        for k in ["1", "2", "3", "4"]:
            if k not in opts or "ID:" in str(opts[k]) or "Option " in str(opts[k]) or str(opts[k]).strip() == "":
                opts[k] = f"Statement/Choice ({k})"
        
        corr_opt = q.get("correct_option", "1")
        if corr_opt in opts:
            q["correct_answer"] = opts[corr_opt]
            
    with open(json_2024_path, "w", encoding="utf-8") as f:
        json.dump(data_2024, f, indent=2, ensure_ascii=False)
    print("2024 JSON updated successfully.")
    
    # Step 3: Fix 2025
    print("Step 3: Processing 2025 PDF...")
    pdf_2025 = os.path.join(PDF_DIR, "cuet-pg-2025-general-management-question-paper-1768757412.pdf")
    qid_map_2025 = extract_pdf_questions(pdf_2025)
    
    json_2025_path = os.path.join(JSON_DIR, "CUET_PG_MBA_2025.json")
    with open(json_2025_path, "r", encoding="utf-8") as f:
        data_2025 = json.load(f)
        
    for q in data_2025:
        qid = q.get("question_id")
        if qid in qid_map_2025:
            q_txt, opts = parse_question_and_options(qid_map_2025[qid])
            if q_txt and len(opts) >= 2:
                for k, v in opts.items():
                    if k in ["1", "2", "3", "4"] and v.strip():
                        q["options"][k] = v
                if len(q_txt) > len(q.get("question", "")):
                    q["question"] = clean_str(q_txt)
                q["section"] = infer_section(q["question"])
                
        opts = q.get("options", {})
        for k in ["1", "2", "3", "4"]:
            if k not in opts or "ID:" in str(opts[k]) or "Option " in str(opts[k]) or str(opts[k]).strip() == "":
                opts[k] = f"Statement/Choice ({k})"
                
        corr_opt = q.get("correct_option", "1")
        if corr_opt in opts:
            q["correct_answer"] = opts[corr_opt]
            
    with open(json_2025_path, "w", encoding="utf-8") as f:
        json.dump(data_2025, f, indent=2, ensure_ascii=False)
    print("2025 JSON updated successfully.")

    # Step 4: Fix 2026
    print("Step 4: Processing 2026 PDF...")
    pdf_2026 = os.path.join(PDF_DIR, "CUET_PG_2026_General_Management_Question_Paper_e83569bd8b73876514c729f5be320f9d.pdf")
    qid_map_2026 = extract_pdf_questions(pdf_2026)
    
    json_2026_path = os.path.join(JSON_DIR, "CUET_PG_MBA_2026.json")
    with open(json_2026_path, "r", encoding="utf-8") as f:
        data_2026 = json.load(f)
        
    for q in data_2026:
        qid = q.get("question_id")
        if qid in qid_map_2026:
            q_txt, opts = parse_question_and_options(qid_map_2026[qid])
            if q_txt and len(opts) >= 2:
                for k, v in opts.items():
                    if k in ["1", "2", "3", "4"] and v.strip():
                        q["options"][k] = v
                if len(q_txt) > 10:
                    q["question"] = clean_str(q_txt)
                q["section"] = infer_section(q["question"])
                
        opts = q.get("options", {})
        for k in ["1", "2", "3", "4"]:
            if k not in opts or "ID:" in str(opts[k]) or "Option " in str(opts[k]) or str(opts[k]).strip() == "":
                opts[k] = f"Choice ({k})"
                
        corr_opt = q.get("correct_option", "1")
        if corr_opt in opts:
            q["correct_answer"] = opts[corr_opt]

    with open(json_2026_path, "w", encoding="utf-8") as f:
        json.dump(data_2026, f, indent=2, ensure_ascii=False)
    print("2026 JSON updated successfully.")

    # Step 5: Rebuild All PYQs
    print("Step 5: Rebuilding CUET_PG_MBA_All_PYQs.json...")
    all_questions = []
    for yr in [2022, 2023, 2024, 2025, 2026]:
        p = os.path.join(JSON_DIR, f"CUET_PG_MBA_{yr}.json")
        with open(p, "r", encoding="utf-8") as f:
            y_data = json.load(f)
            all_questions.extend(y_data)
            
    all_pyqs_path = os.path.join(JSON_DIR, "CUET_PG_MBA_All_PYQs.json")
    with open(all_pyqs_path, "w", encoding="utf-8") as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
    print(f"Compiled {len(all_questions)} questions into All_PYQs.")

    # Step 6: Sync to web/public
    print("Step 6: Syncing to web/public/CUET_PG_MBA_JSON/...")
    for fname in os.listdir(JSON_DIR):
        if fname.endswith(".json"):
            src = os.path.join(JSON_DIR, fname)
            dst = os.path.join(WEB_JSON_DIR, fname)
            shutil.copyfile(src, dst)
            print(f"Copied {fname} -> {dst}")
            
    print("=== All updates and syncing completed successfully! ===")

if __name__ == "__main__":
    run_all_updates()
