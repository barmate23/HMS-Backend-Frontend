import { Room, RoomAssignment, MaintenanceBlock } from './models/room-rack.model';

export const ROOMS_MOCK: Room[] = [
  { id: '1', roomNumber: '101', roomType: 'Single', floor: 1, capacity: 1, amenities: ['WiFi', 'AC', 'TV'], currentStatus: 'Occupied', price: { single: 2500, double: 0, suite: 0 }, features: ['Near Elevator'] },
  { id: '2', roomNumber: '102', roomType: 'Double', floor: 1, capacity: 2, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], currentStatus: 'Vacant', price: { single: 3500, double: 4500, suite: 0 }, features: ['City View'] },
  { id: '3', roomNumber: '103', roomType: 'Single', floor: 1, capacity: 1, amenities: ['WiFi', 'AC'], currentStatus: 'Dirty', price: { single: 2200, double: 0, suite: 0 }, features: [] },
  { id: '4', roomNumber: '104', roomType: 'Suite', floor: 1, capacity: 3, amenities: ['WiFi', 'AC', 'TV', 'Balcony', 'Jacuzzi'], currentStatus: 'Maintenance', price: { single: 8000, double: 9000, suite: 12000 }, features: ['Lake View'] },
  { id: '5', roomNumber: '201', roomType: 'Single', floor: 2, capacity: 1, amenities: ['WiFi', 'AC'], currentStatus: 'Occupied', price: { single: 2500, double: 0, suite: 0 }, features: [] },
  { id: '6', roomNumber: '202', roomType: 'Double', floor: 2, capacity: 2, amenities: ['WiFi', 'AC', 'TV'], currentStatus: 'Clean', price: { single: 3500, double: 4500, suite: 0 }, features: [] },
  { id: '7', roomNumber: '203', roomType: 'Deluxe Suite', floor: 2, capacity: 4, amenities: ['WiFi', 'AC', 'TV', 'Balcony', 'Jacuzzi', 'Mini Bar'], currentStatus: 'Clean', price: { single: 15000, double: 15000, suite: 15000 }, features: ['Mountain View'] },
  { id: '8', roomNumber: '204', roomType: 'Penthouse', floor: 2, capacity: 4, amenities: ['WiFi', 'AC', 'TV', 'Balcony', 'Jacuzzi', 'Kitchen'], currentStatus: 'Clean', price: { single: 25000, double: 25000, suite: 25000 }, features: ['Top Floor', 'Skyline View'] },
];

export const ASSIGNMENTS_MOCK: RoomAssignment[] = [
  {
    id: 'A1',
    roomId: '1',
    reservationId: 'RES-101',
    guestId: 'G1',
    guestName: 'John Doe',
    checkInDate: new Date('2026-04-15'),
    checkOutDate: new Date('2026-04-19'),
    numberOfNights: 4,
    status: 'CheckedIn',
    rate: 2500,
    housekeepingStatus: 'Completed'
  },
  {
    id: 'A2',
    roomId: '2',
    reservationId: 'RES-102',
    guestId: 'G2',
    guestName: 'Jane Smith',
    checkInDate: new Date('2026-04-18'),
    checkOutDate: new Date('2026-04-20'),
    numberOfNights: 2,
    status: 'Booked',
    rate: 4500,
    housekeepingStatus: 'Inspected'
  },
  {
    id: 'A3',
    roomId: '5',
    reservationId: 'RES-103',
    guestId: 'G3',
    guestName: 'Mike Johnson',
    checkInDate: new Date('2026-04-16'),
    checkOutDate: new Date('2026-04-18'),
    numberOfNights: 2,
    status: 'CheckedIn',
    rate: 2500,
    housekeepingStatus: 'Pending'
  },
  {
    id: 'A4',
    roomId: '6',
    reservationId: 'RES-104',
    guestId: 'G4',
    guestName: 'Alice Brown',
    checkInDate: new Date('2026-04-20'),
    checkOutDate: new Date('2026-04-22'),
    numberOfNights: 2,
    status: 'Booked',
    rate: 3500,
    housekeepingStatus: 'Pending'
  }
];

export const MAINTENANCE_MOCK: MaintenanceBlock[] = [
  {
    id: 'M1',
    roomId: '4',
    blockType: 'Maintenance',
    startDate: new Date('2026-04-16'),
    endDate: new Date('2026-04-18'),
    reason: 'Plumbing leak in bathroom',
    priority: 'High',
    status: 'InProgress'
  }
];
