export type AnalyticsChartItem = {
  date: string;
  visits: number;
};

export type AnalyticsTopPageItem = {
  page: string;
  visits: number;
};

export type AnalyticsSummary = {
  totalVisits: number;
  todayVisits: number;
  thisWeekVisits: number;
  avgDailyVisits: number;
  chartData: AnalyticsChartItem[];
  topPages: AnalyticsTopPageItem[];
};