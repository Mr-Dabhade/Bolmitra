import React from 'react';
import { 
  MessageSquare, 
  Stethoscope, 
  BookOpen, 
  Bookmark, 
  Volume2, 
  Sparkles,
  Compass
} from 'lucide-react';
import { SCENARIOS } from '../data/scenarios';
import { ScenarioId } from '../types';

interface HeaderProps {
  activeTab: 'chat' | 'doctor' | 'mistakes' | 'notebook';
  setActiveTab: (tab: 'chat' | 'doctor' | 'mistakes' | 'notebook') => void;
  activeScenarioId: ScenarioId;
  onOpenScenarioModal: () => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeScenarioId,
  onOpenScenarioModal,
  speechRate,
  setSpeechRate,
  savedCount,
}) => {
  const currentScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  बोलमित्र <span className="text-amber-400 text-sm font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">BolMitra</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 marathi-font">
                तुमचा AI इंग्रजी संभाषण मित्र • मराठीत स्पष्टीकरण व चुकांची सुधारणा
              </p>
            </div>
          </div>

          {/* Quick Scenario button on Mobile */}
          <button
            onClick={onOpenScenarioModal}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[100px]">{currentScenario.marathiTitle.split(' ')[0]}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>संभाषण (Chat)</span>
          </button>

          <button
            onClick={() => setActiveTab('doctor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'doctor'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-emerald-400" />
            <span>वाक्य सुधारक (Doctor)</span>
          </button>

          <button
            onClick={() => setActiveTab('mistakes')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'mistakes'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>सामान्य चुका (Common Mistakes)</span>
          </button>

          <button
            onClick={() => setActiveTab('notebook')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'notebook'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Bookmark className="w-4 h-4 text-purple-400" />
            <span>माझी नोंदवही (Notebook)</span>
            {savedCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'notebook' ? 'bg-slate-950 text-amber-300' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}>
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Controls: Scenario Picker & Audio Speed */}
        <div className="hidden md:flex items-center gap-3">
          {/* Active Scenario Selector */}
          <button
            onClick={onOpenScenarioModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-750 text-slate-200 text-xs border border-slate-700/80 hover:border-amber-500/50 transition shadow-sm group"
            title="विषय / प्रसंग बदला (Change Scenario)"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
            <div className="text-left">
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">प्रसंग / Scenario</span>
              <span className="block font-medium truncate max-w-[130px]">{currentScenario.marathiTitle.split(' ')[0]}</span>
            </div>
          </button>

          {/* Voice Speed Toggle */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/80">
            <Volume2 className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <button
              onClick={() => setSpeechRate(speechRate === 0.8 ? 1.0 : 0.8)}
              className="text-[11px] font-medium px-2 py-0.5 rounded text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-700 transition"
              title="आवाजाचा वेग (Speech Speed)"
            >
              {speechRate === 0.8 ? '🐢 0.8x धीमे' : '⚡ 1.0x सामान्य'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
