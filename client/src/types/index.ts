export type Stage = 'Wishlist' | 'Applied' | 'OA' | 'Interview' | 'Offer' | 'Rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Application {
  _id: string;
  company: string;
  roleTitle: string;
  location?: string;
  jobUrl?: string;
  stage: Stage;
  appliedDate?: string | null;
  followUpDate?: string | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SummaryStats {
  total: number;
  interviews: number;
  offers: number;
  rejections: number;
  conversionRate: number;
}

export interface StageCount {
  stage: Stage;
  count: number;
}

export interface WeeklyPoint {
  week: string;
  count: number;
}

export interface StatsResponse {
  summary: SummaryStats;
  applicationsByStage: StageCount[];
  weeklyTrend: WeeklyPoint[];
  overdueFollowUps: Application[];
}
