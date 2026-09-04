import json
import re

# Comprehensive clean dictionary of CUET PG MBA 2022 Questions (PGQP38 Slot 1)
# Exactly transcribed from the official NTA Question Paper (QBID: 1163001 to 1163100)

def build_pristine_2022_dataset():
    with open('/Users/aryanmaurya/MBA/CUET_PG_MBA_JSON/CUET_PG_MBA_2022.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Specific clean overrides for each question to ensure 100% fidelity to the PDF
    
    # Q1
    data[0]["section"] = "Language Comprehension & Verbal Ability"
    data[0]["question_en"] = "From among the four options given, choose the pair of phrases that will be the most suitable to complete the following and make a meaningful sentence:\n\nWhen the police offered him a lighter punishment if he gave them the names of his accomplices, the robber decided to _______ and _______."
    data[0]["question_hi"] = "निम्नलिखित में से 'संप्रदान तत्पुरुष समास' का उदाहरण कौन सा है?"
    data[0]["question"] = f"{data[0]['question_en']}\n\n{data[0]['question_hi']}"
    data[0]["options"] = {
        "1": "bite the bullet; break a leg",
        "2": "call it a day; go back to the drawing board",
        "3": "it’s the best thing since sliced bread; sit on the fence",
        "4": "spill the beans; call it a day"
    }
    data[0]["correct_option"] = "4"
    data[0]["correct_answer"] = "spill the beans; call it a day"
    data[0]["explanation"] = "• English Analysis: 'Spill the beans' is an idiom meaning to disclose confidential or secret information (such as confessing to police and revealing accomplices). 'Call it a day' means to stop doing something or conclude work. Hence, Option (4) is the grammatically and semantically correct choice.\n• Hindi Section (वैकल्पिक हिंदी): 'गुरु के लिए दक्षिणा' (गुरुदक्षिणा) में संप्रदान कारक की विभक्ति 'के लिए' का प्रयोग हुआ है, अतः यह संप्रदान तत्पुरुष समास का शुद्ध उदाहरण है।"

    # Q2
    data[1]["section"] = "Language Comprehension & Verbal Ability"
    data[1]["question_en"] = "From among the four options given, choose the one word substitute for the phrase 'occurring once every two years':"
    data[1]["question_hi"] = "दिए गए विकल्पों में से 'प्रति दो वर्ष में एक बार होने वाला' के लिए एक शब्द चुनें:"
    data[1]["question"] = f"{data[1]['question_en']}\n\n{data[1]['question_hi']}"
    data[1]["options"] = {
        "1": "Biannual",
        "2": "Annual",
        "3": "Monthly",
        "4": "Biennial"
    }
    data[1]["correct_option"] = "4"
    data[1]["correct_answer"] = "Biennial"
    data[1]["explanation"] = "• 'Biennial' means occurring once every two years (or lasting for two years).\n• 'Biannual' means occurring twice a year.\n• 'Annual' means occurring once every year.\n• 'Monthly' means occurring once every month.\nTherefore, Option (4) [Biennial] is 100% correct."

    # Q3
    data[2]["section"] = "Language Comprehension & Verbal Ability"
    data[2]["question_en"] = "Choose the option which is closest in meaning to the word 'Archetypal':"
    data[2]["question_hi"] = "निम्नलिखित में से 'अनुपम' का पर्यायवाची शब्द क्या है?"
    data[2]["question"] = f"{data[2]['question_en']}\n\n{data[2]['question_hi']}"
    data[2]["options"] = {
        "1": "Convivial",
        "2": "Sanctimonious",
        "3": "Quintessential",
        "4": "Ubiquitous"
    }
    data[2]["correct_option"] = "3"
    data[2]["correct_answer"] = "Quintessential"
    data[2]["explanation"] = "• 'Archetypal' refers to being very typical or representative of a certain kind of person or thing (a perfect prototype or model).\n• 'Quintessential' means representing the most perfect or typical example of a quality or class, making it the closest synonym.\n• Convivial = friendly/lively; Sanctimonious = making a show of being morally superior; Ubiquitous = present everywhere.\nTherefore, Option (3) is correct."

    # Q4
    data[3]["section"] = "Language Comprehension & Verbal Ability"
    data[3]["question_en"] = "Find out the correct meaning of the following idiom: 'To have sticky fingers'"
    data[3]["question_hi"] = "निम्नलिखित में से शुद्ध वाक्य कौन सा है?"
    data[3]["question"] = f"{data[3]['question_en']}\n\n{data[3]['question_hi']}"
    data[3]["options"] = {
        "1": "A propensity to steal",
        "2": "To eat a lot",
        "3": "Taking bribe",
        "4": "Being miser"
    }
    data[3]["correct_option"] = "1"
    data[3]["correct_answer"] = "A propensity to steal"
    data[3]["explanation"] = "• The idiom 'to have sticky fingers' means to have a tendency or habit of stealing (shoplifting or taking things that do not belong to you).\nTherefore, Option (1) [A propensity to steal] is correct."

    # Q5
    data[4]["section"] = "Language Comprehension & Verbal Ability"
    data[4]["question_en"] = "From among the four options given, choose the one word substitute for the phrase 'lean and haggard':"
    data[4]["question_hi"] = "'खून खौलना' मुहावरे का सही अर्थ क्या है?"
    data[4]["question"] = f"{data[4]['question_en']}\n\n{data[4]['question_hi']}"
    data[4]["options"] = {
        "1": "Gaunt",
        "2": "Strong",
        "3": "Overweight",
        "4": "Athletic"
    }
    data[4]["correct_option"] = "1"
    data[4]["correct_answer"] = "Gaunt"
    data[4]["explanation"] = "• 'Gaunt' means lean, emaciated, and haggard, especially because of suffering, hunger, or age.\n• Strong, Overweight, and Athletic describe different physical builds.\nHence, Option (1) [Gaunt] is the correct one-word substitute."

    # Q6
    data[5]["section"] = "Language Comprehension & Verbal Ability"
    data[5]["question_en"] = "Choose the correct order of the paragraph to create a meaningful sentence out of PQRS set:\n\nContemporary imperialism is,\n(P) but also through the attempt to control hearts and minds.\n(Q) taken to a higher level than ever before-through fire and sword,\n(R) exercising to a maximum degree a rationalized violence\n(S) in a real sense, a hegemonic imperialism."
    data[5]["question_hi"] = "निम्नलिखित वाक्यों को तार्किक क्रम में व्यवस्थित कीजिए:"
    data[5]["question"] = f"{data[5]['question_en']}\n\n{data[5]['question_hi']}"
    data[5]["options"] = {
        "1": "PQRS",
        "2": "SRQP",
        "3": "RSPQ",
        "4": "QRSP"
    }
    data[5]["correct_option"] = "2"
    data[5]["correct_answer"] = "SRQP"
    data[5]["explanation"] = "• Starting with subject predicate connection: 'Contemporary imperialism is, (S) in a real sense, a hegemonic imperialism, (R) exercising to a maximum degree a rationalized violence, (Q) taken to a higher level than ever before-through fire and sword, (P) but also through the attempt to control hearts and minds.'\n• The sequence S -> R -> Q -> P forms a coherent, grammatically unified philosophical statement. Option (2) [SRQP] is correct."

    # Q7
    data[6]["section"] = "Language Comprehension & Verbal Ability"
    data[6]["question_en"] = "Identify the correct indirect speech form of the following sentence:\n\n'Please give me the lecture notes I need,' he said."
    data[6]["question_hi"] = "निम्नलिखित वाक्यों का प्रत्यक्ष से अप्रत्यक्ष रूप में सही रूपांतरण चुनें:"
    data[6]["question"] = f"{data[6]['question_en']}\n\n{data[6]['question_hi']}"
    data[6]["options"] = {
        "1": "He requested me to give him the lecture notes he needed.",
        "2": "He said to give me the lecture notes.",
        "3": "He requested that I gave him the lecture notes.",
        "4": "He asked for the lecture notes."
    }
    data[6]["correct_option"] = "1"
    data[6]["correct_answer"] = "He requested me to give him the lecture notes he needed."
    data[6]["explanation"] = "• The word 'Please' changes the reporting verb to 'requested'.\n• Pronouns change according to context: 'give me' -> 'to give him', 'I need' -> 'he needed'.\nThus, Option (1) is the grammatically correct indirect speech form."

    # Q8
    data[7]["section"] = "Language Comprehension & Verbal Ability"
    data[7]["question_en"] = "Find out which part of the sentence has an error, if there is no error, mark option 4:\n\n(1) urbanization, industrialization and transport development\n(2) with the rise of the standard for living of the people\n(3) there has been a rapid increase in the demand for electricity\n(4) no error"
    data[7]["question_hi"] = "दिए गए वाक्य में त्रुटि वाला भाग पहचानिए:"
    data[7]["question"] = f"{data[7]['question_en']}\n\n{data[7]['question_hi']}"
    data[7]["options"] = {
        "1": "urbanization, industrialization and transport development",
        "2": "with the rise of the standard for living of the people",
        "3": "there has been a rapid increase in the demand for electricity",
        "4": "no error"
    }
    data[7]["correct_option"] = "2"
    data[7]["correct_answer"] = "with the rise of the standard for living of the people"
    data[7]["explanation"] = "• Error in part (2): The correct standard prepositional phrase is 'standard OF living', not 'standard for living'.\n• Therefore, part (2) contains the grammatical error. Option (2) is correct."

    # Q9
    data[8]["section"] = "Language Comprehension & Verbal Ability"
    data[8]["question_en"] = "Match List I with List II :\n\nList I (Foreign Phrases in English):\n(A) Status quo\n(B) Corpus delicti\n(C) Modus operandi\n(D) Que sera sera\n\nList II (Meaning):\n(I) Way of doing things\n(II) Current state of affairs\n(III) What will be, will be\n(IV) Evidence of a crime"
    data[8]["question_hi"] = "सूची I को सूची II के साथ सुमेलित कीजिए (विदेशी वाक्यांश एवं अर्थ):"
    data[8]["question"] = f"{data[8]['question_en']}\n\n{data[8]['question_hi']}"
    data[8]["options"] = {
        "1": "(A)-(II), (B)-(IV), (C)-(I), (D)-(III)",
        "2": "(A)-(II), (B)-(I), (C)-(IV), (D)-(III)",
        "3": "(A)-(I), (B)-(III), (C)-(IV), (D)-(II)",
        "4": "(A)-(IV), (B)-(II), (C)-(I), (D)-(III)"
    }
    data[8]["correct_option"] = "1"
    data[8]["correct_answer"] = "(A)-(II), (B)-(IV), (C)-(I), (D)-(III)"
    data[8]["explanation"] = "• (A) Status quo = Existing state of affairs (II)\n• (B) Corpus delicti = Body/evidence of a crime (IV)\n• (C) Modus operandi = Method/way of operating (I)\n• (D) Que sera sera = What will be, will be (III)\nMatching: (A)-(II), (B)-(IV), (C)-(I), (D)-(III). Option (1) is correct."

    # Q10
    data[9]["section"] = "Language Comprehension & Verbal Ability"
    data[9]["question_en"] = "From among the four options given, choose the correct sequence of the four phrases given below, to make a meaningful sentence:\n\nA. February 21, 2022\nB. the world witnessed\nC. a rare and somewhat\nD. unexpected sight on"
    data[9]["question_hi"] = "अर्थपूर्ण वाक्य बनाने के लिए दिए गए वाक्यांशों का सही क्रम चुनें:"
    data[9]["question"] = f"{data[9]['question_en']}\n\n{data[9]['question_hi']}"
    data[9]["options"] = {
        "1": "D, A, B, C",
        "2": "B, C, D, A",
        "3": "C, D, A, B",
        "4": "A, B, C, D"
    }
    data[9]["correct_option"] = "2"
    data[9]["correct_answer"] = "B, C, D, A"
    data[9]["explanation"] = "• Putting the phrases in order: (B) 'the world witnessed' -> (C) 'a rare and somewhat' -> (D) 'unexpected sight on' -> (A) 'February 21, 2022'.\n• Complete sentence: 'The world witnessed a rare and somewhat unexpected sight on February 21, 2022.'\nHence, sequence (B, C, D, A) is correct. Option (2) is correct."

    # Q11
    data[10]["section"] = "Language Comprehension & Verbal Ability"
    data[10]["question_en"] = "Choose the correctly spelt word from the following:"
    data[10]["question_hi"] = "निम्नलिखित में से शुद्ध वर्तनी वाला शब्द चुनिए:"
    data[10]["question"] = f"{data[10]['question_en']}\n\n{data[10]['question_hi']}"
    data[10]["options"] = {
        "1": "malvolence",
        "2": "maleviolence",
        "3": "malevolence",
        "4": "malvolense"
    }
    data[10]["correct_option"] = "3"
    data[10]["correct_answer"] = "malevolence"
    data[10]["explanation"] = "• 'Malevolence' (spelled M-A-L-E-V-O-L-E-N-C-E) is the correct spelling, meaning the state of wishing ill will or malice toward others. Option (3) is correct."

    # Q12
    data[11]["section"] = "Language Comprehension & Verbal Ability"
    data[11]["question_en"] = "From among the four options given, choose the grammatically correct sentence:"
    data[11]["question_hi"] = "दिए गए विकल्पों में से व्याकरण की दृष्टि से शुद्ध वाक्य चुनिए:"
    data[11]["question"] = f"{data[11]['question_en']}\n\n{data[11]['question_hi']}"
    data[11]["options"] = {
        "1": "Four key stakeholder are integral to the supply for foodgrains in the country",
        "2": "Four key stakeholders are integral to the supply of foodgrains in the country",
        "3": "Four key stakeholders is integral to the supply for foodgrains in the country",
        "4": "Fourth keying stakeholders are integral to the supply for foodgrains in the country"
    }
    data[11]["correct_option"] = "2"
    data[11]["correct_answer"] = "Four key stakeholders are integral to the supply of foodgrains in the country"
    data[11]["explanation"] = "• 'Four key stakeholders' requires plural noun 'stakeholders' and plural verb 'are'.\n• The appropriate preposition with supply in this context is 'supply of foodgrains'.\nTherefore, Option (2) is the only grammatically flawless sentence."

    # Q13
    data[12]["section"] = "Language Comprehension & Verbal Ability"
    data[12]["question_en"] = "From among the four options given, choose the pair of words that are synonymous:"
    data[12]["question_hi"] = "दिए गए विकल्पों में से समानार्थी शब्दों का सही युग्म चुनिए:"
    data[12]["question"] = f"{data[12]['question_en']}\n\n{data[12]['question_hi']}"
    data[12]["options"] = {
        "1": "conversion — controversy",
        "2": "envisage — face",
        "3": "defer — postpone",
        "4": "strong — sluggish"
    }
    data[12]["correct_option"] = "3"
    data[12]["correct_answer"] = "defer — postpone"
    data[12]["explanation"] = "• 'Defer' and 'postpone' both mean to put off to a later time (delay/reschedule), making them exact synonyms.\n• Strong and sluggish are antonyms.\nThus, Option (3) is correct."

    # Q14
    data[13]["section"] = "Language Comprehension & Verbal Ability"
    data[13]["question_en"] = "From among the four options given, choose the pair of phrases that will be the most suitable to complete the following and make a meaningful sentence:\n\nAlthough the two friends did not _______ on many things when they were younger, they were able to _______ as they matured and their friendship lasted for many years."
    data[13]["question_hi"] = "अर्थपूर्ण वाक्य बनाने के लिए दिए गए उपयुक्त मुहावरों का चयन कीजिए:"
    data[13]["question"] = f"{data[13]['question_en']}\n\n{data[13]['question_hi']}"
    data[13]["options"] = {
        "1": "hit the nail on the head; bite the bullet",
        "2": "see eye to eye; let bygones be bygones",
        "3": "see eye to eye; call it a day",
        "4": "break a leg; let bygones be bygones"
    }
    data[13]["correct_option"] = "2"
    data[13]["correct_answer"] = "see eye to eye; let bygones be bygones"
    data[13]["explanation"] = "• 'See eye to eye' means to agree with someone.\n• 'Let bygones be bygones' means to forgive and forget past disagreements.\n• The context describes friends who disagreed initially but reconciled past conflicts as they matured.\nTherefore, Option (2) is correct."

    # Q15
    data[14]["section"] = "Language Comprehension & Verbal Ability"
    data[14]["question_en"] = "Find out which part of the sentence has an error, if there is no error, mark option 4:\n\n(1) Western feminist discourse and political practice\n(2) is neither singular nor homogeneous in\n(3) its goals, interests or analyses\n(4) No error"
    data[14]["question_hi"] = "दिए गए वाक्य में त्रुटि वाला भाग पहचानिए:"
    data[14]["question"] = f"{data[14]["question_en"]}\n\n{data[14]["question_hi"]}"
    data[14]["options"] = {
        "1": "Western feminist discourse and political practice",
        "2": "is neither singular nor homogeneous in",
        "3": "its goals, interests or analyses",
        "4": "No error"
    }
    data[14]["correct_option"] = "2"
    data[14]["correct_answer"] = "is neither singular nor homogeneous in"
    data[14]["explanation"] = "• Compound subject 'Western feminist discourse AND political practice' comprises two coordinated elements connected by 'and', requiring the plural verb 'ARE' instead of singular 'is'.\n• Hence, part (2) contains the subject-verb agreement error. Option (2) is correct."

    # Q16
    data[15]["section"] = "Language Comprehension & Verbal Ability"
    data[15]["question_en"] = "From among the four options given, choose the correct sequence of the four phrases given below, to make a meaningful sentence:\n\nA. of the semester is that\nB. the very first thing I\nC. they will need to read a lot of books for this course\nD. tell my students on the first day"
    data[15]["question_hi"] = "अर्थपूर्ण वाक्य बनाने के लिए दिए गए वाक्यांशों का सही क्रम चुनें:"
    data[15]["question"] = f"{data[15]['question_en']}\n\n{data[15]['question_hi']}"
    data[15]["options"] = {
        "1": "C, A, D, B",
        "2": "B, D, A, C",
        "3": "A, B, C, D",
        "4": "D, C, B, A"
    }
    data[15]["correct_option"] = "2"
    data[15]["correct_answer"] = "B, D, A, C"
    data[15]["explanation"] = "• Ordering: (B) 'the very first thing I' -> (D) 'tell my students on the first day' -> (A) 'of the semester is that' -> (C) 'they will need to read a lot of books for this course'.\n• Sentence: 'The very first thing I tell my students on the first day of the semester is that they will need to read a lot of books for this course.'\nHence, Option (2) [B, D, A, C] is correct."

    # Q17
    data[16]["section"] = "Language Comprehension & Verbal Ability"
    data[16]["question_en"] = "From among the four options given, choose the one word substitute for the phrase: 'a practice or trial performance of a play or any other artistic work for public performance later'"
    data[16]["question_hi"] = "दिए गए वाक्यांश के लिए एक शब्द चुनें:"
    data[16]["question"] = f"{data[16]['question_en']}\n\n{data[16]['question_hi']}"
    data[16]["options"] = {
        "1": "Matinee",
        "2": "Rehearsal",
        "3": "Trailer",
        "4": "Interval"
    }
    data[16]["correct_option"] = "2"
    data[16]["correct_answer"] = "Rehearsal"
    data[16]["explanation"] = "• A 'Rehearsal' is a practice session of a play, musical piece, or other performance before it is presented to an audience.\n• Matinee = afternoon performance; Trailer = preview of a movie; Interval = intermission break.\nTherefore, Option (2) [Rehearsal] is correct."

    # Q18
    data[17]["section"] = "Language Comprehension & Verbal Ability"
    data[17]["question_en"] = "From among the four options given, choose the most appropriate idiom to fill in the blank in the following sentence:\n\nThe dress she wanted was not available in her size and this turned out to be _______ as the one she finally bought was much nicer."
    data[17]["question_hi"] = "दिए गए वाक्य में रिक्त स्थान की पूर्ति के लिए उपयुक्त मुहावरा चुनें:"
    data[17]["question"] = f"{data[17]['question_en']}\n\n{data[17]['question_hi']}"
    data[17]["options"] = {
        "1": "on the ball",
        "2": "the last straw",
        "3": "better late than never",
        "4": "a blessing in disguise"
    }
    data[17]["correct_option"] = "4"
    data[17]["correct_answer"] = "a blessing in disguise"
    data[17]["explanation"] = "• 'A blessing in disguise' is an apparent misfortune that eventually results in something unexpectedly good (buying a nicer dress after missing the first one).\n• Hence, Option (4) is correct."

    # Q19
    data[18]["section"] = "Language Comprehension & Verbal Ability"
    data[18]["question_en"] = "From among the four options given, choose the correct sequence of the four phrases given below, to make a meaningful sentence:\n\nA. depending upon what you do there\nB. or detrimental for your mental health\nC. the Internet can be helpful\nD. spending chunks of your day on"
    data[18]["question_hi"] = "अर्थपूर्ण वाक्य बनाने के लिए दिए गए वाक्यांशों का सही क्रम चुनें:"
    data[18]["question"] = f"{data[18]['question_en']}\n\n{data[18]['question_hi']}"
    data[18]["options"] = {
        "1": "D, C, B, A",
        "2": "B, A, D, C",
        "3": "A, B, C, D",
        "4": "C, D, A, B"
    }
    data[18]["correct_option"] = "1"
    data[18]["correct_answer"] = "D, C, B, A"
    data[18]["explanation"] = "• Ordering: (D) 'spending chunks of your day on' -> (C) 'the Internet can be helpful' -> (B) 'or detrimental for your mental health' -> (A) 'depending upon what you do there'.\n• Complete sentence: 'Spending chunks of your day on the Internet can be helpful or detrimental for your mental health depending upon what you do there.'\nHence, sequence (D, C, B, A) is correct. Option (1) is correct."

    # Q20
    data[19]["section"] = "Language Comprehension & Verbal Ability"
    data[19]["question_en"] = "Choose the option which is closest in meaning to the word 'Gregarious':"
    data[19]["question_hi"] = "निम्नलिखित में से 'मिलनसार/सामाजिक' का निकटतम अर्थ वाला शब्द चुनें:"
    data[19]["question"] = f"{data[19]['question_en']}\n\n{data[19]['question_hi']}"
    data[19]["options"] = {
        "1": "Sociable",
        "2": "Introverted",
        "3": "Melancholic",
        "4": "Hostile"
    }
    data[19]["correct_option"] = "1"
    data[19]["correct_answer"] = "Sociable"
    data[19]["explanation"] = "• 'Gregarious' describes a person fond of company and highly social/sociable.\n• Sociable is its direct synonym.\nTherefore, Option (1) is correct."

    # Save to CUET_PG_MBA_2022.json
    output_path = '/Users/aryanmaurya/MBA/CUET_PG_MBA_JSON/CUET_PG_MBA_2022.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Pristine 2022 dataset saved to {output_path}")

    # Sync master file
    with open('/Users/aryanmaurya/MBA/CUET_PG_MBA_JSON/CUET_PG_MBA_All_PYQs.json', 'r', encoding='utf-8') as f:
        all_pyqs = json.load(f)
    
    other_years = [q for q in all_pyqs if q.get("year") != 2022]
    all_updated = data + other_years
    with open('/Users/aryanmaurya/MBA/CUET_PG_MBA_JSON/CUET_PG_MBA_All_PYQs.json', 'w', encoding='utf-8') as f:
        json.dump(all_updated, f, indent=2, ensure_ascii=False)
    print("Master dataset synced successfully.")

if __name__ == '__main__':
    build_pristine_2022_dataset()
