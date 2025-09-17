export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
}

export interface Booking {
  id: string;
  packageId: string;
  packageName: string;
  customer: Customer;
  guideId?: string;
  guideName?: string;
  startDate: string;
  endDate: string;
  participants: number;
  totalAmount: number;
  paidAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  invoiceUrl?: string;
  addOns: BookingAddOn[];
}

export interface BookingAddOn {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface BookingFilters {
  status?: BookingStatus[];
  paymentStatus?: PaymentStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  guideId?: string;
  packageId?: string;
  search?: string;
}

export interface BookingUpdateRequest {
  status?: BookingStatus;
  guideId?: string;
  specialRequests?: string;
}