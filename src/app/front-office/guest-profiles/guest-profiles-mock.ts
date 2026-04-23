import { GuestProfile } from './models/guest-profile.model';

export const GUESTS_MOCK: GuestProfile[] = [
  {
    id: 'G001',
    firstName: 'Marcus',
    lastName: 'Holloway',
    avatarUrl: 'https://i.pravatar.cc/150?u=marcus',
    phone: '+1 555-0123',
    email: 'marcus.h@techcorp.com',
    nationality: 'USA',
    flagUrl: 'https://flagcdn.com/w20/us.png',
    type: ['VIP', 'Repeat'],
    stayCount: 12,
    dateOfBirth: new Date('1988-06-12'),
    gender: 'Male',
    preferredLanguage: 'English',
    address: '123 Tech Lane',
    city: 'San Francisco',
    country: 'USA',
    loyalty: {
      tier: 'Platinum',
      points: 12500,
      lifetimeSpend: 45000,
      totalNights: 34
    },
    preferences: {
      room: ['High Floor', 'Quiet Room', 'King Bed'],
      service: ['Airport Pickup', 'Late Check-Out', 'Sparkling Water']
    },
    documents: [
      { id: 'D1', type: 'Passport', uploadDate: new Date('2024-01-10'), expiryDate: new Date('2029-01-10') },
      { id: 'D2', type: 'Driver License', uploadDate: new Date('2023-05-15'), expiryDate: new Date('2027-05-15') }
    ],
    stayHistory: [
      { reservationId: 'RES-8821', checkIn: new Date('2025-12-20'), checkOut: new Date('2025-12-25'), roomNumber: '1204', roomType: 'Deluxe Suite', totalBill: 2500, status: 'Completed' },
      { reservationId: 'RES-7712', checkIn: new Date('2025-08-10'), checkOut: new Date('2025-08-15'), roomNumber: '901', roomType: 'Premium Double', totalBill: 1800, status: 'Completed' }
    ],
    billingHistory: [
      { invoiceId: 'INV-1001', reservationId: 'RES-8821', amount: 2500, method: 'Credit Card', status: 'Paid', date: new Date('2025-12-25') },
      { invoiceId: 'INV-1002', reservationId: 'RES-7712', amount: 1800, method: 'PayPal', status: 'Paid', date: new Date('2025-08-15') }
    ],
    notes: [
      { id: 'N1', staffName: 'Robert Wilson', content: 'Guest prefers room away from elevator.', timestamp: new Date('2025-12-20'), isPinned: true },
      { id: 'N2', staffName: 'Sarah Jenkins', content: 'Birthday surprise arranged during last stay.', timestamp: new Date('2025-12-23') }
    ]
  },
  {
    id: 'G002',
    firstName: 'Elena',
    lastName: 'Fisher',
    avatarUrl: 'https://i.pravatar.cc/150?u=elena',
    phone: '+44 20-7946-0958',
    email: 'elena.f@journalism.co.uk',
    nationality: 'United Kingdom',
    flagUrl: 'https://flagcdn.com/w20/gb.png',
    type: ['Corporate'],
    stayCount: 5,
    dateOfBirth: new Date('1992-03-24'),
    gender: 'Female',
    preferredLanguage: 'English',
    address: '45 Baker St',
    city: 'London',
    country: 'UK',
    loyalty: {
      tier: 'Gold',
      points: 4200,
      lifetimeSpend: 12000,
      totalNights: 15
    },
    preferences: {
      room: ['Non-Smoking', 'Balcony'],
      service: ['Breakfast in Room', 'Morning Paper']
    },
    documents: [
      { id: 'D3', type: 'National ID', uploadDate: new Date('2024-02-01'), expiryDate: new Date('2030-02-01') }
    ],
    stayHistory: [
      { reservationId: 'RES-6651', checkIn: new Date('2026-01-15'), checkOut: new Date('2026-01-20'), roomNumber: '402', roomType: 'Standard Double', totalBill: 1200, status: 'Completed' }
    ],
    billingHistory: [
      { invoiceId: 'INV-2001', reservationId: 'RES-6651', amount: 1200, method: 'Bank Transfer', status: 'Paid', date: new Date('2026-01-20') }
    ],
    notes: [
      { id: 'N3', staffName: 'James Bond', content: 'Often travels for work.', timestamp: new Date('2026-01-15') }
    ]
  },
  {
    id: 'G003',
    firstName: 'Satoshi',
    lastName: 'Nakamoto',
    avatarUrl: 'https://i.pravatar.cc/150?u=satoshi',
    phone: '+81 3-1234-5678',
    email: 'satosh@p2p.jp',
    nationality: 'Japan',
    flagUrl: 'https://flagcdn.com/w20/jp.png',
    type: ['Blacklisted'],
    stayCount: 1,
    dateOfBirth: new Date('1975-01-01'),
    gender: 'Male',
    preferredLanguage: 'Japanese',
    address: 'Shibuya 2-chome',
    city: 'Tokyo',
    country: 'Japan',
    loyalty: {
      tier: 'None',
      points: 0,
      lifetimeSpend: 500,
      totalNights: 2
    },
    preferences: {
      room: [],
      service: []
    },
    documents: [],
    stayHistory: [],
    billingHistory: [
      { invoiceId: 'INV-3001', reservationId: 'RES-5501', amount: 500, method: 'BTC', status: 'Refunded', date: new Date('2024-05-22') }
    ],
    notes: [
      { id: 'N4', staffName: 'System', content: 'Card declined multiple times. Blacklisted for security reasons.', timestamp: new Date('2024-05-22'), isPinned: true }
    ]
  }
];
