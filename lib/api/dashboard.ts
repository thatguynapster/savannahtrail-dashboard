import { apiClient } from './client';
import { DashboardKPIs, RevenueData, PopularPackage, RecentActivity } from '@/types/dashboard';

export const dashboardApi = {
  getKPIs: async (): Promise<DashboardKPIs> => {
    return apiClient.get<DashboardKPIs>('/dashboard/kpis');
  },

  getRevenueData: async (period: string = '30d'): Promise<RevenueData[]> => {
    return apiClient.get<RevenueData[]>(`/dashboard/revenue?period=${period}`);
  },

  getPopularPackages: async (): Promise<PopularPackage[]> => {
    return apiClient.get<PopularPackage[]>('/dashboard/popular-packages');
  },

  getRecentActivity: async (limit = 10): Promise<RecentActivity[]> => {
    return apiClient.get<RecentActivity[]>(`/dashboard/activity?limit=${limit}`);
  },
};