import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PhaseProgress from '../components/PhaseProgress';
import StreakCard from '../components/StreakCard';
import { Zap, Sun, Moon, Trophy } from 'lucide-react';
import { TRIGGER_LABELS, TRIGGER_EMOJI } from '../types';

export default function Home() {
  const navigate = useNavigate();
  const { dashboard } = useApp();

  if (!dashboard) return (
    <div className="page items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
    </div>
  );

  const { currentPhase, dayInProgram, checkInStreak, longestCheckInStreak,
    urgeSurfedStreak, totalUrges7Days, resistedUrges7Days, resistanceRate7Days,
    morningCheckInDone, eveningCheckInDone, recentUrges } = dashboard;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="page gap-4">
      <div className="mb-1">
        <h1 className="text-2xl font-bold text-slate-100">{greeting()} 👋</h1>
        <p className="text-slate-400 text-sm">Here's your Unplug summary.</p>
      </div>

      <PhaseProgress currentPhase={currentPhase} dayInProgram={dayInProgram} />

      {/* Quick actions */}
      <div>
        <p className="section-title">Quick actions</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/urge')}
            className="card flex flex-col items-start gap-2 active:scale-95 transition-transform"
          >
            <div className="bg-yellow-500/20 rounded-xl p-2">
              <Zap size={20} className="text-yellow-400" />
            </div>
            <span className="font-semibold text-sm">I feel the urge</span>
            <span className="text-xs text-slate-500">Log + surf it</span>
          </button>
          <button
            onClick={() => navigate('/checkin')}
            className="card flex flex-col items-start gap-2 active:scale-95 transition-transform"
          >
            <div className={`rounded-xl p-2 ${morningCheckInDone ? 'bg-slate-700/50' : 'bg-green-500/20'}`}>
              {morningCheckInDone ? (
                <Moon size={20} className={eveningCheckInDone ? 'text-slate-500' : 'text-indigo-400'} />
              ) : (
                <Sun size={20} className="text-green-400" />
              )}
            </div>
            <span className="font-semibold text-sm">
              {morningCheckInDone && eveningCheckInDone ? 'All done today ✓' :
               morningCheckInDone ? 'Evening check-in' : 'Morning check-in'}
            </span>
            <span className="text-xs text-slate-500">30-second reflection</span>
          </button>
        </div>
      </div>

      {/* Streaks */}
      <div>
        <p className="section-title">Streaks</p>
        <div className="space-y-3">
          <StreakCard label="Daily check-in streak" current={checkInStreak} longest={longestCheckInStreak} color="text-orange-400" />
          <StreakCard label="Urges surfed streak" current={urgeSurfedStreak} longest={urgeSurfedStreak} color="text-green-400" />
        </div>
      </div>

      {/* 7-day stats */}
      <div>
        <p className="section-title">Last 7 days</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Urges', value: totalUrges7Days, color: 'text-red-400' },
            { label: 'Resisted', value: resistedUrges7Days, color: 'text-green-400' },
            { label: 'Rate', value: `${resistanceRate7Days}%`, color: 'text-blue-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent urges */}
      {recentUrges.length > 0 && (
        <div>
          <p className="section-title">Recent urges</p>
          <div className="space-y-2">
            {recentUrges.slice(0, 3).map(u => (
              <div key={u.id} className="card flex items-center gap-3">
                <span className="text-xl">{TRIGGER_EMOJI[u.triggerType]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">{TRIGGER_LABELS[u.triggerType]}</p>
                  <p className="text-xs text-slate-500">{new Date(u.triggeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  u.resisted ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                }`}>
                  {u.resisted ? 'Surfed' : 'Gave in'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/challenges')}
        className="card flex items-center gap-3 active:scale-95 transition-transform text-left"
      >
        <div className="bg-purple-500/20 rounded-xl p-2">
          <Trophy size={20} className="text-purple-400" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Today's challenge</p>
          <p className="text-xs text-slate-500">Tap to view</p>
        </div>
      </button>
    </div>
  );
}
