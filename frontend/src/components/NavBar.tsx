import { NavLink } from 'react-router-dom';
import { Home, Zap, Sun, Trophy, BarChart2 } from 'lucide-react';

const links = [
  { to: '/',            icon: Home,     label: 'Home'      },
  { to: '/urge',        icon: Zap,      label: 'Urge'      },
  { to: '/checkin',     icon: Sun,      label: 'Check-in'  },
  { to: '/challenges',  icon: Trophy,   label: 'Challenges'},
  { to: '/progress',    icon: BarChart2, label: 'Progress' },
];

export default function NavBar() {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-slate-900 border-t border-slate-700 pb-safe z-50">
      <div className="flex items-center justify-around h-16">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? 'text-green-400' : 'text-slate-500'
              }`
            }
          >
            <Icon size={22} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
