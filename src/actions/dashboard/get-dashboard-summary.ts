import apiClient from '../../config/api';
import {
  DashboardSummaryResponse,
  GetDashboardSummaryParams,
} from './dashboard.interfaces';

export async function getDashboardSummary(params?: GetDashboardSummaryParams) {
  const response = await apiClient.get<DashboardSummaryResponse>(
    '/dashboard/summary',
    { params },
  );

  return response.data;
}
