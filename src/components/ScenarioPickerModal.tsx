import React from 'react';
import { 
  X, 
  MessageCircle, 
  Briefcase, 
  Utensils, 
  ShoppingBag, 
  MapPin, 
  Laptop, 
  HeartPulse, 
  Check 
} from 'lucide-react';
import { SCENARIOS } from '../data/scenarios';
import { ScenarioId } from '../types';

interface ScenarioPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedScenarioId: ScenarioId;
  onSelectScenario: (id: ScenarioId) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  MessageCircle: <MessageCircle className="w-5 h-5 text-amber-400" />,
  Briefcase: <Briefcase className="w-5 h-5 text-blue-400" />,
  Utensils: <Utensils className="w-5 h-5 text-emerald-400" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5 text-pink-400" />,
  MapPin: <MapPin className="w-5 h-5 text-orange-400" />,
  Laptop: <Laptop className="w-5 h-5 text-indigo-400" />,
  HeartPulse: <HeartPulse className="w-5 h-5 text-rose-400" />,
};

export const ScenarioPickerModal: React.FC<ScenarioPickerModalProps> = ({
  isOpen,
  onClose,
  selectedScenarioId,
  onSelectScenario,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              संभाषणाचा प्रसंग निवडा <span className="text-xs font-normal text-slate-400">(Choose Scenario)</span>
            </h3>
            <p className="text-xs text-slate-400 marathi-font">
              तुम्हाला ज्या प्रसंगात बोलायचा सराव करायचा आहे तो विषय निवडा
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {SCENARIOS.map((scenario) => {
            const isSelected = scenario.id === selectedScenarioId;
            return (
              <div
                key={scenario.id}
                onClick={() => {
                  onSelectScenario(scenario.id);
                  onClose();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/5'
                    : 'bg-slate-850/60 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`p-3 rounded-xl border ${
                  isSelected ? 'bg-amber-500/20 border-amber-500/40' : 'bg-slate-800 border-slate-700'
                }`}>
                  {ICON_MAP[scenario.icon] || <MessageCircle className="w-5 h-5 text-amber-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-white text-sm md:text-base flex items-center gap-2">
                      <span>{scenario.marathiTitle}</span>
                      <span className="text-xs font-normal text-slate-400">({scenario.title})</span>
                    </h4>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-xs text-amber-400 font-medium bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                        <Check className="w-3 h-3" /> सक्रिय (Active)
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 marathi-font mt-1">
                    {scenario.marathiDescription}
                  </p>

                  <div className="mt-2 text-[11px] text-slate-400 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80 font-mono">
                    <span className="text-amber-400 font-semibold mr-1">Partner intro:</span>
                    "{scenario.initialPrompt}"
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-200 transition"
          >
            बंद करा (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
