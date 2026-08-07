import { Flame } from 'lucide-react';

interface Props {
  label: string;
  current: number;
  longest: number;
  color?: string;
}

export default function StreakCard({ label, current, longest, color = 'text-orange-400' }: Props) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`${color} flex-shrink-0`}>
        <Flame size={32} fill="currentColor" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-400">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>
          {current} <span className="text-base font-normal text-slate-400">day{current !== 1 ? 's' : ''}</span>
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs text-slate-500">Best</p>
        <p className="text-lg font-semibold text-slate-300">{longest}</p>
      </div>
    </div>
  );
}
