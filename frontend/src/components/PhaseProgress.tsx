import { PHASE_NAMES, PHASE_COLORS } from '../types';

interface Props {
  currentPhase: number;
  dayInProgram: number;
}

const PHASE_DAYS = [0, 7, 21, 42, Infinity];

export default function PhaseProgress({ currentPhase, dayInProgram }: Props) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Phase {currentPhase}</p>
          <p className={`text-lg font-bold ${PHASE_COLORS[currentPhase]}`}>
            {PHASE_NAMES[currentPhase]}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Day</p>
          <p className="text-2xl font-bold text-slate-200">{dayInProgram}</p>
        </div>
      </div>
      <div className="flex gap-1.5 mt-2">
        {[1, 2, 3, 4].map(p => (
          <div
            key={p}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              p < currentPhase ? 'bg-green-500' :
              p === currentPhase ? 'bg-green-400' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-2">
        {[1,2,3].includes(currentPhase)
          ? `${PHASE_DAYS[currentPhase] - (dayInProgram - 1)} days to Phase ${currentPhase + 1}`
          : 'Maintenance mode — keep going!'}
      </p>
    </div>
  );
}
