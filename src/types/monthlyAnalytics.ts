export type MonthlyAnalyticsTopPage = {
  key: string;
  label: string;
  visits: number;
};

export type MonthlyAnalyticsComparison = {
  previousMonthKey: string;
  previousTotalVisits: number;
  growthPercentage: number;
};

export type MonthlyAnalyticsReport = {
  monthKey: string;
  totalVisits: number;
  avgDailyVisits: number;
  topPages: MonthlyAnalyticsTopPage[];
  comparison: MonthlyAnalyticsComparison;
  generatedAt?: string;
};