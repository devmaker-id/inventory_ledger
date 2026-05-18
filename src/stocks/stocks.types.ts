export interface TransferStockBody {
  toUserId: number;
  productId: number;
  qty: number;
  note?: string;
}

export interface ReturnStockBody {
  toUserId: number;
  productId: number;
  qty: number;
  note?: string;
}

export interface AdjustmentStockBody {
  userId: number;
  productId: number;
  qty: number;
  note?: string;
}

export interface SaleStockBody {
  productId: number;
  qty: number;
  salePrice: number;
  note?: string;
}

export interface SalesHistoryQuery {
  page?: string;
  limit?: string;
  search?: string;
  productId?: string;
  startDate?: string;
  endDate?: string;
}

export interface SettlementQuery {
  startDate?: string;
  endDate?: string;
}

export interface SettlementDetailQuery {
  startDate?: string;
  endDate?: string;
}