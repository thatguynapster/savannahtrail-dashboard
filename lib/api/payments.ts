import { apiClient } from './client';
import { PaymentEvent, PaymentRetryRequest } from '@/types/payment';

export interface PaymentEventsResponse {
  events: PaymentEvent[];
  total: number;
  page: number;
  limit: number;
}

export const paymentsApi = {
  getPaymentEvents: async (
    page = 1,
    limit = 20
  ): Promise<PaymentEventsResponse> => {
    return apiClient.get<PaymentEventsResponse>(`/payments/events?page=${page}&limit=${limit}`);
  },

  retryPayment: async (data: PaymentRetryRequest): Promise<void> => {
    return apiClient.post<void>('/payments/retry', data);
  },

  verifyPayment: async (paymentId: string): Promise<void> => {
    return apiClient.post<void>(`/payments/${paymentId}/verify`);
  },
};