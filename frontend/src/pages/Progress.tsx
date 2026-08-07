import { useState, useEffect } from 'react';
import { urges as urgesApi, checkins as checkinsApi } from '../api/client';
import { useApp } from '../context/AppContext';
import type { UrgeLog, DailyCheckIn } from '../types';
import { TRIGGER_LABELS, TRIGGER_EMOJI, TriggerType } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

function StatCard({ label, value, sub, color = 'text-slate-100' }: {
  label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="card text-center">
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function Progress() {
  const { dashboard } = useApp();
  const [urgeHistory, setUrgeHistory] = useState<UrgeLog[]>([]);
  const [checkInHistory, setCheckInHistory] = useState<DailyCheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      urgesApi.list(30),
      checkinsApi.history(30),
    ]).then(([u, c]) => {
      setUrgeHistory(u);
      setCheckInHistory(c);
      setLoading(false);
    });
  }, []);

  if (loading || !dashboard) return (
    <div className="page items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
    </div>
  );

  const { resistanceRate7Days, totalUrges7Days, resistedUrges7Days, triggerBreakdown7Days } = dashboard;

  // Build daily urge chart data (last 7 days)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const dayUrges = urgeHistory.filter(u => u.triggeredAt.slice(0, 10) === key);
    return {
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      total: dayUrges.length,
      resisted: dayUrges.filter(u => u.resisted).length,
    };
  });

  // Mood trend from check-ins
  const moodData = checkInHistory
    .filter(c => c.moodRating)
    .slice(0, 14)
    .reverse()
    .map((c, i) => ({ day: i + 1, mood: c.moodRating, anxiety: c.anxietyRating }));

  const triggerEntries = Object.entries(triggerBreakdown7Days).sort((a, b) => b[1] - a[1]);

  return (
    <div className="page gap-5">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-100">Progress</h1>
        <p className="text-sm text-slate-400">Last 7 days</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total urges" value={totalUrges7Days} color="text-yellow-400" />
        <StatCard label="Resisted" value={resistedUrges7Days} color="text-green-400" />
        <StatCard label="Success rate" value={`${resistanceRate7Days}%`} color="text-blue-400" />
      </div>

      {/* Urge chart */}
      <div className="card">
        <p className="section-title">Urges per day</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={last7} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Bar dataKey="total" fill="#ef4444" opacity={0.6} radius={[4, 4, 0, 0]} name="Total" />
            <Bar dataKey="resisted" fill="#22c55e" radius={[4, 4, 0, 0]} name="Resisted" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-3 h-3 rounded bg-red-400/60 inline-block" /> Total</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-3 h-3 rounded bg-green-500 inline-block" /> Resisted</div>
        </div>
      </div>

      {/* Trigger breakdown */}
      {triggerEntries.length > 0 && (
        <div className="card">
          <p className="section-title">Top triggers (7 days)</p>
          <div className="space-y-2">
            {triggerEntries.map(([type, count]) => (
              <div key={type} className="flex items-center gap-3">
                <span className="text-lg w-7 text-center">{TRIGGER_EMOJI[type as TriggerType]}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{TRIGGER_LABELS[type as TriggerType] || type}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(count / totalUrges7Days) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mood trend */}
      {moodData.length > 2 && (
        <div className="card">
          <p className="section-title">Mood trend</p>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={moodData} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[1, 5]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
              />
              <Line type="monotone" dataKey="mood" stroke="#22c55e" strokeWidth={2} dot={false} name="Mood" />
              <Line type="monotone" dataKey="anxiety" stroke="#f97316" strokeWidth={2} dot={false} name="Anxiety" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-1 justify-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-3 h-0.5 bg-green-500 inline-block" /> Mood</div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-3 h-0.5 bg-orange-400 inline-block" /> Anxiety</div>
          </div>
        </div>
      )}

      <div className="card text-center py-6">
        <p className="text-4xl mb-2">🗓️</p>
        <p className="text-lg font-bold text-slate-100">Day {dashboard.dayInProgram}</p>
        <p className="text-sm text-slate-400">in your Unplug journey</p>
      </div>
    </div>
  );
}
