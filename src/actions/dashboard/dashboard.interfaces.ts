export interface DashboardSummaryResponse {
  dineInTotal: number;
  dineInCount: number;

  takeawayTotal: number;
  takeawayCount: number;

  deliveryTotal: number;
  deliveryCount: number;
}

export interface GetDashboardSummaryParams {
  startDate?: string;
  endDate?: string;
}