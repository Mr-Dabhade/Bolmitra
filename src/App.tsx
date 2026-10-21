import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { SentenceDoctorView } from './components/SentenceDoctorView';
import { CommonMistakesView } from './components/CommonMistakesView';
import { NotebookView } from './components/NotebookView';
import { ScenarioPickerModal } from './components/ScenarioPickerModal';
import { ChatMessage, ScenarioId, SavedCorrection } from './types';
import { SCENARIOS } from './data/scenarios';

const STORAGE_KEY = 'bolmitra_saved_corrections';

const INITIAL_SAVED: SavedCorrection[] = [
  {
    id: 'seed-1',
    timestamp: Date.now() - 3600000,
    original: 'I am agree with you',
    corrected: 'I agree with you',
    marathiExplanation: "मराठीत 'मी सहमत आहे' बोलतात म्हणून 'am' जोडले जाते, पण इंग्रजीत 'agree' स्वतःच क्रियापद आहे. त्यामुळे फक्त 'I agree' म्हणावे.",
    category: 'grammar',
    mastered: false,
  },
  {
    id: 'seed-2',
    timestamp: Date.now() - 7200000,
    original: "I didn't knew about this",
    corrected: "I didn't know about this",
    marathiExplanation: "'Didn't' स्वतःच भूतकाळ दर्शवतो. त्यामुळे त्यापुढील मुख्य क्रियापद नेहमी पहिल्या रूपात (V1 - know) असावे.",
    category: 'tenses',
    mastered: true,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'doctor' | 'mistakes' | 'notebook'>('chat');
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>('casual');
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState(false);

  // Saved corrections state
  const [savedCorrections, setSavedCorrections] = useState<SavedCorrection[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_SAVED;
    } catch {
      return INITIAL_SAVED;
    }
  });

  // Save to localStorage whenever savedCorrections changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCorrections));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [savedCorrections]);

  // Active scenario
  const currentScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  // Chat messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'model',
      timestamp: Date.now(),
      englishReply: currentScenario.initialPrompt,
      marathiTranslation: currentScenario.initialMarathiTranslation,
      hasMistakes: false,
      suggestedNextReplies: currentScenario.examplePrompts.slice(0, 3).map((p) => ({
        english: p.english,
        marathi: p.marathi,
      })),
    },
  ]);

  // When scenario changes, reset welcome prompt
  const handleSelectScenario = (newScenarioId: ScenarioId) => {
    setActiveScenarioId(newScenarioId);
    const newScenario = SCENARIOS.find((s) => s.id === newScenarioId) || SCENARIOS[0];
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        timestamp: Date.now(),
        englishReply: newScenario.initialPrompt,
        marathiTranslation: newScenario.initialMarathiTranslation,
        hasMistakes: false,
        suggestedNextReplies: newScenario.examplePrompts.slice(0, 3).map((p) => ({
          english: p.english,
          marathi: p.marathi,
        })),
      },
    ]);
  };

  const handleResetChat = () => {
    const sc = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        timestamp: Date.now(),
        englishReply: sc.initialPrompt,
        marathiTranslation: sc.initialMarathiTranslation,
        hasMistakes: false,
        suggestedNextReplies: sc.examplePrompts.slice(0, 3).map((p) => ({
          english: p.english,
          marathi: p.marathi,
        })),
      },
    ]);
  };

  // Send message to Gemini server endpoint
  const handleSendMessage = async (userText: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          scenario: activeScenarioId,
          history: messages.slice(-6),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        timestamp: Date.now(),
        englishReply: data.englishReply,
        marathiTranslation: data.marathiTranslation,
        hasMistakes: data.hasMistakes,
        correctedSentence: data.correctedSentence,
        corrections: data.corrections || [],
        betterAlternatives: data.betterAlternatives || [],
        marathiPronunciationGuide: data.marathiPronunciationGuide || [],
        suggestedNextReplies: data.suggestedNextReplies || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Error sending message:', err);
      // Fallback message with friendly apology in English + Marathi
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        timestamp: Date.now(),
        englishReply: "I'm sorry, I had a brief connection glitch. Could you please say that again?",
        marathiTranslation: "माफ करा, इंटरनेट किंवा कनेक्शनमध्ये अडचण आली. कृपया पुन्हा एकदा बोलाल का?",
        hasMistakes: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Saved corrections helpers
  const handleSaveCorrection = (item: Omit<SavedCorrection, 'id' | 'timestamp'>) => {
    // Avoid duplicate originals
    if (savedCorrections.some((c) => c.original.toLowerCase() === item.original.toLowerCase())) {
      return;
    }
    const newEntry: SavedCorrection = {
      ...item,
      id: `saved-${Date.now()}`,
      timestamp: Date.now(),
      mastered: false,
    };
    setSavedCorrections((prev) => [newEntry, ...prev]);
  };

  const isSaved = (originalSnippet: string) => {
    return savedCorrections.some(
      (c) => c.original.toLowerCase().trim() === originalSnippet.toLowerCase().trim()
    );
  };

  const handleToggleMastered = (id: string) => {
    setSavedCorrections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, mastered: !c.mastered } : c))
    );
  };

  const handleRemoveCorrection = (id: string) => {
    setSavedCorrections((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClearAllNotebook = () => {
    if (window.confirm('नोंदवहीतील सर्व चुका काढून टाकायच्या आहेत का?')) {
      setSavedCorrections([]);
    }
  };

  const handlePracticeInChat = (text: string) => {
    setActiveTab('chat');
    handleSendMessage(text);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeScenarioId={activeScenarioId}
        onOpenScenarioModal={() => setIsScenarioModalOpen(true)}
        speechRate={speechRate}
        setSpeechRate={setSpeechRate}
        savedCount={savedCorrections.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'chat' && (
          <ChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            activeScenarioId={activeScenarioId}
            onOpenScenarioModal={() => setIsScenarioModalOpen(true)}
            onResetChat={handleResetChat}
            speechRate={speechRate}
            onSaveCorrection={handleSaveCorrection}
            isSaved={isSaved}
          />
        )}

        {activeTab === 'doctor' && (
          <SentenceDoctorView
            speechRate={speechRate}
            onSaveCorrection={handleSaveCorrection}
            isSaved={isSaved}
          />
        )}

        {activeTab === 'mistakes' && (
          <CommonMistakesView
            speechRate={speechRate}
            onPracticeInChat={handlePracticeInChat}
            onSaveCorrection={handleSaveCorrection}
            isSaved={isSaved}
          />
        )}

        {activeTab === 'notebook' && (
          <NotebookView
            savedCorrections={savedCorrections}
            onToggleMastered={handleToggleMastered}
            onRemoveCorrection={handleRemoveCorrection}
            onClearAll={handleClearAllNotebook}
            onPracticeInChat={handlePracticeInChat}
            speechRate={speechRate}
          />
        )}
      </main>

      {/* Scenario Selection Modal */}
      <ScenarioPickerModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        selectedScenarioId={activeScenarioId}
        onSelectScenario={handleSelectScenario}
      />
    </div>
  );
}
