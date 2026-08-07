import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urges as urgesApi, user as userApi } from '../api/client';
import { useApp } from '../context/AppContext';
import { TriggerType, TRIGGER_LABELS, TRIGGER_EMOJI } from '../types';
import BreathingTimer from '../components/BreathingTimer';
import { ArrowLeft } from 'lucide-react';

const TRIGGERS: TriggerType[] = ['BOREDOM', 'ANXIETY', 'HABIT', 'FOMO', 'LONELINESS', 'OTHER'];

type Step = 'trigger' | 'surf' | 'outcome';

export default function LogUrge() {
  const navigate = useNavigate();
  const { refresh } = useApp();
  const [step, setStep] = useState<Step>('trigger');
  const [triggerType, setTriggerType] = useState<TriggerType | null>(null);
  const [resisted, setResisted] = useState<boolean | null>(null);
  const [replacementUsed, setReplacementUsed] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [userHabits, setUserHabits] = useState<string[]>([]);

  useEffect(() => {
    userApi.profile()
      .then(p => setUserHabits(p.replacementHabits?.split(',').filter(Boolean) ?? []))
      .catch(() => {});
  }, []);

  const handleSave = async (didResist: boolean) => {
    if (!triggerType) return;
    setSaving(true);
    try {
      await urgesApi.log({
        triggerType,
        resisted: didResist,
        replacementUsed: replacementUsed || undefined,
        notes: notes || undefined,
      });
      await refresh();
      navigate('/', { replace: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-slate-400">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold text-slate-100">Urge logger</h1>
      </div>

      {step === 'trigger' && (
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <p className="section-title">What triggered the urge?</p>
            <div className="grid grid-cols-2 gap-3">
              {TRIGGERS.map(t => (
                <button
                  key={t}
                  onClick={() => setTriggerType(t)}
                  className={`card flex items-center gap-3 active:scale-95 transition-all ${
                    triggerType === t ? 'border-green-500 bg-green-900/30' : ''
                  }`}
                >
                  <span className="text-2xl">{TRIGGER_EMOJI[t]}</span>
                  <span className="font-medium text-sm">{TRIGGER_LABELS[t]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="section-title block">Notes (optional)</label>
            <textarea
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm resize-none focus:outline-none focus:border-green-500 transition-colors"
              rows={2}
              placeholder="What were you doing when the urge hit?"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <div className="mt-auto space-y-3">
            <button
              className="btn-primary"
              disabled={!triggerType}
              onClick={() => setStep('surf')}
            >
              🌊 Surf the urge (recommended)
            </button>
            <button
              className="btn-ghost text-center w-full"
              disabled={!triggerType}
              onClick={() => { setResisted(false); setStep('outcome'); }}
            >
              I already gave in — just log it
            </button>
          </div>
        </div>
      )}

      {step === 'surf' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="text-center">
            <p className="text-lg font-bold text-slate-100 mb-1">Ride it out</p>
            <p className="text-sm text-slate-400">
              Urges peak and pass in 60–90 seconds. Breathe with the circle.
            </p>
          </div>
          <BreathingTimer
            durationSeconds={90}
            onComplete={() => { setResisted(true); setStep('outcome'); }}
            onSkip={() => setStep('outcome')}
          />
        </div>
      )}

      {step === 'outcome' && (
        <div className="flex-1 flex flex-col gap-5">
          <p className="text-lg font-bold text-slate-100">How did it go?</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setResisted(true)}
              className={`card flex flex-col items-center gap-2 py-5 active:scale-95 transition-all ${
                resisted === true ? 'border-green-500 bg-green-900/30' : ''
              }`}
            >
              <span className="text-3xl">💪</span>
              <span className="font-semibold text-sm text-green-400">Resisted it</span>
            </button>
            <button
              onClick={() => setResisted(false)}
              className={`card flex flex-col items-center gap-2 py-5 active:scale-95 transition-all ${
                resisted === false ? 'border-red-500 bg-red-900/30' : ''
              }`}
            >
              <span className="text-3xl">😔</span>
              <span className="font-semibold text-sm text-red-400">Gave in</span>
            </button>
          </div>

          {resisted && userHabits.length > 0 && (
            <div>
              <p className="section-title">What helped?</p>
              <div className="flex flex-wrap gap-2">
                {userHabits.map((h: string) => (
                  <button
                    key={h}
                    onClick={() => setReplacementUsed(h === replacementUsed ? '' : h)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      replacementUsed === h
                        ? 'bg-green-900/40 border-green-500 text-green-400'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto">
            <button
              className="btn-primary"
              disabled={resisted === null || saving}
              onClick={() => resisted !== null && handleSave(resisted)}
            >
              {saving ? 'Saving…' : 'Save & finish'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
