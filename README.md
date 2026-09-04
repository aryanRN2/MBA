# 📚 CUET PG MBA (COQP12 / PGQP38) Question Papers & Verified JSON Dataset

This repository contains comprehensive past year question papers (PYQs), official candidate question sheets, and verified, structured JSON datasets with step-by-step mathematical, logical, and verbal solutions for **CUET PG MBA (COQP12 / PGQP38)** entrance exams (2022–2026).

---

## 📂 Repository Structure

```
MBA/
├── CUET_PG_MBA/                      # Official Question Paper PDFs (2022 - 2026)
│   ├── COQP 12 - 2022 Shift 1 Question Paper by Abhi Concept.pdf
│   ├── COQP 12 - 2023 Question Paper by Abhi Concept.pdf
│   ├── COQP 12 - 2024 Question Paper (Hindi) by Abhi Concept.pdf
│   ├── COQP 12 - 2025 Question Paper by Abhi Concept.pdf
│   ├── CUET_MBA_QUESTION_PAPER_COQP_12_2023_1st_Shift_Abhi_Concept.pdf
│   ├── CUET_PG_2024_Question_Paper_General_MBA_3b641e9ed4efa281b8625a28412806d5.pdf
│   ├── CUET_PG_2026_General_Management_Question_Paper_e83569bd8b73876514c729f5be320f9d.pdf
│   ├── CUET_PG_MBA_Question_Paper_2022.pdf
│   ├── CUET_PG_MBA_Question_Paper_2023.pdf
│   ├── CUET_PG_MBA_Question_Paper_2024.pdf
│   └── cuet-pg-2025-general-management-question-paper-1768757412.pdf
│
├── CUET_PG_MBA_JSON/                 # Verified & Structured JSON Datasets
│   ├── CUET_PG_MBA_2022.json        # 100 Questions (PGQP38 Slot 1)
│   ├── CUET_PG_MBA_2023.json        # 100 Questions (COQP12 Shift 1)
│   ├── CUET_PG_MBA_2024.json        # 75 Questions (General MBA Shift 3)
│   ├── CUET_PG_MBA_2025.json        # 75 Questions (General Management Shift 3)
│   ├── CUET_PG_MBA_2026.json        # 75 Questions (General Management Shift 2)
│   └── CUET_PG_MBA_All_PYQs.json    # Master Dataset (425 Questions)
│
├── generate_exact_cuet_json.py       # Full Extraction, Verification & Solver Pipeline
└── README.md
```

---

## 📊 Summary of Question Papers

| Year | Exam Code / Paper Title | Total Questions | Status |
| :--- | :--- | :--- | :--- |
| **2022** | CUET PG MBA (PGQP38 - Slot 1) | **100** | ✅ 100% Verified & Solved |
| **2023** | CUET PG MBA (COQP12 - Shift 1) | **100** | ✅ 100% Verified & Solved |
| **2024** | CUET PG MBA (General MBA - Shift 3) | **75** | ✅ 100% Verified & Solved |
| **2025** | CUET PG MBA (General Management - Shift 3) | **75** | ✅ 100% Verified & Solved |
| **2026** | CUET PG MBA (General Management - Shift 2) | **75** | ✅ 100% Verified & Solved |
| **Total**| **Master Combined Dataset** | **425 Questions** | ✅ Ready for ML / Practice |

---

## 📑 JSON Schema & Format

Every item in the JSON files follows this schema:

```json
{
  "year": 2023,
  "paper_name": "CUET PG MBA 2023 (COQP12 - Shift 1)",
  "question_number": 36,
  "question_id": "68634025550",
  "section": "Quantitative Techniques",
  "question": "Aman got 76% marks and Neha got 480 marks in a test. The maximum marks of the test is equal to the marks obtained by Aman and Neha together. How many marks did Aman score in the test?",
  "options": {
    "1": "1300",
    "2": "1420",
    "3": "1500",
    "4": "1520"
  },
  "correct_option": "4",
  "correct_answer": "1520",
  "explanation": "Let maximum marks = M. Aman scored 76% of M = 0.76M. Neha scored 480 marks. Total marks M = 0.76M + 480 => 0.24M = 480 => M = 2000. Therefore, Aman's score = 76% of 2000 = 1520."
}
```

---

## 🎯 Key Sections Covered
1. **Quantitative Techniques & Mathematics**: Time & Work, Speed & Distance, Percentages, Profit & Loss, Simple/Compound Interest, Algebra, Geometry & Mensuration, Ratios.
2. **Logical Reasoning & Data Interpretation**: Blood Relations, Coding-Decoding, Syllogisms, Seating Arrangements, Series, Venn Diagrams, Tables & Charts.
3. **Language Comprehension & Verbal Ability**: Reading Comprehension Passages, Idioms, One-Word Substitution, Sentence Correction, Voice & Speech, Grammar.
4. **Computer Basics**: Computer Architecture, Memory (RAM/ROM), Networking, Operating Systems, MS Office, Cybersecurity.
5. **General Knowledge & Awareness**: Indian Polity & Constitution, Geography, History, Economics, Current Affairs.
