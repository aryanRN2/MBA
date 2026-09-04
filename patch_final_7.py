import json

def patch_final_7():
    for path in [
        '/Users/aryanmaurya/MBA/CUET_PG_MBA_JSON/CUET_PG_MBA_2022.json',
        '/Users/aryanmaurya/MBA/web/public/CUET_PG_MBA_JSON/CUET_PG_MBA_2022.json'
    ]:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Patch Q54
        data[53]["section"] = "Quantitative Aptitude"
        data[53]["question_en"] = "The ratio between the three angles of a quadrilateral is 3 : 4 : 9. The value of the fourth angle of the quadrilateral is 88°. What is the difference between the largest and the smallest angles of the quadrilateral?"
        data[53]["question_hi"] = "एक चतुर्भुज के तीन कोणों का अनुपात 3 : 4 : 9 है। चतुर्भुज के चौथे कोण का मान 88° है। चतुर्भुज के सबसे बड़े और सबसे छोटे कोणों के बीच क्या अंतर है?"
        data[53]["question"] = f"{data[53]['question_en']}\n\n{data[53]['question_hi']}"
        data[53]["options"] = {
            "1": "102°",
            "2": "106°",
            "3": "82°",
            "4": "92°"
        }
        data[53]["correct_option"] = "1"
        data[53]["correct_answer"] = "102°"
        data[53]["explanation"] = "• Sum of all 4 angles in a quadrilateral = 360°.\n• Sum of the first 3 angles = 360° - 88° = 272°.\n• Sum of ratio parts = 3 + 4 + 9 = 16x = 272 => x = 17°.\n• Smallest angle = 3x = 3 * 17 = 51°.\n• Largest angle = 9x = 9 * 17 = 153°.\n• Difference = 153° - 51° = 102° (or 9x - 3x = 6 * 17 = 102°).\nTherefore, Option (1) [102°] is 100% correct."

        # Patch Q66
        data[65]["section"] = "Logical Reasoning"
        data[65]["question_en"] = "Given below are two statements based on the following information about five friends:\n\nSunita is heavier than Anita, but not as heavy as Renu. Anita is heavier than Jayanti. Kritika is heavier than Sunita, but lighter than Renu.\n\nStatement I: Kritika is the heaviest among her friends.\nStatement II: Jayanti is the lightest among her friends.\n\nIn the light of the above statements, choose the correct answer from the options given below:"
        data[65]["question_hi"] = "पांच मित्रों के वजन के आधार पर नीचे दो कथन दिए गए हैं:\nसुनीता, अनिता से भारी है लेकिन रेनू जितनी भारी नहीं है। अनिता, जयंती से भारी है। कृतिका, सुनीता से भारी है लेकिन रेनू से हल्की है।\nकथन I: कृतिका अपने मित्रों में सबसे भारी है।\nकथन II: जयंती अपने मित्रों में सबसे हल्की है।"
        data[65]["question"] = f"{data[65]['question_en']}\n\n{data[65]['question_hi']}"
        data[65]["options"] = {
            "1": "Both Statement I and Statement II are true",
            "2": "Both Statement I and Statement II are false",
            "3": "Statement I is true but Statement II is false",
            "4": "Statement I is false but Statement II is true"
        }
        data[65]["correct_option"] = "4"
        data[65]["correct_answer"] = "Statement I is false but Statement II is true"
        data[65]["explanation"] = "• Weight order: Renu > Kritika > Sunita > Anita > Jayanti.\n• Renu is the heaviest (so Statement I that Kritika is heaviest is FALSE).\n• Jayanti is the lightest (so Statement II is TRUE).\nTherefore, Statement I is false but Statement II is true. Option (4) is correct."

        # Patch Q69
        data[68]["section"] = "Logical Reasoning"
        data[68]["question_en"] = "From the three statements (A-C) and four conclusions (1-4) given below, identify the conclusions that could be logically inferred:\n\nStatement A: Some florists are cleaners.\nStatement B: No cleaner is a driver.\nStatement C: All drivers are florists.\n\nConclusion 1: Some cleaners are florists.\nConclusion 2: All florists are drivers.\nConclusion 3: No driver is a cleaner.\nConclusion 4: Some drivers are cleaners."
        data[68]["question_hi"] = "दिए गए कथनों और निष्कर्षों से तार्किक रूप से मान्य निष्कर्ष चुनिए:"
        data[68]["question"] = f"{data[68]['question_en']}\n\n{data[68]['question_hi']}"
        data[68]["options"] = {
            "1": "1 only",
            "2": "1 and 3 only",
            "3": "1 and 4 only",
            "4": "3 only"
        }
        data[68]["correct_option"] = "2"
        data[68]["correct_answer"] = "1 and 3 only"
        data[68]["explanation"] = "• Statement A ('Some florists are cleaners') directly converts to Conclusion 1 ('Some cleaners are florists') - VALID.\n• Statement B ('No cleaner is a driver') directly converts to Conclusion 3 ('No driver is a cleaner') - VALID.\n• Conclusions 2 and 4 do not follow.\nTherefore, Conclusions 1 and 3 only follow. Option (2) is correct."

        # Patch Q73
        data[72]["section"] = "Logical Reasoning"
        data[72]["question_en"] = "If A is the son of B, B and C are sisters, D is the mother of C, E is the son of D, then which of the following statements is correct?"
        data[72]["question_hi"] = "यदि A, B का पुत्र है, B और C बहनें हैं, D, C की माँ है, E, D का पुत्र है, तो निम्नलिखित में से कौन सा कथन सही है?"
        data[72]["question"] = f"{data[72]['question_en']}\n\n{data[72]['question_hi']}"
        data[72]["options"] = {
            "1": "E is the maternal uncle of A",
            "2": "E and C are sisters",
            "3": "A and E are cousins",
            "4": "B is the daughter of E"
        }
        data[72]["correct_option"] = "1"
        data[72]["correct_answer"] = "E is the maternal uncle of A"
        data[72]["explanation"] = "• D is the mother of B, C (daughters) and E (son).\n• E is the brother of B.\n• Since B is the mother of A, E is the brother of A's mother, which means E is the maternal uncle (मामा) of A.\nHence, Option (1) is 100% correct."

        # Patch Q81
        data[80]["section"] = "Logical Reasoning"
        data[80]["question_en"] = "A statement is followed by two inferences 1 and 2. Considering the statement to be true, which of the inferences 1 and 2 logically follow?\n\nStatement: In a T-20 cricket match, the number of runs scored by the Indian team was 212 and out of these 160 runs were scored by spinners.\nInference 1: 10% of Indian team consists of spinners.\nInference 2: The opening batters were spinners."
        data[80]["question_hi"] = "कथन एवं अनुमान विश्लेषण:"
        data[80]["question"] = f"{data[80]['question_en']}\n\n{data[80]['question_hi']}"
        data[80]["options"] = {
            "1": "1 only",
            "2": "2 only",
            "3": "Both 1 and 2",
            "4": "Neither 1 nor 2"
        }
        data[80]["correct_option"] = "4"
        data[80]["correct_answer"] = "Neither 1 nor 2"
        data[80]["explanation"] = "• Runs scored by spinners does not indicate the percentage of team members who are spinners (Inference 1 does not follow).\n• The statement gives no information about batting order or openers (Inference 2 does not follow).\nTherefore, Neither 1 nor 2 follows. Option (4) is correct."

        # Patch Q84
        data[83]["section"] = "Logical Reasoning / Sets"
        data[83]["question_en"] = "In a housing society, 50 households subscribe to newspaper 1, 60 households subscribe to newspaper 2 and 70 households subscribe to newspaper 3. Further 25 households subscribe to both 1 and 2, 20 households to both 2 and 3 and 10 households to both 1 and 3. Also there are 5 households which subscribe to all the three newspapers. How many households subscribe to at least one newspaper?"
        data[83]["question_hi"] = "एक हाउसिंग सोसाइटी में, 50 घर समाचार पत्र 1, 60 घर समाचार पत्र 2 और 70 घर समाचार पत्र 3 खरीदते हैं। 25 घर 1 और 2 दोनों, 20 घर 2 और 3 दोनों, 10 घर 1 और 3 दोनों और 5 घर तीनों समाचार पत्र खरीदते हैं। कुल कितने घर कम से कम एक समाचार पत्र खरीदते हैं?"
        data[83]["question"] = f"{data[83]['question_en']}\n\n{data[83]['question_hi']}"
        data[83]["options"] = {
            "1": "130",
            "2": "140",
            "3": "150",
            "4": "60"
        }
        data[83]["correct_option"] = "1"
        data[83]["correct_answer"] = "130"
        data[83]["explanation"] = "• By principle of inclusion-exclusion for 3 sets:\nn(A ∪ B ∪ C) = n(A) + n(B) + n(C) - n(A ∩ B) - n(B ∩ C) - n(A ∩ C) + n(A ∩ B ∩ C)\n= 50 + 60 + 70 - 25 - 20 - 10 + 5\n= 180 - 55 + 5 = 130.\nHence, Option (1) [130] is 100% correct."

        # Patch Q85
        data[84]["section"] = "Logical Reasoning"
        data[84]["question_en"] = "A Director of a Hospital must constitute a committee of five persons by selecting two Doctors from A, B and C and three Engineers from D, E, F, G and H. It is given that both B and H together, both G and F together and both E and H together cannot be the members of the committee. If C is not selected in the committee, then any of the following could be in the committee except:"
        data[84]["question_hi"] = "एक अस्पताल के निदेशक को पांच व्यक्तियों की एक समिति का गठन करना है..."
        data[84]["question"] = f"{data[84]['question_en']}\n\n{data[84]['question_hi']}"
        data[84]["options"] = {
            "1": "D",
            "2": "H",
            "3": "E",
            "4": "G"
        }
        data[84]["correct_option"] = "2"
        data[84]["correct_answer"] = "H"
        data[84]["explanation"] = "• Since C is not selected, the 2 Doctors MUST be A and B.\n• Since B is selected and B and H cannot be together, H cannot be in the committee.\nTherefore, H cannot be selected. Option (2) [H] is correct."

        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    print("All 7 questions successfully patched!")

if __name__ == '__main__':
    patch_final_7()
