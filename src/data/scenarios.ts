import { ScenarioId } from '../types';

export interface Scenario {
  id: ScenarioId;
  title: string;
  marathiTitle: string;
  description: string;
  marathiDescription: string;
  icon: string;
  initialPrompt: string;
  initialMarathiTranslation: string;
  examplePrompts: { english: string; marathi: string }[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'casual',
    title: 'Daily Friendly Chat',
    marathiTitle: 'दैनंदिन मैत्रीपूर्ण गप्पा',
    description: 'Talk about your day, hobbies, weekend plans, or family.',
    marathiDescription: 'दिवस कसा गेला, छंद, शनिवार-रविवारचे प्लॅन्स यावर मोकळेपणाने बोला.',
    icon: 'MessageCircle',
    initialPrompt: "Hi there! I'm your English speaking partner. How was your day today? What did you do this morning?",
    initialMarathiTranslation: "नमस्कार! मी तुमचा इंग्रजी संभाषण मित्र आहे. आजचा तुमचा दिवस कसा गेला? आज सकाळी तुम्ही काय केले?",
    examplePrompts: [
      { english: "Today was very busy for me at work.", marathi: "आज कामावर खूप गडबड आणि व्यस्त दिवस होता." },
      { english: "I watched an interesting movie yesterday.", marathi: "मी काल एक छान चित्रपट पाहिला." },
      { english: "I am trying to improve my English speaking.", marathi: "मी माझे इंग्रजी संभाषण सुधारण्याचा प्रयत्न करत आहे." },
    ],
  },
  {
    id: 'job_interview',
    title: 'Job Interview Practice',
    marathiTitle: 'नोकरीची मुलाखत (Job Interview)',
    description: 'Practice self-introduction, strength/weakness, and project questions.',
    marathiDescription: 'स्वतःची ओळख, अनुभव, गुण-दोष आणि मुलाखतीतील प्रश्नांची पूर्वतयारी करा.',
    icon: 'Briefcase',
    initialPrompt: "Welcome to this interview practice! Could you please introduce yourself and tell me a bit about your background?",
    initialMarathiTranslation: "मुलाखत सरावामध्ये आपले स्वागत आहे! कृपया तुमची ओळख करून द्या आणि तुमच्या पार्श्वभूमीबद्दल थोडी माहिती सांगा.",
    examplePrompts: [
      { english: "My name is Rahul and I have two years experience in sales.", marathi: "माझे नाव राहुल आहे आणि मला विक्रीमध्ये दोन वर्षांचा अनुभव आहे." },
      { english: "I am passionate about learning new technologies.", marathi: "मला नवीन तंत्रज्ञान शिकण्याची मनापासून आवड आहे." },
      { english: "My biggest strength is my communication and hard work.", marathi: "माझी सर्वात मोठी ताकद म्हणजे माझे संभाषण कौशल्य आणि मेहनत." },
    ],
  },
  {
    id: 'restaurant',
    title: 'Café & Restaurant Ordering',
    marathiTitle: 'हॉटेल व कॅफेमध्ये ऑर्डर देणे',
    description: 'Order food, ask about specials, request the bill, or give feedback.',
    marathiDescription: 'हॉटेलमध्ये मेन्यू विचारणे, ऑर्डर देणे, चव कशी लागली ते सांगणे आणि बिल मागणे.',
    icon: 'Utensils',
    initialPrompt: "Good evening! Welcome to our restaurant. Can I start you off with something to drink, or are you ready to order food?",
    initialMarathiTranslation: "शुभ संध्याकाळ! आमच्या रेस्टॉरंटमध्ये आपले स्वागत आहे. मी पिण्यासाठी काही आणू की तुम्ही जेवणाची ऑर्डर देण्यासाठी तयार आहात?",
    examplePrompts: [
      { english: "Could you please bring me a glass of warm water?", marathi: "कृपया मला एक ग्लास कोमट पाणी आणून द्याल का?" },
      { english: "What is your best vegetarian specialty today?", marathi: "आज तुमच्याकडे सर्वात उत्तम शाकाहारी स्पेशल डिश कोणती आहे?" },
      { english: "Can we have the bill please?", marathi: "कृपया आम्हाला बिल मिळेल का?" },
    ],
  },
  {
    id: 'shopping',
    title: 'Shopping & Bargaining',
    marathiTitle: 'खरेदी आणि दुकानातील संवाद',
    description: 'Ask for sizes, colors, trial rooms, and polite negotiation.',
    marathiDescription: 'कपड्यांचा आकार विचारणे, डिस्काउंट किंवा ट्रॉयल रूमबद्दल चौकशी करणे.',
    icon: 'ShoppingBag',
    initialPrompt: "Hello! Welcome to our store. Are you looking for anything specific today, or just browsing around?",
    initialMarathiTranslation: "हॅलो! आमच्या दुकानात आपले स्वागत आहे. तुम्ही आज काही विशिष्ट शोधत आहात की फक्त पाहत आहात?",
    examplePrompts: [
      { english: "Do you have this shirt in a medium size?", marathi: "हा शर्ट तुमच्याकडे मिडीयम साइजमध्ये उपलब्ध आहे का?" },
      { english: "Is there any discount available on this item?", marathi: "या वस्तूवर काही सवलत (डिस्काउंट) उपलब्ध आहे का?" },
      { english: "Where is the trial room?", marathi: "ट्रायल रूम कुठे आहे?" },
    ],
  },
  {
    id: 'travel',
    title: 'Travel & Asking Directions',
    marathiTitle: 'प्रवास आणि रस्ता विचारणे',
    description: 'Ask for train timings, airport check-in, or finding a landmark.',
    marathiDescription: 'स्टेशन, विमानतळ, हॉटेल चेक-इन आणि नवीन शहरात रस्ता शोधणे.',
    icon: 'MapPin',
    initialPrompt: "Hi there! You look like you're exploring the city. Need any help with directions or bus timings?",
    initialMarathiTranslation: "हॅलो! असे वाटते की तुम्ही शहर फिरत आहात. रस्ता किंवा बसच्या वेळेबद्दल काही मदत हवी आहे का?",
    examplePrompts: [
      { english: "Excuse me, which bus goes to Pune railway station?", marathi: "माफ करा, कोणती बस पुणे रेल्वे स्टेशनकडे जाते?" },
      { english: "How far is the metro station from here?", marathi: "येथून मेट्रो स्टेशन किती अंतरावर आहे?" },
      { english: "Can you recommend a good hotel near the airport?", marathi: "विमानतळाजवळ एखादे चांगले हॉटेल सुचवू शकाल का?" },
    ],
  },
  {
    id: 'office_meeting',
    title: 'Office Meetings & Client Calls',
    marathiTitle: 'कार्यालयीन मीटिंग्स आणि क्लायंट कॉल',
    description: 'Give updates, ask polite questions, and explain blockers clearly.',
    marathiDescription: 'प्रकल्पाची स्थिती सांगणे, अडचण स्पष्ट करणे आणि प्रोफेशनल इंग्रजी वापरणे.',
    icon: 'Laptop',
    initialPrompt: "Good morning team! Let's start our quick status sync. Who would like to share their update first?",
    initialMarathiTranslation: "शुभ प्रभात टीम! चला आपली लहान स्टेटस मीटिंग सुरू करूया. प्रथम कोण आपले अपडेट शेअर करू इच्छितो?",
    examplePrompts: [
      { english: "I completed the client report yesterday.", marathi: "मी काल क्लायंटचा अहवाल पूर्ण केला." },
      { english: "I am facing an issue with the database connection.", marathi: "मला डेटाबेस कनेक्शनमध्ये अडचण येत आहे." },
      { english: "Could we reschedule our meeting to 4 PM?", marathi: "आपण आपली बैठक संध्याकाळी ४ वाजता ठेवू शकतो का?" },
    ],
  },
  {
    id: 'doctor_clinic',
    title: 'Doctor Clinic & Health',
    marathiTitle: 'दवाखाना आणि आरोग्य समस्या',
    description: 'Describe symptoms, headache, fever, and ask about dosage.',
    marathiDescription: 'डोकेदुखी, ताप, औषधे घेण्याची वेळ याबद्दल डॉक्टरांशी संवाद.',
    icon: 'HeartPulse',
    initialPrompt: "Hello, please take a seat. Tell me, what symptoms have you been experiencing lately?",
    initialMarathiTranslation: "हॅलो, कृपया बसा. सांगा, तुम्हाला अलीकडे काय त्रास होत आहे?",
    examplePrompts: [
      { english: "I have had a severe headache and fever since yesterday.", marathi: "मला कालपासून तीव्र डोकेदुखी आणि ताप येत आहे." },
      { english: "Should I take this medicine before or after food?", marathi: "मी हे औषध जेवणापूर्वी घ्यावे की जेवणानंतर?" },
      { english: "I am feeling very tired and weak.", marathi: "मला खूप थकवा आणि अशक्तपणा जाणवत आहे." },
    ],
  },
];
