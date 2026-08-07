export interface UserProfile {
  id: number;
  triggers: string;
  replacementHabits: string;
  ifThenIntentions: string;
  currentPhase: number;
  onboardingComplete: boolean;
  createdAt: string;
  phaseStartDate: string;
}

export interface UrgeLog {
  id: number;
  triggeredAt: string;
  triggerType: TriggerType;
  resisted: boolean;
  replacementUsed?: string;
  notes?: string;
}

export interface DailyCheckIn {
  id: number;
  checkInDate: string;
  type: 'MORNING' | 'EVENING';
  intention?: string;
  moodRating?: number;
  anxietyRating?: number;
  urgesResisted?: number;
  reflectionNote?: string;
  createdAt: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  phase: number;
  orderIndex: number;
  category: ChallengeCategory;
  durationMinutes: number;
}

export interface ChallengeCompletion {
  id: number;
  challengeId: number;
  completedAt: string;
  note?: string;
}

export interface Streak {
  id: number;
  streakType: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
  freezesAvailable: number;
  freezesUsed: number;
}

export interface DashboardData {
  currentPhase: number;
  dayInProgram: number;
  checkInStreak: number;
  longestCheckInStreak: number;
  urgeSurfedStreak: number;
  totalUrges7Days: number;
  resistedUrges7Days: number;
  resistanceRate7Days: number;
  triggerBreakdown7Days: Record<string, number>;
  todayCheckIns: DailyCheckIn[];
  recentUrges: UrgeLog[];
  morningCheckInDone: boolean;
  eveningCheckInDone: boolean;
}

export type TriggerType = 'BOREDOM' | 'ANXIETY' | 'HABIT' | 'FOMO' | 'LONELINESS' | 'OTHER';

export type ChallengeCategory = 'AWARENESS' | 'FRICTION' | 'BOREDOM' | 'STRUCTURE' | 'REFLECTION';

export const TRIGGER_LABELS: Record<TriggerType, string> = {
  BOREDOM:   'Boredom',
  ANXIETY:   'Anxiety',
  HABIT:     'Habit',
  FOMO:      'FOMO',
  LONELINESS:'Loneliness',
  OTHER:     'Other',
};

export const TRIGGER_EMOJI: Record<TriggerType, string> = {
  BOREDOM:   '😴',
  ANXIETY:   '😰',
  HABIT:     '🔄',
  FOMO:      '📱',
  LONELINESS:'😔',
  OTHER:     '❓',
};

export const PHASE_NAMES = ['', 'Awareness', 'Friction', 'Structure', 'Maintenance'];
export const PHASE_COLORS = ['', 'text-blue-400', 'text-yellow-400', 'text-orange-400', 'text-green-400'];
export const PHASE_BG = ['', 'bg-blue-900/30', 'bg-yellow-900/30', 'bg-orange-900/30', 'bg-green-900/30'];
