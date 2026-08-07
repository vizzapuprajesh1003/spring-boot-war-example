import axios from 'axios';
import type { DashboardData, UserProfile, UrgeLog, DailyCheckIn, Challenge, ChallengeCompletion } from '../types';

const api = axios.create({ baseURL: '/api' });

export const user = {
  status: () => api.get<{ setup: boolean; phase: number }>('/user/status').then(r => r.data),
  profile: () => api.get<UserProfile>('/user/profile').then(r => r.data),
  setup: (data: { triggers: string[]; replacementHabits: string[]; ifThenIntentions: string[] }) =>
    api.post<UserProfile>('/user/setup', data).then(r => r.data),
  advancePhase: () => api.post<UserProfile>('/user/advance-phase').then(r => r.data),
};

export const urges = {
  log: (data: { triggerType: string; resisted: boolean; replacementUsed?: string; notes?: string }) =>
    api.post<UrgeLog>('/urges', data).then(r => r.data),
  list: (days = 7) => api.get<UrgeLog[]>('/urges', { params: { days } }).then(r => r.data),
  stats: (days = 7) => api.get<Record<string, unknown>>('/urges/stats', { params: { days } }).then(r => r.data),
};

export const checkins = {
  save: (data: Partial<DailyCheckIn> & { type: string }) =>
    api.post<DailyCheckIn>('/checkins', data).then(r => r.data),
  today: () => api.get<DailyCheckIn[]>('/checkins/today').then(r => r.data),
  history: (days = 30) => api.get<DailyCheckIn[]>('/checkins/history', { params: { days } }).then(r => r.data),
};

export const challenges = {
  list: () => api.get<Challenge[]>('/challenges').then(r => r.data),
  current: () => api.get<Challenge>('/challenges/current').then(r => r.data),
  completedIds: () => api.get<number[]>('/challenges/completed-ids').then(r => r.data),
  complete: (id: number, note?: string) =>
    api.post<ChallengeCompletion>(`/challenges/${id}/complete`, { note }).then(r => r.data),
  completions: () => api.get<ChallengeCompletion[]>('/challenges/completions').then(r => r.data),
};

export const dashboard = {
  get: () => api.get<DashboardData>('/dashboard').then(r => r.data),
};
