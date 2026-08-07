import { useState, useEffect } from 'react';
import { challenges as challengesApi } from '../api/client';
import { useApp } from '../context/AppContext';
import type { Challenge } from '../types';
import { Check, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  AWARENESS:  'text-blue-400 bg-blue-900/30',
  FRICTION:   'text-yellow-400 bg-yellow-900/30',
  BOREDOM:    'text-orange-400 bg-orange-900/30',
  STRUCTURE:  'text-purple-400 bg-purple-900/30',
  REFLECTION: 'text-teal-400 bg-teal-900/30',
};

function ChallengeCard({ challenge, completed, onComplete }: {
  challenge: Challenge;
  completed: boolean;
  onComplete: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const colorClass = CATEGORY_COLORS[challenge.category] || 'text-slate-400 bg-slate-700/30';

  const handleComplete = async () => {
    setSaving(true);
    try {
      await challengesApi.complete(challenge.id, note || undefined);
      onComplete(challenge.id);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`card transition-all ${completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3" onClick={() => setExpanded(!expanded)}>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
          {completed ? <Check size={16} /> : <span className="text-xs font-bold">{challenge.orderIndex}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-slate-200">{challenge.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs px-2 py-0.5 rounded-full ${colorClass}`}>{challenge.category}</span>
            {challenge.durationMinutes > 0 && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock size={10} /> {challenge.durationMinutes}m
              </span>
            )}
          </div>
        </div>
        <div className="text-slate-500 flex-shrink-0">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-sm text-slate-300 leading-relaxed">{challenge.description}</p>
          {!completed && (
            <div className="mt-3 space-y-3">
              <textarea
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm resize-none focus:outline-none focus:border-green-500 transition-colors"
                rows={2}
                placeholder="Notes on how it went (optional)"
                value={note}
                onChange={e => setNote(e.target.value)}
                onClick={e => e.stopPropagation()}
              />
              <button
                className="btn-primary"
                onClick={e => { e.stopPropagation(); handleComplete(); }}
                disabled={saving}
              >
                {saving ? 'Marking…' : '✓ Mark complete'}
              </button>
            </div>
          )}
          {completed && (
            <p className="mt-2 text-xs text-green-400 font-medium">✓ Completed</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Challenges() {
  const { phase } = useApp();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [list, ids] = await Promise.all([
      challengesApi.list(),
      challengesApi.completedIds(),
    ]);
    setChallenges(list);
    setCompletedIds(new Set(ids));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleComplete = (id: number) => {
    setCompletedIds(prev => new Set([...prev, id]));
  };

  const pending = challenges.filter(c => !completedIds.has(c.id));
  const done = challenges.filter(c => completedIds.has(c.id));

  if (loading) return (
    <div className="page items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="page gap-4">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-100">Challenges</h1>
        <p className="text-sm text-slate-400">Phase {phase} — complete them in order.</p>
      </div>

      {pending.length > 0 && (
        <div>
          <p className="section-title">{pending.length} remaining</p>
          <div className="space-y-3">
            {pending.map(c => (
              <ChallengeCard key={c.id} challenge={c} completed={false} onComplete={handleComplete} />
            ))}
          </div>
        </div>
      )}

      {done.length > 0 && (
        <div>
          <p className="section-title">{done.length} completed</p>
          <div className="space-y-3">
            {done.map(c => (
              <ChallengeCard key={c.id} challenge={c} completed={true} onComplete={() => {}} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
