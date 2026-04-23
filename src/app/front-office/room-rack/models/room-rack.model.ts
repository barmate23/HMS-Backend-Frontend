export type RoomType = 'Single' | 'Double' | 'Suite' | 'Deluxe Suite' | 'Penthouse';
export type RoomStatus = 'Occupied' | 'Vacant' | 'Blocked' | 'Maintenance' | 'Dirty' | 'Clean';
export type HousekeepingStatus = 'Pending' | 'InProgress' | 'Completed' | 'Inspected';
export type ReservationStatus = 'Booked' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';

export interface Room {
  id: string;
  roomNumber: string;
  roomType: RoomType;
  floor: number;
  capacity: number;
  amenities: string[];
  currentStatus: RoomStatus;
  price: {
    single: number;
    double: number;
    suite: number;
  };
  features: string[];
}

export interface RoomAssignment {
  id: string;
  roomId: string;
  reservationId: string;
  guestId: string;
  guestName: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfNights: number;
  status: ReservationStatus;
  rate: number;
  housekeepingStatus: HousekeepingStatus;
  notes?: string;
}

export interface MaintenanceBlock {
  id: string;
  roomId: string;
  blockType: 'Maintenance' | 'OutOfOrder' | 'BlockForRenovation' | 'Staff';
  startDate: Date;
  endDate: Date;
  reason: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'InProgress' | 'Completed';
}

export interface RoomRackFilters {
  search: string;
  floors: number[];
  roomTypes: RoomType[];
  statuses: RoomStatus[];
  startDate: Date;
  daysToShow: 7 | 14 | 30;
}
