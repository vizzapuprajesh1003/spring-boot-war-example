import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import NavBar from './components/NavBar';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import LogUrge from './pages/LogUrge';
import DailyCheckIn from './pages/DailyCheckIn';
import Challenges from './pages/Challenges';
import Progress from './pages/Progress';

function AppRoutes() {
  const { isSetup, loading } = useApp();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
        <p className="text-slate-400 text-sm">Loading Unplug…</p>
      </div>
    </div>
  );

  if (!isSetup) return (
    <Routes>
      <Route path="*" element={<Onboarding />} />
    </Routes>
  );

  return (
    <>
      <Routes>
        <Route path="/"           element={<Home />}         />
        <Route path="/urge"       element={<LogUrge />}      />
        <Route path="/checkin"    element={<DailyCheckIn />} />
        <Route path="/challenges" element={<Challenges />}   />
        <Route path="/progress"   element={<Progress />}     />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
      <NavBar />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
