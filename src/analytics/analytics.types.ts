export interface SalesChartQuery {
  startDate?: string;
  endDate?: string;
}

export interface DailyReportQuery {
  date?: string;
}

export interface MonthlyReportQuery {
  month?: string;
  year?: string;
}

export interface LowStockQuery {
  threshold?: string;
}

export interface RecentTransactionQuery {
  limit?: string;
}