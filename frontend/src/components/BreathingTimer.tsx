import { useState, useEffect, useCallback } from 'react';

interface Props {
  durationSeconds?: number;
  onComplete: () => void;
  onSkip: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'done';

const CYCLE = [
  { phase: 'inhale' as Phase, duration: 4, label: 'Breathe in…' },
  { phase: 'hold'   as Phase, duration: 4, label: 'Hold…'       },
  { phase: 'exhale' as Phase, duration: 4, label: 'Breathe out…' },
];

export default function BreathingTimer({ durationSeconds = 90, onComplete, onSkip }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [cycleElapsed, setCycleElapsed] = useState(0);

  const current = CYCLE[cycleIndex % CYCLE.length];
  const progress = elapsed / durationSeconds;
  const circleSize = 160;
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference * (1 - progress);

  useEffect(() => {
    if (elapsed >= durationSeconds) return;
    const id = setInterval(() => {
      setElapsed(e => {
        if (e + 1 >= durationSeconds) { clearInterval(id); return durationSeconds; }
        return e + 1;
      });
      setCycleElapsed(ce => {
        const next = ce + 1;
        if (next >= current.duration) {
          setCycleIndex(ci => ci + 1);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [elapsed, durationSeconds, current.duration]);

  const done = elapsed >= durationSeconds;
  const isExpanding = current.phase === 'inhale';

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: circleSize, height: circleSize }}>
        {/* Background ring */}
        <svg width={circleSize} height={circleSize} className="absolute inset-0 -rotate-90">
          <circle cx={80} cy={80} r={radius} fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle
            cx={80} cy={80} r={radius}
            fill="none"
            stroke="#22c55e"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDash}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        {/* Inner breathing circle */}
        <div
          className={`absolute inset-0 m-4 rounded-full bg-green-500/20 transition-transform duration-[4000ms] ease-in-out ${
            isExpanding ? 'scale-110' : 'scale-90'
          }`}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-green-400">
            {done ? '✓' : Math.ceil(durationSeconds - elapsed)}
          </span>
          <span className="text-xs text-slate-400">secs</span>
        </div>
      </div>

      <p className="text-xl font-medium text-slate-200">
        {done ? 'Well done. The urge has passed.' : current.label}
      </p>

      {!done && (
        <p className="text-sm text-slate-500 text-center max-w-xs">
          Ride out the urge. Cravings peak and pass in 60–90 seconds.
        </p>
      )}

      <div className="w-full flex flex-col gap-3">
        {done ? (
          <button className="btn-primary" onClick={onComplete}>Continue</button>
        ) : (
          <>
            <button className="btn-ghost text-center" onClick={onSkip}>
              Skip breathing →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
