import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertTriangle, 
  Languages, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck,
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ArrowRight,
  SendHorizontal
} from 'lucide-react';
import { ChatMessage, SavedCorrection } from '../types';
import { playEnglishSpeech, stopSpeech } from '../utils/speech';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  speechRate: number;
  onSelectSuggestion?: (replyText: string) => void;
  onSaveCorrection?: (correction: Omit<SavedCorrection, 'id' | 'timestamp'>) => void;
  isSaved?: (original: string) => boolean;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  speechRate,
  onSelectSuggestion,
  onSaveCorrection,
  isSaved,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMarathiTranslation, setShowMarathiTranslation] = useState(true);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleToggleSpeech = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      const textToSpeak = message.englishReply || message.content || '';
      playEnglishSpeech(textToSpeak, {
        rate: speechRate,
        onStart: () => setIsPlaying(true),
        onEnd: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });
    }
  };

  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-4 animate-in fade-in duration-200">
        <div className="max-w-[85%] md:max-w-[70%]">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium px-4 py-3 rounded-2xl rounded-tr-none shadow-md">
            <p className="text-sm md:text-base leading-relaxed selection:bg-slate-900 selection:text-white">
              {message.content}
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 mt-1 text-[11px] text-slate-500 px-1">
            <span>तुम्ही बोललात (You)</span>
            <span>•</span>
            <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    );
  }

  // Model response
  return (
    <div className="flex flex-col gap-3 mb-6 animate-in fade-in duration-300">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header bar of the response */}
        <div className="px-4 py-2.5 bg-slate-850/80 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30">
              म
            </div>
            <span className="text-xs font-semibold text-slate-300">बोलमित्र (English Partner)</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Play Audio Button */}
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                isPlaying
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
              }`}
              title="उच्चार ऐका (Listen to pronunciation)"
            >
              {isPlaying ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                  <span>थांबवा (Stop)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>ऐका (Listen)</span>
                </>
              )}
            </button>

            {/* Toggle Marathi Translation Button */}
            <button
              onClick={() => setShowMarathiTranslation(!showMarathiTranslation)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                showMarathiTranslation
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="मराठी भाषांतर दाखवा/लपवा"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>मराठी {showMarathiTranslation ? 'लपवा' : 'पहा'}</span>
            </button>
          </div>
        </div>

        {/* English Reply Content */}
        <div className="p-4 md:p-5">
          <div className="text-slate-100 text-base md:text-lg font-medium leading-relaxed tracking-wide">
            {message.englishReply}
          </div>

          {/* Marathi Translation Box */}
          {showMarathiTranslation && message.marathiTranslation && (
            <div className="mt-3.5 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/15 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1 marathi-font">
                <Languages className="w-3.5 h-3.5" />
                <span>मराठीत अर्थ (Meaning in Marathi):</span>
              </div>
              <p className="text-sm md:text-base text-slate-300 marathi-font leading-relaxed">
                {message.marathiTranslation}
              </p>
            </div>
          )}

          {/* Real-Time Grammatical Mistakes & Corrections Section */}
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            {message.hasMistakes ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-rose-500/20 text-rose-400">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                      व्याकरणाच्या चुका आणि दुरुस्ती (Grammar Corrections)
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-400/90 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                    {message.corrections?.length || 1} सुधारणा
                  </span>
                </div>

                {/* Corrected full sentence display */}
                {message.correctedSentence && (
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-700/80 flex items-start justify-between gap-3">
                    <div>
                      <span className="block text-[11px] font-semibold text-emerald-400 marathi-font mb-0.5">
                        अचूक वाक्य (Corrected English):
                      </span>
                      <p className="text-sm md:text-base font-semibold text-emerald-300">
                        {message.correctedSentence}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(message.correctedSentence || '')}
                      className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1 text-xs"
                      title="वाक्य कॉपी करा"
                    >
                      {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {/* Detailed mistake breakdowns */}
                {message.corrections && message.corrections.length > 0 && (
                  <div className="space-y-2.5 mt-2">
                    {message.corrections.map((corr, idx) => {
                      const saved = isSaved ? isSaved(corr.originalSnippet) : false;
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-2 text-xs md:text-sm"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="line-through text-rose-400 font-medium px-2 py-0.5 bg-rose-500/10 rounded">
                                {corr.originalSnippet}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                                {corr.correctedSnippet}
                              </span>
                              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                                {corr.type}
                              </span>
                            </div>

                            {onSaveCorrection && (
                              <button
                                onClick={() =>
                                  onSaveCorrection({
                                    original: corr.originalSnippet,
                                    corrected: corr.correctedSnippet,
                                    marathiExplanation: corr.marathiExplanation,
                                    category: corr.type,
                                  })
                                }
                                className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded transition ${
                                  saved
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                    : 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700'
                                }`}
                                title="पुन्हा सरावासाठी नोंदवहीत ठेवा"
                              >
                                {saved ? (
                                  <>
                                    <BookmarkCheck className="w-3 h-3 text-purple-400" />
                                    <span>नोंदवहीत सेव्ह आहे</span>
                                  </>
                                ) : (
                                  <>
                                    <Bookmark className="w-3 h-3 text-slate-400" />
                                    <span>नोंदवहीत ठेवा</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          {/* Marathi Explanation */}
                          <div className="text-slate-300 marathi-font leading-relaxed pt-1 border-t border-slate-800/50">
                            <span className="font-semibold text-amber-400 mr-1.5">नियम व कारण:</span>
                            {corr.marathiExplanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs md:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="marathi-font font-medium">
                  अतिशय छान! तुमचे वाक्य पूर्णपणे बरोबर आहे — एकही व्याकरणाची चूक नाही! (100% Accurate English!)
                </span>
              </div>
            )}
          </div>

          {/* Better Alternatives & Pronunciation Guide Collapsible */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {message.betterAlternatives && message.betterAlternatives.length > 0 && (
              <button
                onClick={() => setShowAlternatives(!showAlternatives)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/60 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>अजून चांगल्या प्रकारे कसे बोलावे? ({message.betterAlternatives.length})</span>
                {showAlternatives ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* Better Alternatives Expanded */}
          {showAlternatives && message.betterAlternatives && (
            <div className="mt-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 animate-in fade-in duration-200">
              <span className="block text-xs font-semibold text-amber-400 marathi-font">
                अधिक प्रभावी आणि नैसर्गिक पर्याय (Natural Alternatives):
              </span>
              <div className="grid gap-2">
                {message.betterAlternatives.map((alt, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs md:text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-white">{alt.english}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        {alt.tone}
                      </span>
                    </div>
                    <div className="text-slate-400 marathi-font mt-1 text-xs">
                      {alt.marathi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pronunciation Guide */}
          {message.marathiPronunciationGuide && message.marathiPronunciationGuide.length > 0 && (
            <div className="mt-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <span className="block text-[11px] font-semibold text-indigo-400 marathi-font mb-1.5">
                कठीण शब्दांचे उच्चार (Pronunciation in Marathi):
              </span>
              <div className="flex flex-wrap gap-2">
                {message.marathiPronunciationGuide.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/80 text-xs"
                  >
                    <span className="font-semibold text-white">{item.word}</span>
                    <span className="text-amber-400 font-mono text-[11px]">[{item.marathiPhonetic}]</span>
                    <span className="text-slate-400 marathi-font text-[11px]">({item.meaning})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Suggested Next Replies Footer */}
        {message.suggestedNextReplies && message.suggestedNextReplies.length > 0 && onSelectSuggestion && (
          <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800/80">
            <span className="block text-[11px] font-semibold text-slate-400 marathi-font mb-2">
              पुढे काय बोलावे? (Suggested quick replies — क्लिक करून उत्तर द्या):
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              {message.suggestedNextReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSuggestion(reply.english)}
                  className="flex-1 text-left p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-amber-500/40 transition group"
                >
                  <div className="flex items-center justify-between gap-1 text-xs md:text-sm font-medium text-slate-200 group-hover:text-amber-300">
                    <span>{reply.english}</span>
                    <SendHorizontal className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-amber-400 flex-shrink-0" />
                  </div>
                  <div className="text-[11px] text-slate-400 marathi-font mt-0.5 line-clamp-1">
                    {reply.marathi}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
