import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { user as userApi, dashboard as dashboardApi } from '../api/client';
import type { DashboardData } from '../types';

interface AppContextValue {
  isSetup: boolean;
  phase: number;
  dashboard: DashboardData | null;
  loading: boolean;
  refresh: () => void;
}

const AppContext = createContext<AppContextValue>({
  isSetup: false, phase: 0, dashboard: null, loading: true, refresh: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isSetup, setIsSetup] = useState(false);
  const [phase, setPhase] = useState(1);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const status = await userApi.status();
      setIsSetup(status.setup);
      setPhase(status.phase);
      if (status.setup) {
        const dash = await dashboardApi.get();
        setData(dash);
      }
    } catch (e) {
      console.error('Failed to load app state', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <AppContext.Provider value={{ isSetup, phase, dashboard: data, loading, refresh }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
