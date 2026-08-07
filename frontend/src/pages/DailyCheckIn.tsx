import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkins as checkinsApi } from '../api/client';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Sun, Moon } from 'lucide-react';

function RatingRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <p className="text-sm text-slate-300 mb-2">{label}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`flex-1 h-10 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
              value === n
                ? 'bg-green-500 text-white'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DailyCheckIn() {
  const navigate = useNavigate();
  const { dashboard, refresh } = useApp();
  const [saving, setSaving] = useState(false);

  const isMorning = !dashboard?.morningCheckInDone;
  const type = isMorning ? 'MORNING' : 'EVENING';

  const [intention, setIntention] = useState('');
  const [mood, setMood] = useState(3);
  const [anxiety, setAnxiety] = useState(3);
  const [urgesResisted, setUrgesResisted] = useState(0);
  const [note, setNote] = useState('');

  const allDone = dashboard?.morningCheckInDone && dashboard?.eveningCheckInDone;

  const handleSave = async () => {
    setSaving(true);
    try {
      await checkinsApi.save({
        type,
        intention: isMorning ? intention : undefined,
        moodRating: mood,
        anxietyRating: anxiety,
        urgesResisted: isMorning ? undefined : urgesResisted,
        reflectionNote: note || undefined,
      });
      await refresh();
      navigate('/');
    } finally {
      setSaving(false);
    }
  };

  if (allDone) return (
    <div className="page items-center justify-center text-center gap-4">
      <div className="text-5xl">✅</div>
      <h1 className="text-xl font-bold text-slate-100">Both check-ins done!</h1>
      <p className="text-slate-400 text-sm">You've completed your daily check-ins. See you tomorrow.</p>
      <button className="btn-primary" onClick={() => navigate('/')}>Back home</button>
    </div>
  );

  return (
    <div className="page gap-5">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => navigate(-1)} className="text-slate-400">
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center gap-2">
          {isMorning ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-400" />}
          <h1 className="text-xl font-bold text-slate-100">
            {isMorning ? 'Morning check-in' : 'Evening check-in'}
          </h1>
        </div>
      </div>

      {isMorning ? (
        <div>
          <label className="section-title block">Today's intention</label>
          <textarea
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm resize-none focus:outline-none focus:border-green-500 transition-colors"
            rows={3}
            placeholder="How will you use your phone intentionally today?"
            value={intention}
            onChange={e => setIntention(e.target.value)}
          />
        </div>
      ) : (
        <div>
          <label className="section-title block">Urges resisted today</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setUrgesResisted(Math.max(0, urgesResisted - 1))}
              className="w-12 h-12 bg-slate-700 rounded-xl text-xl font-bold text-slate-300 active:bg-slate-600"
            >−</button>
            <span className="text-3xl font-bold text-green-400 flex-1 text-center">{urgesResisted}</span>
            <button
              onClick={() => setUrgesResisted(urgesResisted + 1)}
              className="w-12 h-12 bg-slate-700 rounded-xl text-xl font-bold text-slate-300 active:bg-slate-600"
            >+</button>
          </div>
        </div>
      )}

      <RatingRow label="Mood (1 = low, 5 = great)" value={mood} onChange={setMood} />
      <RatingRow label="Anxiety level (1 = calm, 5 = very anxious)" value={anxiety} onChange={setAnxiety} />

      <div>
        <label className="section-title block">
          {isMorning ? 'Anything on your mind?' : 'How did the day go?'}
        </label>
        <textarea
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm resize-none focus:outline-none focus:border-green-500 transition-colors"
          rows={3}
          placeholder="Optional note…"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </div>

      <div className="mt-auto">
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save check-in'}
        </button>
      </div>
    </div>
  );
}
