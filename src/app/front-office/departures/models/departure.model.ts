export type DepartureStatus = 'pending' | 'in-progress' | 'completed' | 'late' | 'no-show';

export interface Departure {
  id: string;
  guestName: string;
  guestId: string;
  roomNumber: string;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  scheduledCheckoutTime: string;
  actualCheckoutTime?: string;
  status: DepartureStatus;
  totalAmount: number;
  balanceDue: number;
  isVip: boolean;
  phone: string;
  email: string;
}

export interface DepartureFilters {
  search: string;
  status: DepartureStatus | 'all';
  roomType: string;
}

export interface BillingItem {
  id: string;
  description: string;
  amount: number;
  category: 'room' | 'food' | 'service' | 'damage' | 'other';
  date: Date;
}

export interface RoomAudit {
  cleanliness: number; // 1-5
  amenitiesWorking: boolean;
  damageFound: boolean;
  damageNotes?: string;
  damageSeverity?: 'minor' | 'moderate' | 'major';
  photos?: string[];
}

export interface GuestFeedback {
  rating: number; // 1-5
  cleanlinessRating: number;
  serviceRating: number;
  recommend: 'yes' | 'no' | 'maybe';
  comments: string;
}
