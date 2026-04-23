export type InHouseStatus = 'happy' | 'neutral' | 'issue' | 'vip-attention';
export type RequestStatus = 'pending' | 'in-progress' | 'completed' | 'escalated';
export type RequestPriority = 'normal' | 'high' | 'urgent';
export type RequestType = 'housekeeping' | 'maintenance' | 'room-service' | 'concierge' | 'other';

export interface InHouseGuest {
  id: string;
  reservationId: string;
  guestName: string;
  roomNumber: string;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  isVip: boolean;
  status: InHouseStatus;
  phone: string;
  email: string;
  pendingRequestsCount: number;
  nightsRemaining: number;
}

export interface ServiceRequest {
  id: string;
  guestId: string;
  guestName: string;
  roomNumber: string;
  title: string;
  description?: string;
  type: RequestType;
  priority: RequestPriority;
  status: RequestStatus;
  createdAt: Date;
  assignedTo?: string;
  timeWaitingMinutes: number;
}

export interface RoomStatus {
  roomNumber: string;
  floor: number;
  type: string;
  status: 'occupied' | 'vacant' | 'dirty' | 'maintenance' | 'out-of-service';
  condition: 'happy' | 'warning' | 'critical' | 'neutral';
  guestName?: string;
  hasVip?: boolean;
  hasRequest?: boolean;
}

export interface InHouseStats {
  totalGuests: number;
  occupancyPercentage: number;
  vipGuests: number;
  pendingRequests: number;
  criticalIssues: number;
}

export interface InHouseFilters {
  search: string;
  vipOnly?: boolean;
  requestsOnly?: boolean;
  longStay?: boolean;
  departingToday?: boolean;
}

export interface Interaction {
  id: string;
  guestId: string;
  type: 'call' | 'request' | 'complaint' | 'compliment' | 'note';
  timestamp: Date;
  content: string;
  staffName: string;
  status?: string;
}
