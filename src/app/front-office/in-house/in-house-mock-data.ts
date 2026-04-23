import { InHouseGuest, ServiceRequest, RoomStatus, Interaction } from './models/in-house.model';

const today = new Date();

export const IN_HOUSE_GUESTS_MOCK: InHouseGuest[] = [
  {
    id: 'G-701',
    reservationId: 'RES-2024-3001',
    guestName: 'Robert Wilson',
    roomNumber: '201',
    roomType: 'Deluxe',
    checkIn: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
    checkOut: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
    isVip: true,
    status: 'happy',
    phone: '+91 9876543210',
    email: 'robert.w@example.com',
    pendingRequestsCount: 0,
    nightsRemaining: 3
  },
  {
    id: 'G-702',
    reservationId: 'RES-2024-3002',
    guestName: 'Sarah Jenkins',
    roomNumber: '305',
    roomType: 'Suite',
    checkIn: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
    checkOut: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
    isVip: false,
    status: 'issue',
    phone: '+1 415 555 0123',
    email: 'sarah.j@example.com',
    pendingRequestsCount: 2,
    nightsRemaining: 4
  },
  {
    id: 'G-703',
    reservationId: 'RES-2024-3003',
    guestName: 'Amit Sharma',
    roomNumber: '102',
    roomType: 'Standard',
    checkIn: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
    checkOut: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
    isVip: false,
    status: 'neutral',
    phone: '+91 9988776655',
    email: 'amit.s@example.com',
    pendingRequestsCount: 1,
    nightsRemaining: 1
  },
  {
    id: 'G-704',
    reservationId: 'RES-2024-3004',
    guestName: 'Elena Rodriguez',
    roomNumber: '408',
    roomType: 'Suite',
    checkIn: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
    checkOut: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
    isVip: true,
    status: 'vip-attention',
    phone: '+34 600 000 000',
    email: 'elena.r@example.com',
    pendingRequestsCount: 0,
    nightsRemaining: 2
  }
];

export const SERVICE_REQUESTS_MOCK: ServiceRequest[] = [
  {
    id: 'REQ-1001',
    guestId: 'G-702',
    guestName: 'Sarah Jenkins',
    roomNumber: '305',
    title: 'AC Not Cooling',
    description: 'The AC unit is making a loud noise and not cooling the room properly.',
    type: 'maintenance',
    priority: 'urgent',
    status: 'pending',
    createdAt: new Date(today.getTime() - 45 * 60 * 1000),
    timeWaitingMinutes: 45
  },
  {
    id: 'REQ-1002',
    guestId: 'G-702',
    guestName: 'Sarah Jenkins',
    roomNumber: '305',
    title: 'Extra Towels',
    description: 'Need 2 extra bath towels.',
    type: 'housekeeping',
    priority: 'normal',
    status: 'in-progress',
    createdAt: new Date(today.getTime() - 20 * 60 * 1000),
    assignedTo: 'Sunita K.',
    timeWaitingMinutes: 20
  },
  {
    id: 'REQ-1003',
    guestId: 'G-703',
    guestName: 'Amit Sharma',
    roomNumber: '102',
    title: 'Room Service - Dinner',
    description: '1x Paneer Tikka, 2x Butter Naan',
    type: 'room-service',
    priority: 'high',
    status: 'pending',
    createdAt: new Date(today.getTime() - 10 * 60 * 1000),
    timeWaitingMinutes: 10
  }
];

export const ROOM_STATUS_MAP_MOCK: RoomStatus[] = [
  { roomNumber: '101', floor: 1, type: 'Standard', status: 'vacant', condition: 'neutral' },
  { roomNumber: '102', floor: 1, type: 'Standard', status: 'occupied', condition: 'neutral', guestName: 'Amit Sharma' },
  { roomNumber: '103', floor: 1, type: 'Standard', status: 'dirty', condition: 'neutral' },
  { roomNumber: '201', floor: 2, type: 'Deluxe', status: 'occupied', condition: 'happy', guestName: 'Robert Wilson', hasVip: true },
  { roomNumber: '202', floor: 2, type: 'Deluxe', status: 'maintenance', condition: 'critical' },
  { roomNumber: '305', floor: 3, type: 'Suite', status: 'occupied', condition: 'warning', guestName: 'Sarah Jenkins', hasRequest: true },
  { roomNumber: '408', floor: 4, type: 'Suite', status: 'occupied', condition: 'happy', guestName: 'Elena Rodriguez', hasVip: true }
];

export const INTERACTIONS_MOCK: Interaction[] = [
  {
    id: 'INT-5001',
    guestId: 'G-702',
    type: 'complaint',
    timestamp: new Date(today.getTime() - 50 * 60 * 1000),
    content: 'Called regarding AC malfunction in room 305.',
    staffName: 'Rahul M.',
    status: 'Logged'
  },
  {
    id: 'INT-5002',
    guestId: 'G-701',
    type: 'compliment',
    timestamp: new Date(today.getTime() - 2 * 60 * 60 * 1000),
    content: 'Guest mentioned the breakfast spread was excellent.',
    staffName: 'Sunita K.'
  }
];
