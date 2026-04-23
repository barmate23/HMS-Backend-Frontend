export type ArrivalStatus = 'pending' | 'confirmed' | 'vip' | 'checked-in' | 'no-show' | 'pre-assigned';
export type RoomType = 'Standard' | 'Deluxe' | 'Junior Suite' | 'Suite' | 'Presidential';
export type RatePlan = 'Rack' | 'Corporate' | 'Package' | 'OTA';
export type BookingSource = 'Walk-in' | 'Phone' | 'Booking.com' | 'Agoda' | 'Corporate' | 'Direct' | 'Airbnb';

export interface Arrival {
  id: string;                    // RES-2024-XXXX
  guestName: string;
  guestId: string;
  phone: string;
  email: string;
  roomNumber: string | null;     // null if not yet assigned
  roomType: RoomType;
  ratePlan: RatePlan;
  source: BookingSource;
  eta: string;                   // "HH:MM"
  checkIn: Date;
  checkOut: Date;
  nights: number;
  adults: number;
  children: number;
  advancePaid: number;
  totalAmount: number;
  status: ArrivalStatus;
  isVip: boolean;
  specialRequests: string;
  idVerified: boolean;
  nationality: string;
  statusClass?: string;
}

export interface ArrivalFilters {
  search: string;
  status: ArrivalStatus | 'all';
  roomType: RoomType | 'all';
  source: BookingSource | 'all';
}

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  floor: string;
  view: 'Sea' | 'Garden' | 'City';
  status: 'Vacant Clean' | 'Vacant Dirty' | 'Occupied' | 'OOO';
  features: string[];
}

export interface CheckInPayload {
  roomNumber: string;
  paymentAmount: number;
  paymentMode: string;
  idFront?: string;
  idBack?: string;
}

export interface WalkInPayload {
  firstName: string;
  lastName: string;
  mobile: string;
  email?: string;
  idType: string;
  idNumber: string;
  checkOutDate: Date;
  adults: number;
  children: number;
  roomType: RoomType;
  roomNumber: string;
  ratePlan: RatePlan;
  ratePerNight: number;
  specialRequests?: string;
  nationality: string;
  nights: number;
  totalAmount: number;
}
