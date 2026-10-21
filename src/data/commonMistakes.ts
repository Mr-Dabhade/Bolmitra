export interface CommonMistake {
  id: string;
  category: 'literal_translation' | 'tenses' | 'prepositions' | 'vocabulary' | 'daily_habit';
  categoryMarathi: string;
  incorrect: string;
  correct: string;
  marathiExplanation: string;
  literalTrapMarathi: string;
  exampleInSentence: string;
  practicePrompt: string;
}

export const COMMON_MISTAKES: CommonMistake[] = [
  {
    id: 'agree_mistake',
    category: 'literal_translation',
    categoryMarathi: 'थेट भाषांतराची चूक (Literal Translation)',
    incorrect: 'I am agree with your opinion.',
    correct: 'I agree with your opinion.',
    marathiExplanation: "मराठीत आपण 'मी तुझ्याशी सहमत आहे' असे बोलतो, त्यामुळे मराठी भाषिकांना 'am' (आहे) लावण्याची सवय लागते. परंतु इंग्रजीत 'agree' हे स्वतःच एक क्रियापद (Verb) आहे, त्यामुळे 'am' लावण्याची अजिबात गरज नसते. नेहमी फक्त 'I agree' म्हणावे.",
    literalTrapMarathi: "'मी सहमत आहे' = I am agree ❌ -> फक्त 'I agree' म्हणा ✅",
    exampleInSentence: "I completely agree with what you said in the meeting.",
    practicePrompt: "Say: I agree with your idea.",
  },
  {
    id: 'having_relatives',
    category: 'tenses',
    categoryMarathi: 'काळ व मालकी (Possession & Tense)',
    incorrect: 'I am having two brothers and one car.',
    correct: 'I have two brothers and a car.',
    marathiExplanation: "जेव्हा आपल्याला नातेवाईक, भावंडे किंवा वस्तूंची मालकी दर्शवायची असते, तेव्हा 'have' चा वापर 'Stative Verb' म्हणून होतो. त्यामुळे त्याचे 'having' हे चालू काळ रूप वापरणे चुकीचे ठरते. केवळ जेवताना किंवा अनुभव घेताना 'having lunch' किंवा 'having fun' म्हणू शकता.",
    literalTrapMarathi: "'माझ्याकडे २ भाऊ आहेत' चे रूपांतर 'I am having' करू नका ❌ -> 'I have' वापरा ✅",
    exampleInSentence: "I have two sisters and we live in Pune.",
    practicePrompt: "Tell me about your family using 'I have...'",
  },
  {
    id: 'married_to',
    category: 'prepositions',
    categoryMarathi: 'शब्दयोगी अव्यये (Prepositions)',
    incorrect: 'She is married with an engineer.',
    correct: 'She is married to an engineer.',
    marathiExplanation: "मराठीत आपण 'तीचे एका अभियंत्यासोबत लग्न झाले आहे' (सोबत = with) असे विचार करतो. परंतु इंग्रजी व्याकरणाच्या नियमानुसार 'married' या शब्दासोबत नेहमी 'to' हेच प्रिपोझिशन येते, 'with' कधीही वापरू नये.",
    literalTrapMarathi: "मराठी 'सोबत' वरून 'with' लावू नका ❌ -> इंग्रजीत 'married to' च येते ✅",
    exampleInSentence: "My cousin is married to a doctor in Mumbai.",
    practicePrompt: "Make a sentence saying someone is married to someone.",
  },
  {
    id: 'didnt_knew',
    category: 'tenses',
    categoryMarathi: 'भूतकाळ नियम (Past Tense Rule)',
    incorrect: "I didn't knew about today's meeting.",
    correct: "I didn't know about today's meeting.",
    marathiExplanation: "हा इंग्रजी शिकणाऱ्यांचा सर्वात मोठा घोटाळा आहे! 'Didn't' (did not) हा स्वतःच भूतकाळ दर्शवतो. त्यामुळे 'did' किंवा 'didn't' नंतर येणारे मुख्य क्रियापद नेहमी मूळ रूपात (First form - V1) असावे लागते. 'Didn't went' किंवा 'Didn't knew' चूक आहे; 'Didn't go', 'Didn't know' योग्य आहे.",
    literalTrapMarathi: "Didn't नंतर पुन्हा भूतकाळ वापरू नका ❌ -> Didn't + V1 (मूळ रूप) वापरा ✅",
    exampleInSentence: "I didn't see him at the party yesterday.",
    practicePrompt: "Say: I didn't understand the problem.",
  },
  {
    id: 'cousin_brother',
    category: 'vocabulary',
    categoryMarathi: 'शब्दसंग्रह (Vocabulary & Idioms)',
    incorrect: 'He is my cousin brother and she is my cousin sister.',
    correct: 'He is my cousin and she is my cousin.',
    marathiExplanation: "मराठीत आपण 'चुलत भाऊ', 'मावस बहीण' असे लिंग स्पष्ट करतो. पण इंग्रजीत 'cousin' या शब्दातच भाऊ किंवा बहीण सामावलेली असते. त्यामुळे 'cousin brother' किंवा 'cousin sister' हे शब्द इंग्रजी शब्दकोशात नाहीत. लिंग ओळखण्यासाठी फक्त 'He is my cousin' किंवा 'She is my cousin' म्हणावे.",
    literalTrapMarathi: "'चुलत भाऊ' = Cousin Brother ❌ -> फक्त 'Cousin' म्हणा ✅",
    exampleInSentence: "My cousin lives in Nagpur and he works as a software developer.",
    practicePrompt: "Introduce your cousin to me.",
  },
  {
    id: 'open_close_fan',
    category: 'daily_habit',
    categoryMarathi: 'दैनंदिन सवयींचे शब्द (Daily Life Verbs)',
    incorrect: 'Please open the fan and close the light.',
    correct: 'Please turn on the fan and turn off the light.',
    marathiExplanation: "मराठीत आपण दरवाजा, खिडकीप्रमाणेच पंखा किंवा लाईटलाही 'पंखा उघडा' आणि 'लाईट बंद करा' म्हणतो. परंतु इंग्रजीत विजेच्या उपकरणांसाठी 'open/close' वापरता येत नाही; त्यासाठी 'turn on / turn off' किंवा 'switch on / switch off' वापरले पाहिजे.",
    literalTrapMarathi: "लाईट किंवा पंख्यासाठी 'open / close' नको ❌ -> 'turn on / turn off' वापरा ✅",
    exampleInSentence: "Could you please switch on the air conditioner? It is hot here.",
    practicePrompt: "Ask someone to turn on the TV.",
  },
  {
    id: 'told_to_me',
    category: 'prepositions',
    categoryMarathi: 'क्रियापद व प्रिपोझिशन (Verbs with Prepositions)',
    incorrect: 'He told to me that he was busy.',
    correct: 'He told me that he was busy. (OR: He said to me...)',
    marathiExplanation: "'Tell' (किंवा told) या क्रियापदानंतर ज्या व्यक्तीला सांगितले त्याचे नाव किंवा सर्वनाम थेट येते, मधे 'to' लागत नाही (उदा. He told me, told Rahul). जर 'to' वापरायचा असेल तर 'said to me' म्हणावे लागते.",
    literalTrapMarathi: "'त्याने मला सांगितले' = told to me ❌ -> थेट 'told me' म्हणा ✅",
    exampleInSentence: "The teacher told us to submit the assignment tomorrow.",
    practicePrompt: "Say: She told me the truth.",
  },
  {
    id: 'since_for_years',
    category: 'tenses',
    categoryMarathi: 'काळ (Since vs For & Present Perfect)',
    incorrect: 'I am living in Mumbai since 5 years.',
    correct: 'I have been living in Mumbai for 5 years.',
    marathiExplanation: "मराठीत 'मी ५ वर्षांपासून मुंबईत राहत आहे' असे चालू वर्तमानकाळात बोलले जाते. पण इंग्रजीत एखादी गोष्ट भूतकाळात सुरू होऊन आजही सुरू असल्यास 'have been + ing' (Present Perfect Continuous) वापरतात. तसेच कालावधीसाठी (५ वर्षे, २ तास) 'for' वापरतात, तर विशिष्ट वेळेसाठी (२०१९ पासून, सकाळपासून) 'since' वापरतात.",
    literalTrapMarathi: "कालावधीसाठी 'am living since' नको ❌ -> 'have been living for' वापरा ✅",
    exampleInSentence: "She has been working in this company for three years.",
    practicePrompt: "Tell me how long you have been learning English.",
  },
  {
    id: 'good_name',
    category: 'literal_translation',
    categoryMarathi: 'थेट भाषांतराची चूक (Literal Translation)',
    incorrect: 'What is your good name sir?',
    correct: 'May I know your name, please? (or: What is your name?)',
    marathiExplanation: "आपल्या संस्कृतीत आपण आदराने 'आपले शुभ नाव काय?' असे विचारतो. त्याचे इंग्रजीत 'good name' असे शब्दशः भाषांतर केल्यास मूळ इंग्रजी भाषिकांना ते विचित्र वाटते. इंग्रजीत शिष्टाचाराने विचारण्यासाठी 'May I know your name, please?' किंवा साधे 'What is your name?' वापरावे.",
    literalTrapMarathi: "'शुभ नाव' = good name ❌ -> 'May I know your name?' म्हणा ✅",
    exampleInSentence: "Good morning! May I know your name and who you wish to meet?",
    practicePrompt: "Ask my name politely.",
  },
];
