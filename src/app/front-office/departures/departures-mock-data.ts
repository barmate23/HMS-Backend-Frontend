import { Departure, DepartureStatus } from './models/departure.model';

const today = new Date();
today.setHours(0, 0, 0, 0);

export const DEPARTURES_MOCK_DATA: Departure[] = [
  {
    id: 'RES-2024-2001',
    guestName: 'John Doe',
    guestId: 'G-601',
    roomNumber: '301',
    roomType: 'Deluxe',
    checkIn: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
    checkOut: today,
    scheduledCheckoutTime: '11:00',
    status: 'pending',
    totalAmount: 25000,
    balanceDue: 5000,
    isVip: false,
    phone: '+91 9876543210',
    email: 'john.doe@example.com'
  },
  {
    id: 'RES-2024-2002',
    guestName: 'Jane Smith',
    guestId: 'G-602',
    roomNumber: '405',
    roomType: 'Suite',
    checkIn: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
    checkOut: today,
    scheduledCheckoutTime: '12:00',
    status: 'in-progress',
    totalAmount: 65000,
    balanceDue: 0,
    isVip: true,
    phone: '+1 415 555 0123',
    email: 'jane.smith@example.com'
  },
  {
    id: 'RES-2024-2003',
    guestName: 'Michael Brown',
    guestId: 'G-603',
    roomNumber: '102',
    roomType: 'Standard',
    checkIn: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
    checkOut: today,
    scheduledCheckoutTime: '10:30',
    status: 'completed',
    actualCheckoutTime: '10:15',
    totalAmount: 12000,
    balanceDue: 0,
    isVip: false,
    phone: '+91 9988776655',
    email: 'michael.b@example.com'
  },
  {
    id: 'RES-2024-2004',
    guestName: 'Emily Davis',
    guestId: 'G-604',
    roomNumber: '208',
    roomType: 'Deluxe',
    checkIn: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
    checkOut: today,
    scheduledCheckoutTime: '11:00',
    status: 'late',
    totalAmount: 32000,
    balanceDue: 12000,
    isVip: false,
    phone: '+91 9123456789',
    email: 'emily.d@example.com'
  },
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `RES-2024-20${i + 5}`,
    guestName: `Guest ${i + 5}`,
    guestId: `G-6${i + 5}`,
    roomNumber: `${500 + i}`,
    roomType: (['Standard', 'Deluxe', 'Suite'][i % 3]),
    checkIn: new Date(today.getTime() - (2 + (i % 3)) * 24 * 60 * 60 * 1000),
    checkOut: today,
    scheduledCheckoutTime: `${10 + (i % 3)}:00`,
    status: (['pending', 'completed', 'in-progress'][i % 3]) as DepartureStatus,
    totalAmount: 10000 + (i * 2000),
    balanceDue: i % 4 === 0 ? 2000 : 0,
    isVip: i % 7 === 0,
    phone: `+91 90000000${i + 5}`,
    email: `guest${i + 5}@example.com`
  }))
];
