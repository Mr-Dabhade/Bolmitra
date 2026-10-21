import React, { useState } from 'react';
import { 
  Stethoscope, 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle,
  Award,
  BookOpen,
  Send,
  Loader2
} from 'lucide-react';
import { SentenceDoctorResult, SavedCorrection } from '../types';
import { playEnglishSpeech } from '../utils/speech';

interface SentenceDoctorViewProps {
  speechRate: number;
  onSaveCorrection: (correction: Omit<SavedCorrection, 'id' | 'timestamp'>) => void;
  isSaved: (original: string) => boolean;
}

const SAMPLE_SENTENCES = [
  'I am agree with your plan.',
  "I didn't knew about the exam date.",
  'She is having two cars and big house.',
  'I am living in Pune since three years.',
  'He told to me to come at 5 PM.',
];

export const SentenceDoctorView: React.FC<SentenceDoctorViewProps> = ({
  speechRate,
  onSaveCorrection,
  isSaved,
}) => {
  const [inputSentence, setInputSentence] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SentenceDoctorResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleAnalyze = async (sentenceToAnalyze?: string) => {
    const query = (sentenceToAnalyze || inputSentence).trim();
    if (!query) return;

    if (sentenceToAnalyze) {
      setInputSentence(sentenceToAnalyze);
    }

    setIsLoading(true);
    setError(null);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);

    try {
      const res = await fetch('/api/analyze-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: query }),
      });

      if (!res.ok) {
        throw new Error('Analysis request failed');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error('Error analyzing sentence:', err);
      setError('वाक्य तपासताना अडचण आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = (text: string) => {
    playEnglishSpeech(text, { rate: speechRate });
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-4 space-y-6">
      {/* Title & Introduction */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              वाक्य सुधारक व व्याकरण डॉक्टर <span className="text-sm font-normal text-emerald-400 font-mono">(Grammar Doctor)</span>
            </h2>
            <p className="text-sm text-slate-300 marathi-font mt-0.5">
              कोणतेही इंग्रजी वाक्य इथे टाईप करा किंवा पेस्ट करा. बोलमित्र त्यातील चुका शोधून मराठीत सोपा नियम समजावून सांगेल.
            </p>
          </div>
        </div>

        {/* Input box */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={inputSentence}
              onChange={(e) => setInputSentence(e.target.value)}
              placeholder="उदा. I am having two brothers किंवा I didn't went yesterday..."
              className="w-full bg-slate-950/80 border border-slate-750 focus:border-emerald-500 rounded-xl p-4 text-white placeholder-slate-500 text-sm md:text-base focus:outline-none transition"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Quick samples */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
              <span className="marathi-font">नमुना वाक्ये:</span>
              {SAMPLE_SENTENCES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnalyze(sample)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700/80 transition truncate max-w-[170px]"
                >
                  "{sample}"
                </button>
              ))}
            </div>

            <button
              onClick={() => handleAnalyze()}
              disabled={!inputSentence.trim() || isLoading}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition shadow-lg ${
                inputSentence.trim() && !isLoading
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>तपासत आहे...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>तपासा आणि सुधारा (Analyze)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Result Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Score & Verdict Banner */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold border ${
                  result.score >= 85
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : result.score >= 60
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                }`}
              >
                <span className="text-xl">{result.score}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">/ 100</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">
                    {result.score >= 85
                      ? 'उत्कृष्ट! खूप छान इंग्रजी!'
                      : result.score >= 60
                      ? 'चांगला प्रयत्न, पण सुधारणेची गरज आहे.'
                      : 'व्याकरणात महत्त्वपूर्ण चुका आहेत.'}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 marathi-font mt-0.5">
                  वाक्याचा मराठीत नेमका अर्थ: <span className="text-slate-200">"{result.marathiSentenceMeaning}"</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                result.hasMistakes ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
              }`}>
                {result.hasMistakes ? '⚠️ चुका सापडल्या (Needs Fix)' : '✅ १००% अचूक (Perfect)'}
              </span>
            </div>
          </div>

          {/* Corrected Sentence Hero Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> अचूक व सुधारलेले वाक्य (Corrected English)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSpeak(result.correctedSentence)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs"
                  title="उच्चार ऐका"
                >
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>उच्चार ऐका</span>
                </button>
                <button
                  onClick={() => handleCopy(result.correctedSentence)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs"
                  title="कॉपी करा"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'कॉपी झाले!' : 'कॉपी करा'}</span>
                </button>
              </div>
            </div>

            <p className="text-lg md:text-xl font-bold text-white tracking-wide">
              {result.correctedSentence}
            </p>
          </div>

          {/* Detailed Mistake Breakdown */}
          {result.mistakes && result.mistakes.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider marathi-font flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>चुकांचे मराठीत सविस्तर विश्लेषण (Mistake Breakdown):</span>
              </h4>

              <div className="grid gap-3">
                {result.mistakes.map((mistake, idx) => {
                  const saved = isSaved(mistake.incorrectSnippet);
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="line-through text-rose-400 font-semibold px-2.5 py-1 bg-rose-500/10 rounded-lg">
                            {mistake.incorrectSnippet}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-500" />
                          <span className="text-emerald-400 font-bold px-2.5 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            {mistake.correctSnippet}
                          </span>
                          <span className="text-xs uppercase font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {mistake.ruleCategory}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            onSaveCorrection({
                              original: mistake.incorrectSnippet,
                              corrected: mistake.correctSnippet,
                              marathiExplanation: mistake.explanationInMarathi,
                              category: mistake.ruleCategory,
                            })
                          }
                          className={`text-xs px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                            saved
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : 'bg-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          {saved ? 'नोंदवहीत सेव्ह आहे' : 'नोंदवहीत सेव्ह करा'}
                        </button>
                      </div>

                      <div className="text-sm text-slate-300 marathi-font leading-relaxed">
                        <span className="font-semibold text-amber-400 mr-2">नियम:</span>
                        {mistake.explanationInMarathi}
                      </div>

                      {mistake.tipInMarathi && (
                        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 marathi-font flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
                          <span>टिप: {mistake.tipInMarathi}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Context Variations: Formal, Casual, Native */}
          {result.variations && result.variations.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-slate-300 marathi-font flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>वेगवेगळ्या प्रसंगांनुसार बोलण्याचे पर्याय (Tone Variations):</span>
              </h4>

              <div className="grid sm:grid-cols-3 gap-3">
                {result.variations.map((v, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                      {v.context}
                    </span>
                    <p className="text-sm font-semibold text-white pt-1">{v.sentence}</p>
                    <p className="text-xs text-slate-400 marathi-font">{v.marathiMeaning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Golden Grammar Rule Takeaway */}
          {result.keyGrammarRuleInMarathi && (
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 marathi-font">
                <Award className="w-4 h-4" /> मुख्य व्याकरण नियम (Golden Takeaway Rule):
              </span>
              <p className="text-sm text-indigo-200 marathi-font leading-relaxed">
                {result.keyGrammarRuleInMarathi}
              </p>
            </div>
          )}

          {/* Mini Retention Quiz */}
          {result.quiz && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-white text-base marathi-font">
                  नियम समजला का? त्वरित सराव प्रश्न (Quick Quiz):
                </h4>
              </div>

              <p className="text-sm md:text-base font-semibold text-slate-200 marathi-font bg-slate-850 p-3 rounded-xl border border-slate-800">
                {result.quiz.marathiPrompt}
              </p>

              <div className="grid gap-2">
                {result.quiz.options.map((option, idx) => {
                  let optionStyle = 'bg-slate-850 border-slate-800 hover:border-slate-700 text-slate-300';
                  if (quizSubmitted) {
                    if (idx === result.quiz.correctIndex) {
                      optionStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold';
                    } else if (idx === selectedQuizAnswer) {
                      optionStyle = 'bg-rose-500/20 border-rose-500/50 text-rose-300';
                    }
                  } else if (selectedQuizAnswer === idx) {
                    optionStyle = 'bg-amber-500/20 border-amber-500/50 text-amber-300';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!quizSubmitted) setSelectedQuizAnswer(idx);
                      }}
                      className={`text-left p-3 rounded-xl border transition text-sm flex items-center justify-between ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {quizSubmitted && idx === result.quiz.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={selectedQuizAnswer === null}
                  className={`mt-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    selectedQuizAnswer !== null
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  उत्तर तपासा (Check Answer)
                </button>
              ) : (
                <div className="mt-3 p-3 rounded-xl bg-slate-850 border border-slate-750 text-xs md:text-sm marathi-font text-slate-300">
                  <span className="font-semibold text-amber-400 mr-2">स्पष्टीकरण:</span>
                  {result.quiz.explanationInMarathi}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
