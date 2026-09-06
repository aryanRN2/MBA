import json
import os
import shutil

BASE_DIR = "/Users/aryanmaurya/MBA"
JSON_DIR = os.path.join(BASE_DIR, "CUET_PG_MBA_JSON")
WEB_JSON_DIR = os.path.join(BASE_DIR, "web/public/CUET_PG_MBA_JSON")

def build_perfect_2022():
    json_path = os.path.join(JSON_DIR, "CUET_PG_MBA_2022.json")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 1. Update the Data Interpretation questions with the exact official Shift 1 questions & tables
    di_updates = {
        89: {
            "section": "Data Interpretation",
            "question": "The following data gives the percentage of the top 10 states in terms of the number of foreign tourist visits in India in 2019 (Source : tourism.gov.in). The total number of foreign tourists visiting India in 2019 is 3,14,08,666.\n\n| State | Percentage Share (%) |\n| :--- | :--- |\n| **Tamil Nadu** | 22% |\n| **Maharashtra** | 18% |\n| **Uttar Pradesh** | 15% |\n| **Delhi** | 10% |\n| **West Bengal** | 5% |\n| **Rajasthan** | 5% |\n| **Kerala** | 4% |\n| **Punjab** | 4% |\n| **Bihar** | 4% |\n| **Goa** | 3% |\n| **Others** | 10% |\n\n**Question**: How many people visited Tamil Nadu in 2019?",
            "options": {
                "1": "6009907",
                "2": "6909907",
                "3": "6990907",
                "4": "660907"
            },
            "correct_option": "2",
            "correct_answer": "6909907",
            "explanation": "• Total foreign tourists = 3,14,08,666.\n• Percentage visiting Tamil Nadu = 22%.\n• Number of visitors to Tamil Nadu = $0.22 \\times 3,14,08,666 = 69,09,906.52 \\approx 69,09,907$.\nTherefore, Option (2) [6909907] is correct."
        },
        90: {
            "section": "Data Interpretation",
            "question": "The following data gives the percentage of the top 10 states in terms of the number of foreign tourist visits in India in 2019 (Source : tourism.gov.in). The total number of foreign tourists visiting India in 2019 is 3,14,08,666.\n\n| State | Percentage Share (%) |\n| :--- | :--- |\n| **Tamil Nadu** | 22% |\n| **Maharashtra** | 18% |\n| **Uttar Pradesh** | 15% |\n| **Delhi** | 10% |\n| **West Bengal** | 5% |\n| **Rajasthan** | 5% |\n| **Kerala** | 4% |\n| **Punjab** | 4% |\n| **Bihar** | 4% |\n| **Goa** | 3% |\n| **Others** | 10% |\n\n**Question**: What is the difference between the highest number of foreign tourists visiting any state out of the top ten states and the lowest number?",
            "options": {
                "1": "5976647",
                "2": "600000",
                "3": "5967647",
                "4": "6967647"
            },
            "correct_option": "3",
            "correct_answer": "5967647",
            "explanation": "• Highest percentage among top 10 states = Tamil Nadu (22%).\n• Lowest percentage among top 10 states = Goa (3%).\n• Difference in percentage = $22\\% - 3\\% = 19\\%$.\n• Difference in number of tourists = $0.19 \\times 3,14,08,666 = 59,67,646.54 \\approx 59,67,647$.\nTherefore, Option (3) [5967647] is correct."
        },
        91: {
            "section": "Data Interpretation",
            "question": "The following table shows the amount of money spent by six university students living in student accommodation on food, travel, rent and miscellaneous expenses, along with their monthly budget. (Gender: M — Male, F — Female).\n\n| Student | Monthly Budget (₹) | Food (₹) | Travel (₹) | Rent (₹) | Miscellaneous (₹) |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Sonia (F)** | 27,000 | 12,000 | 4,000 | 7,000 | 4,000 |\n| **Deepak (M)** | 25,000 | 10,000 | 5,000 | 5,000 | 3,000 |\n| **Komal (F)** | 27,000 | 12,000 | 4,500 | 6,500 | 4,000 |\n| **Gaurav (M)** | 22,000 | 9,500 | 4,500 | 5,500 | 2,500 |\n| **Arnav (M)** | 25,000 | 11,000 | 5,000 | 5,000 | 4,000 |\n| **Shruti (F)** | 22,000 | 10,000 | 4,500 | 5,000 | 2,500 |\n\n**Question**: What percentage of their total expenditure do the female students together spend on travel?",
            "options": {
                "1": "50%",
                "2": "45%",
                "3": "17%",
                "4": "25%"
            },
            "correct_option": "3",
            "correct_answer": "17%",
            "explanation": "• Female students are Sonia, Komal, and Shruti.\n• Total travel expenditure of female students = $4,000 + 4,500 + 4,500 = ₹13,000$.\n• Total expenditure of Sonia = $12,000 + 4,000 + 7,000 + 4,000 = ₹27,000$.\n• Total expenditure of Komal = $12,000 + 4,500 + 6,500 + 4,000 = ₹27,000$.\n• Total expenditure of Shruti = $10,000 + 4,500 + 5,000 + 2,500 = ₹22,000$.\n• Total expenditure of all female students = $27,000 + 27,000 + 22,000 = ₹76,000$.\n• Percentage spent on travel = $\\frac{13,000}{76,000} \\times 100 = 17.105\\% \\approx 17\\%$.\nTherefore, Option (3) [17%] is correct."
        },
        92: {
            "section": "Data Interpretation",
            "question": "The following table shows the amount of money spent by six university students living in student accommodation on food, travel, rent and miscellaneous expenses, along with their monthly budget. (Gender: M — Male, F — Female).\n\n| Student | Monthly Budget (₹) | Food (₹) | Travel (₹) | Rent (₹) | Miscellaneous (₹) |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Sonia (F)** | 27,000 | 12,000 | 4,000 | 7,000 | 4,000 |\n| **Deepak (M)** | 25,000 | 10,000 | 5,000 | 5,000 | 3,000 |\n| **Komal (F)** | 27,000 | 12,000 | 4,500 | 6,500 | 4,000 |\n| **Gaurav (M)** | 22,000 | 9,500 | 4,500 | 5,500 | 2,500 |\n| **Arnav (M)** | 25,000 | 11,000 | 5,000 | 5,000 | 4,000 |\n| **Shruti (F)** | 22,000 | 10,000 | 4,500 | 5,000 | 2,500 |\n\n**Question**: Who among all the six students spends the highest percentage of their monthly budget on food?",
            "options": {
                "1": "Sonia",
                "2": "Komal",
                "3": "Arnav",
                "4": "Shruti"
            },
            "correct_option": "4",
            "correct_answer": "Shruti",
            "explanation": "Percentage of monthly budget spent on food by each student:\n• Sonia: $\\frac{12,000}{27,000} \\times 100 = 44.44\\%$\n• Deepak: $\\frac{10,000}{25,000} \\times 100 = 40.00\\%$\n• Komal: $\\frac{12,000}{27,000} \\times 100 = 44.44\\%$\n• Gaurav: $\\frac{9,500}{22,000} \\times 100 = 43.18\\%$\n• Arnav: $\\frac{11,000}{25,000} \\times 100 = 44.00\\%$\n• Shruti: $\\frac{10,000}{22,000} \\times 100 = 45.45\\%$\nShruti has the highest food expenditure percentage ($45.45\\%$).\nTherefore, Option (4) [Shruti] is correct."
        },
        93: {
            "section": "Data Interpretation",
            "question": "The following table shows the amount of money spent by six university students living in student accommodation on food, travel, rent and miscellaneous expenses, along with their monthly budget. (Gender: M — Male, F — Female).\n\n| Student | Monthly Budget (₹) | Food (₹) | Travel (₹) | Rent (₹) | Miscellaneous (₹) |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Sonia (F)** | 27,000 | 12,000 | 4,000 | 7,000 | 4,000 |\n| **Deepak (M)** | 25,000 | 10,000 | 5,000 | 5,000 | 3,000 |\n| **Komal (F)** | 27,000 | 12,000 | 4,500 | 6,500 | 4,000 |\n| **Gaurav (M)** | 22,000 | 9,500 | 4,500 | 5,500 | 2,500 |\n| **Arnav (M)** | 25,000 | 11,000 | 5,000 | 5,000 | 4,000 |\n| **Shruti (F)** | 22,000 | 10,000 | 4,500 | 5,000 | 2,500 |\n\n**Question**: Who among all the six students spends the least percentage of their monthly budget on travel?",
            "options": {
                "1": "Sonia",
                "2": "Komal",
                "3": "Arnav",
                "4": "Shruti"
            },
            "correct_option": "1",
            "correct_answer": "Sonia",
            "explanation": "Percentage of monthly budget spent on travel by each student:\n• Sonia: $\\frac{4,000}{27,000} \\times 100 = 14.81\\%$\n• Deepak: $\\frac{5,000}{25,000} \\times 100 = 20.00\\%$\n• Komal: $\\frac{4,500}{27,000} \\times 100 = 16.67\\%$\n• Gaurav: $\\frac{4,500}{22,000} \\times 100 = 20.45\\%$\n• Arnav: $\\frac{5,000}{25,000} \\times 100 = 20.00\\%$\n• Shruti: $\\frac{4,500}{22,000} \\times 100 = 20.45\\%$\nSonia spends the least percentage ($14.81\\%$) on travel.\nTherefore, Option (1) [Sonia] is correct."
        },
        94: {
            "section": "Data Interpretation",
            "question": "In a survey of 400 college students regarding their preference for three kinds of food — pasta, pizza and burgers:\n• 25% said they like pasta and pizza\n• 25% said they like pasta and burgers\n• 20% like pizza and burgers\n• 10% said they like all three\n• 60% of the students like pasta\n• 65% like pizza\n• 55% like burgers\n\n**Question**: What is the percentage of students who like at least two out of pasta, pizza and burgers?",
            "options": {
                "1": "50%",
                "2": "60%",
                "3": "70%",
                "4": "80%"
            },
            "correct_option": "1",
            "correct_answer": "50%",
            "explanation": "Using standard 3-set Venn diagram formulas:\n• Percentage liking all three = $10\\%$\n• Percentage liking (Pasta & Pizza only) = $25\\% - 10\\% = 15\\%$\n• Percentage liking (Pasta & Burgers only) = $25\\% - 10\\% = 15\\%$\n• Percentage liking (Pizza & Burgers only) = $20\\% - 10\\% = 10\\%$\n• Percentage of students who like at least two food items = $15\\% + 15\\% + 10\\% + 10\\% = 50\\%$.\nTherefore, Option (1) [50%] is correct."
        },
        95: {
            "section": "Data Interpretation",
            "question": "In a survey of 400 college students regarding their preference for three kinds of food — pasta, pizza and burgers:\n• 25% said they like pasta and pizza\n• 25% said they like pasta and burgers\n• 20% like pizza and burgers\n• 10% said they like all three\n• 60% of the students like pasta\n• 65% like pizza\n• 55% like burgers\n\n**Question**: How many students like only pizza out of the three kinds of food?",
            "options": {
                "1": "100",
                "2": "160",
                "3": "80",
                "4": "120"
            },
            "correct_option": "4",
            "correct_answer": "120",
            "explanation": "Total students = 400.\n• Total who like Pizza = $65\\%$ of $400 = 260$.\n• Students liking Pasta & Pizza only = $15\\%$ of $400 = 60$.\n• Students liking Pizza & Burgers only = $10\\%$ of $400 = 40$.\n• Students liking all three = $10\\%$ of $400 = 40$.\n• Students liking ONLY Pizza = $260 - (60 + 40 + 40) = 260 - 140 = 120$ (or $30\\%$ of 400).\nTherefore, Option (4) [120] is correct."
        },
        96: {
            "section": "Quantitative Techniques",
            "question": "The abscissa of a point is negative in:\n(A) First quadrant\n(B) Second and third quadrant\n(C) Second quadrant only\n(D) Third and fourth quadrant\n\nChoose the correct option:",
            "options": {
                "1": "First quadrant",
                "2": "Second and third quadrant",
                "3": "Second quadrant only",
                "4": "Third and fourth quadrant"
            },
            "correct_option": "2",
            "correct_answer": "Second and third quadrant",
            "explanation": "• Abscissa refers to the x-coordinate of a point $(x, y)$.\n• Quadrant I: $(+x, +y)$\n• Quadrant II: $(-x, +y)$ -> abscissa is negative\n• Quadrant III: $(-x, -y)$ -> abscissa is negative\n• Quadrant IV: $(+x, -y)$\nTherefore, the abscissa is negative in the Second and Third quadrants (Option 2)."
        },
        97: {
            "section": "Quantitative Techniques",
            "question": "Which of the following is/are rational number/numbers?\n(i) 0.67\n(ii) $1.414$\n(iii) $\\sqrt{2}$\n(iv) 8\n\nChoose the correct answer from the options given below:",
            "options": {
                "1": "(i) only",
                "2": "(ii), (iii) and (iv) only",
                "3": "(iii) and (iv) only",
                "4": "(i), (ii) and (iv) only"
            },
            "correct_option": "4",
            "correct_answer": "(i), (ii) and (iv) only",
            "explanation": "• $0.67 = 67/100$ is a terminating decimal, hence rational.\n• $1.414 = 1414/1000$ is a terminating decimal, hence rational.\n• $\\sqrt{2}$ is an irrational number.\n• $8 = 8/1$ is an integer, hence rational.\nTherefore, (i), (ii) and (iv) are rational numbers (Option 4)."
        },
        98: {
            "section": "Quantitative Techniques",
            "question": "What is the sum of cubes of the first 12 natural numbers?",
            "options": {
                "1": "78",
                "2": "6084",
                "3": "6500",
                "4": "19500"
            },
            "correct_option": "2",
            "correct_answer": "6084",
            "explanation": "The formula for the sum of cubes of the first $n$ natural numbers is:\n$$\\sum_{k=1}^n k^3 = \\left(\\frac{n(n+1)}{2}\\right)^2$$\nFor $n = 12$:\n$$\\frac{12 \\times 13}{2} = 6 \\times 13 = 78$$\n$$\\text{Sum of cubes} = 78^2 = 6,084$$\nTherefore, Option (2) [6084] is correct."
        },
        99: {
            "section": "Quantitative Techniques",
            "question": "Five colleagues A, B, C, D and E come to office by car pooling and start working at their desk at the exact same time. They put their mobile phones on silent mode to avoid distractions and check their phones at fixed regular intervals for any important message. The intervals in which A, B, C, D and E check their phones are 45, 60, 30, 45 and 90 minutes, respectively. If they start working at 10:00 am sharp, at what time will all of them be checking their respective phones together for the first time?",
            "options": {
                "1": "1:00 pm",
                "2": "12:00 noon",
                "3": "12:30 pm",
                "4": "11:30 am"
            },
            "correct_option": "1",
            "correct_answer": "1:00 pm",
            "explanation": "We need to find the LCM (Lowest Common Multiple) of the checking intervals: 45, 60, 30, 45, 90 minutes.\n• $45 = 3^2 \\times 5$\n• $60 = 2^2 \\times 3 \\times 5$\n• $30 = 2 \\times 3 \\times 5$\n• $90 = 2 \\times 3^2 \\times 5$\n$\\text{LCM}(45, 60, 30, 45, 90) = 2^2 \\times 3^2 \\times 5 = 4 \\times 9 \\times 5 = 180$ minutes $= 3$ hours.\nStarting at 10:00 am, they will all check their phones together after 3 hours: $10:00\\text{ am} + 3\\text{ hours} = 1:00\\text{ pm}$.\nTherefore, Option (1) [1:00 pm] is correct."
        },
        100: {
            "section": "Quantitative Techniques",
            "question": "25% of a class of students take up extra curricular activities (ECA). They chose at least one option from music and sports. If 20% of ECA students chose both music and sports, and 50% of them opted for sports, what percentage of ECA students chose only music?",
            "options": {
                "1": "10%",
                "2": "30%",
                "3": "50%",
                "4": "25%"
            },
            "correct_option": "3",
            "correct_answer": "50%",
            "explanation": "Among ECA students (Total = 100% of ECA group):\n• Every student chose at least one activity: $\\text{Music} \\cup \\text{Sports} = 100\\%$.\n• $\\text{Music} \\cap \\text{Sports} = 20\\%$.\n• $\\text{Total Sports} = 50\\% \\implies \\text{Sports ONLY} = 50\\% - 20\\% = 30\\%$.\n• Therefore, $\\text{Music ONLY} = 100\\% - \\text{Total Sports} = 100\\% - 50\\% = 50\\%$.\n(Alternatively, $\\text{Music ONLY} = 100\\% - (30\\% + 20\\%) = 50\\%$).\nTherefore, Option (3) [50%] is correct."
        }
    }

    # Update data array
    for q in data:
        qnum = q.get("question_number")
        if qnum in di_updates:
            up = di_updates[qnum]
            q["section"] = up["section"]
            q["question"] = up["question"]
            q["options"] = up["options"]
            q["correct_option"] = up["correct_option"]
            q["correct_answer"] = up["correct_answer"]
            q["explanation"] = up["explanation"]

    # Save to CUET_PG_MBA_JSON/
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    # Rebuild All_PYQs
    all_questions = []
    for yr in [2022, 2023, 2024, 2025, 2026]:
        p = os.path.join(JSON_DIR, f"CUET_PG_MBA_{yr}.json")
        with open(p, "r", encoding="utf-8") as f:
            y_data = json.load(f)
            all_questions.extend(y_data)
            
    all_pyqs_path = os.path.join(JSON_DIR, "CUET_PG_MBA_All_PYQs.json")
    with open(all_pyqs_path, "w", encoding="utf-8") as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
        
    # Copy to web/public
    shutil.copyfile(json_path, os.path.join(WEB_JSON_DIR, "CUET_PG_MBA_2022.json"))
    shutil.copyfile(all_pyqs_path, os.path.join(WEB_JSON_DIR, "CUET_PG_MBA_All_PYQs.json"))
    
    print("Perfect 2022 dataset built and synced successfully!")

if __name__ == "__main__":
    build_perfect_2022()
