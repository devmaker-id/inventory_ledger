export interface SettlementExportQuery {
  startDate?: string;
  endDate?: string;
}

export interface SettlementExportRow {
  distributorName: string;
  totalTransactions: number;
  totalQty: number;
  totalRevenue: number;
  ownerShare: number;
  distributorShare: number;
}

export interface MonthlyReportExportQuery {
  month?: string;
  year?: string;
}

export interface InventoryExportQuery {
  threshold?: string;
}

export interface SalesHistoryExportQuery {
  startDate?: string;
  endDate?: string;
}