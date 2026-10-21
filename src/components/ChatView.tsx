import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  RotateCcw, 
  Compass, 
  Sparkles, 
  Loader2, 
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { ChatMessage, ScenarioId, SavedCorrection } from '../types';
import { SCENARIOS } from '../data/scenarios';
import { ChatMessageBubble } from './ChatMessageBubble';
import { createSpeechRecognizer, SpeechRecognitionController } from '../utils/speech';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  activeScenarioId: ScenarioId;
  onOpenScenarioModal: () => void;
  onResetChat: () => void;
  speechRate: number;
  onSaveCorrection: (correction: Omit<SavedCorrection, 'id' | 'timestamp'>) => void;
  isSaved: (original: string) => boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  activeScenarioId,
  onOpenScenarioModal,
  onResetChat,
  speechRate,
  onSaveCorrection,
  isSaved,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [micError, setMicError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognizerRef = useRef<SpeechRecognitionController | null>(null);

  const scenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Initialize Speech Recognition
  useEffect(() => {
    const recognizer = createSpeechRecognizer({
      onResult: (transcript, isFinal) => {
        setInputText(transcript);
        if (isFinal) {
          // Keep transcript in text field
        }
      },
      onError: (err) => {
        console.warn('Speech recognition error:', err);
        setMicError('मायक्रोफोन ॲक्सेस अयशस्वी किंवा बोलणे ऐकू आले नाही.');
        setIsListening(false);
        setTimeout(() => setMicError(null), 4000);
      },
      onStateChange: (listening) => {
        setIsListening(listening);
      },
    });

    recognizerRef.current = recognizer;
    setSpeechSupported(recognizer.isSupported);

    return () => {
      recognizer.stop();
    };
  }, []);

  const handleToggleListening = () => {
    if (!recognizerRef.current || !speechSupported) {
      alert('तुमच्या ब्राउझरमध्ये व्हॉइस स्पीच रेकग्निशन समर्थित नाही. कृपया क्रोम किंवा एज वापरा.');
      return;
    }

    if (isListening) {
      recognizerRef.current.stop();
    } else {
      setMicError(null);
      recognizerRef.current.start();
    }
  };

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;

    if (isListening && recognizerRef.current) {
      recognizerRef.current.stop();
    }

    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await onSendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectExample = (exampleText: string) => {
    setInputText(exampleText);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-5xl mx-auto w-full px-2 sm:px-4">
      {/* Scenario Context Bar */}
      <div className="py-2.5 px-4 mb-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="truncate">
            <span className="text-slate-400 font-medium marathi-font">सध्याचा प्रसंग: </span>
            <span className="text-amber-400 font-semibold">{scenario.marathiTitle}</span>
            <span className="text-slate-500 ml-1.5 hidden sm:inline">({scenario.title})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onOpenScenarioModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="marathi-font">प्रसंग बदला</span>
          </button>

          <button
            onClick={onResetChat}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition"
            title="संभाषण नव्याने सुरू करा"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline marathi-font">नवे सुरू करा</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-1 sm:px-2 py-2 space-y-4">
        {messages.map((msg) => (
          <ChatMessageBubble
            key={msg.id}
            message={msg}
            speechRate={speechRate}
            onSelectSuggestion={(reply) => {
              setInputText(reply);
              textareaRef.current?.focus();
            }}
            onSaveCorrection={onSaveCorrection}
            isSaved={isSaved}
          />
        ))}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  बोलमित्र उत्तर तयार करत आहे...
                </p>
                <p className="text-xs text-slate-400 marathi-font">
                  व्याकरण तपासणे, मराठी स्पष्टीकरण आणि ऑडिओ तयार होत आहे
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Example Starters if only 1 message exists */}
        {messages.length <= 1 && !isLoading && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 marathi-font">
              <Sparkles className="w-4 h-4" />
              <span>सुरुवात करण्यासाठी हे वाक्य वापरून पहा (Try these sentences):</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-2.5">
              {scenario.examplePrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectExample(item.english)}
                  className="text-left p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-amber-500/50 transition group"
                >
                  <p className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-amber-300">
                    "{item.english}"
                  </p>
                  <p className="text-[11px] text-slate-400 marathi-font mt-1 line-clamp-1">
                    {item.marathi}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Mic Status Banner */}
      {isListening && (
        <div className="py-1.5 px-3 mb-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span className="font-semibold marathi-font">मायक्रोफोन चालू आहे... इंग्रजीत बोला (Listening...)</span>
          </div>
          <button
            onClick={handleToggleListening}
            className="text-[11px] font-bold underline hover:text-white"
          >
            थांबवा (Done)
          </button>
        </div>
      )}

      {micError && (
        <div className="py-1.5 px-3 mb-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs marathi-font">
          {micError}
        </div>
      )}

      {/* Input Bar Area */}
      <div className="py-3 flex-shrink-0">
        <div className="relative bg-slate-900 border border-slate-750 focus-within:border-amber-500/80 rounded-2xl shadow-2xl p-2 transition-all">
          <div className="flex items-end gap-2">
            {/* Mic Button */}
            <button
              onClick={handleToggleListening}
              className={`p-3 rounded-xl transition flex-shrink-0 relative ${
                isListening
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-amber-400 border border-slate-700'
              }`}
              title={isListening ? 'मायक्रोफोन बंद करा' : 'मायक्रोफोनने इंग्रजीत बोला (Speak in English)'}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5 animate-bounce" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-400 rounded-full animate-ping" />
                </>
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type in English (or speak via mic)... चुकीचे बोललात तरी चालेल, बोलमित्र सुधारेल!"
              className="flex-1 max-h-32 bg-transparent text-white placeholder-slate-500 text-sm md:text-base focus:outline-none resize-none py-2 px-1"
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className={`p-3 rounded-xl transition flex-shrink-0 ${
                inputText.trim() && !isLoading
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
              title="पाठवा (Send)"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Motivational Tip below Input */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-2 marathi-font">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500/70" />
            <span>टिप: मनात इंग्रजी वाक्य बोला, व्याकरण चुकले तरी काळजी करू नका, बोलमित्र अचूक नियम शिकवेल.</span>
          </div>
          <span className="hidden sm:inline">Enter = पाठवा • Shift+Enter = नवी ओळ</span>
        </div>
      </div>
    </div>
  );
};
