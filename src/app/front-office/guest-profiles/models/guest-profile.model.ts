export type GuestType = 'Regular' | 'VIP' | 'Repeat' | 'Corporate' | 'Blacklisted';
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded';

export interface GuestSummary {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  phone: string;
  email: string;
  nationality: string;
  flagUrl: string;
  type: GuestType[];
  stayCount: number;
}

export interface LoyaltyInfo {
  tier: string;
  points: number;
  lifetimeSpend: number;
  totalNights: number;
}

export interface StayRecord {
  reservationId: string;
  checkIn: Date;
  checkOut: Date;
  roomNumber: string;
  roomType: string;
  totalBill: number;
  status: string;
}

export interface GuestPreferences {
  room: string[];
  service: string[];
}

export interface GuestDocument {
  id: string;
  type: string;
  uploadDate: Date;
  expiryDate: Date;
}

export interface BillingRecord {
  invoiceId: string;
  reservationId: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  date: Date;
}

export interface GuestNote {
  id: string;
  staffName: string;
  content: string;
  timestamp: Date;
  isPinned?: boolean;
}

export interface GuestProfile extends GuestSummary {
  dateOfBirth: Date;
  gender: string;
  preferredLanguage: string;
  address: string;
  city: string;
  country: string;
  loyalty: LoyaltyInfo;
  preferences: GuestPreferences;
  documents: GuestDocument[];
  stayHistory: StayRecord[];
  billingHistory: BillingRecord[];
  notes: GuestNote[];
}
