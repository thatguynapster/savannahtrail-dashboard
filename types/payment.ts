export type PaymentMethod = 'card' | 'mobile_money' | 'bank_transfer';
export type PaymentEventType = 'payment_initiated' | 'payment_success' | 'payment_failed' | 'refund_processed';

export interface PaymentEvent {
  id: string;
  bookingId: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  type: PaymentEventType;
  status: string;
  reference: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PaymentRetryRequest {
  paymentId: string;
  reason?: string;
}