import React, { useState } from 'react';
import { 
  Bookmark, 
  Trash2, 
  CheckCircle, 
  CheckCircle2, 
  Circle, 
  Volume2, 
  ArrowRight, 
  MessageSquare,
  Sparkles,
  Trophy
} from 'lucide-react';
import { SavedCorrection } from '../types';
import { playEnglishSpeech } from '../utils/speech';

interface NotebookViewProps {
  savedCorrections: SavedCorrection[];
  onToggleMastered: (id: string) => void;
  onRemoveCorrection: (id: string) => void;
  onClearAll: () => void;
  onPracticeInChat: (text: string) => void;
  speechRate: number;
}

export const NotebookView: React.FC<NotebookViewProps> = ({
  savedCorrections,
  onToggleMastered,
  onRemoveCorrection,
  onClearAll,
  onPracticeInChat,
  speechRate,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'mastered'>('all');

  const masteredCount = savedCorrections.filter((c) => c.mastered).length;
  const pendingCount = savedCorrections.length - masteredCount;
  const masteryPercentage = savedCorrections.length > 0
    ? Math.round((masteredCount / savedCorrections.length) * 100)
    : 0;

  const filteredItems = savedCorrections.filter((item) => {
    if (filter === 'pending') return !item.mastered;
    if (filter === 'mastered') return item.mastered;
    return true;
  });

  const handleSpeak = (text: string) => {
    playEnglishSpeech(text, { rate: speechRate });
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-4 space-y-6">
      {/* Header and Progress Card */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                माझी चुकांची नोंदवही <span className="text-sm font-normal text-purple-400 font-mono">(My Mistakes Notebook)</span>
              </h2>
              <p className="text-sm text-slate-300 marathi-font mt-0.5">
                संभाषणात झालेल्या चुका इथे सेव्ह राहतात. त्यांचा पुन्हा पुन्हा सराव करा आणि इंग्रजीत प्रभुत्व मिळवा!
              </p>
            </div>
          </div>

          {savedCorrections.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 self-start sm:self-auto px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>सर्व काढून टाका</span>
            </button>
          )}
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-purple-500/20">
          <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 text-center">
            <span className="block text-xl font-bold text-white">{savedCorrections.length}</span>
            <span className="block text-[11px] text-slate-400 marathi-font">एकूण सेव्हड चुका</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 text-center">
            <span className="block text-xl font-bold text-amber-400">{pendingCount}</span>
            <span className="block text-[11px] text-slate-400 marathi-font">सराव बाकी</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-xl font-bold text-emerald-400">
              <Trophy className="w-4 h-4" />
              <span>{masteredCount} ({masteryPercentage}%)</span>
            </div>
            <span className="block text-[11px] text-slate-400 marathi-font">मास्टर केले</span>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            सर्व ({savedCorrections.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'pending'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            सराव बाकी ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('mastered')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'mastered'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            मास्टर केले ({masteredCount})
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-500">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white marathi-font">
            नोंदवहीत अद्याप कोणतीही नोंद नाही
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto marathi-font">
            संभाषण करताना किंवा वाक्य तपासताना येणाऱ्या चुका 'नोंदवहीत ठेवा' बटण दाबून येथे सेव्ह करा जेणेकरून नंतर त्यांचा अभ्यास करता येईल.
          </p>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition ${
              item.mastered
                ? 'bg-slate-900/60 border-emerald-500/30'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleMastered(item.id)}
                  className="mt-1 text-slate-500 hover:text-emerald-400 transition flex-shrink-0"
                  title={item.mastered ? 'अपूर्ण म्हणून चिन्हांकित करा' : 'मास्टर केले म्हणून टिक करा'}
                >
                  {item.mastered ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="line-through text-rose-400 font-medium px-2 py-0.5 bg-rose-500/10 rounded text-xs md:text-sm">
                      {item.original}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 rounded text-xs md:text-sm">
                      {item.corrected}
                    </span>
                    <button
                      onClick={() => handleSpeak(item.corrected)}
                      className="p-1 rounded text-slate-400 hover:text-white transition"
                      title="उच्चार ऐका"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>

                  <p className="text-xs md:text-sm text-slate-300 marathi-font leading-relaxed">
                    <span className="font-semibold text-amber-400 mr-1.5">नियम:</span>
                    {item.marathiExplanation}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => onPracticeInChat(`I want to practice using: "${item.corrected}"`)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-950 text-xs font-medium transition flex items-center gap-1.5"
                  title="याचा चॅटमध्ये सराव करा"
                >
                  <MessageSquare className="w-3 h-3 text-amber-400" />
                  <span className="marathi-font">सराव करा</span>
                </button>

                <button
                  onClick={() => onRemoveCorrection(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                  title="काढून टाका"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
