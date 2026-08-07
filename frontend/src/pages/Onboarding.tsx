import { useState } from 'react';
import { user as userApi } from '../api/client';
import { useApp } from '../context/AppContext';
import { TriggerType, TRIGGER_LABELS, TRIGGER_EMOJI } from '../types';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

const TRIGGERS: TriggerType[] = ['BOREDOM', 'ANXIETY', 'HABIT', 'FOMO', 'LONELINESS', 'OTHER'];

const HABITS = [
  'Take 5 deep breaths', 'Do 10 push-ups', 'Drink a glass of water',
  'Step outside for 2 min', 'Stretch', 'Write one sentence in a journal',
  'Call or text a friend', 'Read a book', 'Do a quick doodle',
];

export default function Onboarding() {
  const { refresh } = useApp();
  const [step, setStep] = useState(0);
  const [selectedTriggers, setSelectedTriggers] = useState<TriggerType[]>([]);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [intentions, setIntentions] = useState(['', '']);
  const [saving, setSaving] = useState(false);

  const toggleTrigger = (t: TriggerType) =>
    setSelectedTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const toggleHabit = (h: string) =>
    setSelectedHabits(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await userApi.setup({
        triggers: selectedTriggers,
        replacementHabits: selectedHabits,
        ifThenIntentions: intentions.filter(Boolean),
      });
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col px-5 pt-12 pb-8">
      {/* Step indicator */}
      <div className="flex gap-2 mb-8">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-green-400' : 'bg-slate-700'}`} />
        ))}
      </div>

      {step === 0 && (
        <div className="flex-1 flex flex-col">
          <h1 className="text-2xl font-bold text-slate-100 mb-1">What pulls you in?</h1>
          <p className="text-slate-400 text-sm mb-6">Pick your top triggers — the feelings that usually make you reach for your phone.</p>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {TRIGGERS.map(t => (
              <button
                key={t}
                onClick={() => toggleTrigger(t)}
                className={`card flex items-center gap-3 transition-all active:scale-95 ${
                  selectedTriggers.includes(t)
                    ? 'border-green-500 bg-green-900/30'
                    : ''
                }`}
              >
                <span className="text-2xl">{TRIGGER_EMOJI[t]}</span>
                <span className="font-medium text-sm">{TRIGGER_LABELS[t]}</span>
                {selectedTriggers.includes(t) && <Check size={14} className="ml-auto text-green-400" />}
              </button>
            ))}
          </div>
          <button
            className="btn-primary mt-6"
            disabled={selectedTriggers.length === 0}
            onClick={() => setStep(1)}
          >
            Next <ArrowRight size={16} className="inline ml-1" />
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="flex-1 flex flex-col">
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Your escape hatches</h1>
          <p className="text-slate-400 text-sm mb-6">Pick 3–5 things to do instead of scrolling. Be honest — would you actually do these?</p>
          <div className="flex-1 overflow-y-auto space-y-2">
            {HABITS.map(h => (
              <button
                key={h}
                onClick={() => toggleHabit(h)}
                className={`card w-full text-left flex items-center gap-3 transition-all active:scale-95 ${
                  selectedHabits.includes(h) ? 'border-green-500 bg-green-900/30' : ''
                }`}
              >
                <span className="flex-1 text-sm">{h}</span>
                {selectedHabits.includes(h) && <Check size={14} className="text-green-400 flex-shrink-0" />}
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn-secondary" style={{width:'auto',padding:'1rem'}} onClick={() => setStep(0)}>
              <ArrowLeft size={16} />
            </button>
            <button
              className="btn-primary"
              disabled={selectedHabits.length < 2}
              onClick={() => setStep(2)}
            >
              Next <ArrowRight size={16} className="inline ml-1" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col">
          <h1 className="text-2xl font-bold text-slate-100 mb-1">If–then intentions</h1>
          <p className="text-slate-400 text-sm mb-2">
            Write 2 specific plans. Research shows this triples follow-through.
          </p>
          <p className="text-xs text-slate-500 mb-6">
            Example: <em>"If I'm waiting in line, I'll breathe instead of scrolling."</em>
          </p>
          <div className="space-y-4 flex-1">
            {[0, 1].map(i => (
              <div key={i}>
                <label className="text-xs text-slate-500 uppercase tracking-wide mb-1 block">
                  Intention {i + 1}
                </label>
                <textarea
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm resize-none focus:outline-none focus:border-green-500 transition-colors"
                  rows={3}
                  placeholder={`If I feel ${selectedTriggers[i] ? TRIGGER_LABELS[selectedTriggers[i]] : 'the urge'}…`}
                  value={intentions[i]}
                  onChange={e => {
                    const next = [...intentions];
                    next[i] = e.target.value;
                    setIntentions(next);
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn-secondary" style={{width:'auto',padding:'1rem'}} onClick={() => setStep(1)}>
              <ArrowLeft size={16} />
            </button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? 'Setting up…' : "Let's start ✓"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
