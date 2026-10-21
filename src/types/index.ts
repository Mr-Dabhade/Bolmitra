export type ScenarioId = 
  | 'casual' 
  | 'job_interview' 
  | 'restaurant' 
  | 'shopping' 
  | 'travel' 
  | 'office_meeting' 
  | 'doctor_clinic';

export interface CorrectionItem {
  originalSnippet: string;
  correctedSnippet: string;
  type: string;
  marathiExplanation: string;
}

export interface BetterAlternative {
  tone: string;
  english: string;
  marathi: string;
}

export interface PronunciationItem {
  word: string;
  marathiPhonetic: string;
  meaning: string;
}

export interface SuggestedReply {
  english: string;
  marathi: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content?: string; // user message text
  timestamp: number;
  englishReply?: string; // AI partner's conversational response
  marathiTranslation?: string; // Marathi translation of the AI response
  hasMistakes?: boolean;
  correctedSentence?: string;
  corrections?: CorrectionItem[];
  betterAlternatives?: BetterAlternative[];
  marathiPronunciationGuide?: PronunciationItem[];
  suggestedNextReplies?: SuggestedReply[];
  audioBase64?: string;
}

export interface SentenceDoctorResult {
  score: number;
  hasMistakes: boolean;
  originalSentence: string;
  correctedSentence: string;
  marathiSentenceMeaning: string;
  mistakes: {
    incorrectSnippet: string;
    correctSnippet: string;
    ruleCategory: string;
    explanationInMarathi: string;
    tipInMarathi: string;
  }[];
  variations: {
    context: string;
    sentence: string;
    marathiMeaning: string;
  }[];
  keyGrammarRuleInMarathi: string;
  quiz: {
    marathiPrompt: string;
    options: string[];
    correctIndex: number;
    explanationInMarathi: string;
  };
}

export interface SavedCorrection {
  id: string;
  timestamp: number;
  original: string;
  corrected: string;
  marathiExplanation: string;
  category: string;
  mastered?: boolean;
}
