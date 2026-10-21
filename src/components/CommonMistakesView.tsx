import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowRight, 
  Volume2, 
  Sparkles, 
  MessageSquare, 
  Bookmark, 
  BookmarkCheck,
  Search,
  Filter
} from 'lucide-react';
import { COMMON_MISTAKES, CommonMistake } from '../data/commonMistakes';
import { SavedCorrection } from '../types';
import { playEnglishSpeech } from '../utils/speech';

interface CommonMistakesViewProps {
  speechRate: number;
  onPracticeInChat: (practiceText: string) => void;
  onSaveCorrection: (correction: Omit<SavedCorrection, 'id' | 'timestamp'>) => void;
  isSaved: (original: string) => boolean;
}

export const CommonMistakesView: React.FC<CommonMistakesViewProps> = ({
  speechRate,
  onPracticeInChat,
  onSaveCorrection,
  isSaved,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'सर्व चुका (All)' },
    { id: 'literal_translation', label: 'थेट भाषांतर (Literal Translation)' },
    { id: 'tenses', label: 'काळ व रूपे (Tenses)' },
    { id: 'prepositions', label: 'प्रिपोझिशन्स (Prepositions)' },
    { id: 'daily_habit', label: 'दैनंदिन सवयी (Daily Life)' },
    { id: 'vocabulary', label: 'शब्दसंग्रह (Vocabulary)' },
  ];

  const filteredMistakes = COMMON_MISTAKES.filter((m) => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      m.incorrect.toLowerCase().includes(query) ||
      m.correct.toLowerCase().includes(query) ||
      m.marathiExplanation.toLowerCase().includes(query) ||
      m.literalTrapMarathi.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const handleSpeak = (text: string) => {
    playEnglishSpeech(text, { rate: speechRate });
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-4 space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              मराठी भाषिकांच्या सर्वात सामान्य चुका <span className="text-sm font-normal text-blue-400 font-mono">(Common Marathi-English Traps)</span>
            </h2>
            <p className="text-sm text-slate-300 marathi-font mt-0.5">
              मराठीतून इंग्रजीत विचार करताना होणाऱ्या ठराविक चुका समजून घ्या आणि आपले इंग्रजी १००% अस्खलित बनवा.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="चूक किंवा शब्द शोधा (उदा. agree, didn't, married, fan)..."
              className="w-full bg-slate-950/80 border border-slate-750 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-blue-500 text-slate-950 font-bold shadow-md shadow-blue-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mistakes Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredMistakes.map((mistake) => {
          const saved = isSaved(mistake.incorrect);

          return (
            <div
              key={mistake.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between gap-4 hover:border-slate-700 transition"
            >
              <div className="space-y-3">
                {/* Category & Save */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 marathi-font">
                    {mistake.categoryMarathi}
                  </span>
                  <button
                    onClick={() =>
                      onSaveCorrection({
                        original: mistake.incorrect,
                        corrected: mistake.correct,
                        marathiExplanation: mistake.marathiExplanation,
                        category: mistake.category,
                      })
                    }
                    className={`p-1.5 rounded-lg text-xs transition ${
                      saved
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="नोंदवहीत सेव्ह करा"
                  >
                    {saved ? <BookmarkCheck className="w-4 h-4 text-purple-400" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                {/* Incorrect vs Correct */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20">
                    <span className="text-xs font-bold text-rose-400 mt-0.5">❌</span>
                    <span className="text-sm font-medium text-rose-300 line-through">
                      {mistake.incorrect}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold text-emerald-400 mt-0.5">✅</span>
                      <span className="text-sm font-bold text-emerald-300">
                        {mistake.correct}
                      </span>
                    </div>
                    <button
                      onClick={() => handleSpeak(mistake.correct)}
                      className="p-1 rounded text-slate-400 hover:text-white transition flex-shrink-0"
                      title="उच्चार ऐका"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>
                </div>

                {/* Literal trap badge */}
                <div className="text-xs font-semibold text-amber-400/90 bg-amber-400/10 p-2 rounded-lg border border-amber-400/20 marathi-font">
                  {mistake.literalTrapMarathi}
                </div>

                {/* Marathi explanation */}
                <p className="text-xs sm:text-sm text-slate-300 marathi-font leading-relaxed">
                  {mistake.marathiExplanation}
                </p>

                {/* Example in a sentence */}
                <div className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 font-semibold uppercase mr-1">उदा:</span>
                  <span className="text-slate-200 font-medium">"{mistake.exampleInSentence}"</span>
                </div>
              </div>

              {/* Action Button: Practice in Chat */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onPracticeInChat(mistake.practicePrompt)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-950 font-semibold text-xs transition group"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400 group-hover:text-slate-950" />
                  <span className="marathi-font">संभाषणात याचा सराव करा (Practice in Chat)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
