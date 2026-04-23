import { Injectable, signal, computed } from '@angular/core';

export type RoomStatus = 'Available' | 'Occupied' | 'Dirty' | 'Maintenance' | 'Inspected';
export type RoomType = 'Single' | 'Double' | 'Suite' | 'Deluxe';
export type GuestType = 'New' | 'Repeat' | 'VIP';
export type RoomPlan = 'EP' | 'CP' | 'MAP' | 'AP';
export type PaymentMode = 'Cash' | 'Card' | 'UPI' | 'BTC';

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  status: RoomStatus;
  price: number;
  floor: number;
}

export interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestType: GuestType;
  companyName?: string;
  roomId: string;
  roomType: RoomType;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  status: 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';
  plan: RoomPlan;
  tariff: number;
  tax: number;
  totalAmount: number;
  advance: number;
  paymentMode: PaymentMode;
}

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  rooms = signal<Room[]>([
    { id: '1', number: '101', type: 'Single', status: 'Available', price: 100, floor: 1 },
    { id: '2', number: '102', type: 'Double', status: 'Occupied', price: 150, floor: 1 },
    { id: '3', number: '103', type: 'Suite', status: 'Dirty', price: 300, floor: 1 },
    { id: '4', number: '104', type: 'Deluxe', status: 'Available', price: 200, floor: 1 },
    { id: '5', number: '201', type: 'Single', status: 'Maintenance', price: 100, floor: 2 },
    { id: '6', number: '202', type: 'Double', status: 'Available', price: 150, floor: 2 },
    { id: '7', number: '203', type: 'Suite', status: 'Occupied', price: 300, floor: 2 },
    { id: '8', number: '204', type: 'Deluxe', status: 'Available', price: 200, floor: 2 },
  ]);

  reservations = signal<Reservation[]>([
    { 
      id: 'RES-1001', 
      guestName: 'John Doe', 
      guestEmail: 'john@example.com',
      guestPhone: '+1 555-0101',
      guestType: 'Repeat',
      roomId: '2', 
      roomType: 'Double',
      checkIn: new Date('2026-03-24'), 
      checkOut: new Date('2026-03-27'), 
      adults: 2,
      children: 0,
      status: 'CheckedIn', 
      plan: 'CP',
      tariff: 150,
      tax: 45,
      totalAmount: 495,
      advance: 100,
      paymentMode: 'Card'
    },
    { 
      id: 'RES-1002', 
      guestName: 'Jane Smith', 
      guestEmail: 'jane@example.com',
      guestPhone: '+1 555-0102',
      guestType: 'VIP',
      roomId: '7', 
      roomType: 'Suite',
      checkIn: new Date('2026-03-25'), 
      checkOut: new Date('2026-03-28'), 
      adults: 2,
      children: 1,
      status: 'CheckedIn', 
      plan: 'MAP',
      tariff: 300,
      tax: 90,
      totalAmount: 990,
      advance: 200,
      paymentMode: 'UPI'
    },
    { 
      id: 'RES-1003', 
      guestName: 'Alice Johnson', 
      guestEmail: 'alice@example.com',
      guestPhone: '+1 555-0103',
      guestType: 'New',
      roomId: '4', 
      roomType: 'Deluxe',
      checkIn: new Date('2026-03-26'), 
      checkOut: new Date('2026-03-29'), 
      adults: 1,
      children: 0,
      status: 'Confirmed', 
      plan: 'EP',
      tariff: 200,
      tax: 60,
      totalAmount: 660,
      advance: 0,
      paymentMode: 'Cash'
    },
  ]);

  isRoomAvailable(roomId: string, checkIn: Date, checkOut: Date): boolean {
    return !this.reservations().some(res => {
      if (res.roomId !== roomId || res.status === 'Cancelled') return false;
      return (checkIn < res.checkOut && checkOut > res.checkIn);
    });
  }

  getAvailableRooms(checkIn: Date, checkOut: Date): Room[] {
    return this.rooms().filter(room => this.isRoomAvailable(room.id, checkIn, checkOut));
  }

  stats = computed(() => {
    const allRooms = this.rooms();
    const occupied = allRooms.filter(r => r.status === 'Occupied').length;
    const available = allRooms.filter(r => r.status === 'Available').length;
    const dirty = allRooms.filter(r => r.status === 'Dirty').length;
    const maintenance = allRooms.filter(r => r.status === 'Maintenance').length;
    
    const occupancyRate = (occupied / allRooms.length) * 100;
    
    // Mock trend data for charts
    const revenueTrend = [
      { date: '2026-03-19', value: 4200 },
      { date: '2026-03-20', value: 3800 },
      { date: '2026-03-21', value: 5100 },
      { date: '2026-03-22', value: 4600 },
      { date: '2026-03-23', value: 5900 },
      { date: '2026-03-24', value: 6200 },
      { date: '2026-03-25', value: 5800 },
    ];

    const occupancyTrend = [
      { date: '2026-03-19', value: 65 },
      { date: '2026-03-20', value: 72 },
      { date: '2026-03-21', value: 85 },
      { date: '2026-03-22', value: 78 },
      { date: '2026-03-23', value: 92 },
      { date: '2026-03-24', value: 88 },
      { date: '2026-03-25', value: 75 },
    ];

    const roomTypeDistribution = [
      { label: 'Single', value: 15 },
      { label: 'Double', value: 25 },
      { label: 'Suite', value: 10 },
      { label: 'Deluxe', value: 20 },
    ];
    
    return {
      total: allRooms.length,
      occupied,
      available,
      dirty,
      maintenance,
      occupancyRate: Math.round(occupancyRate),
      revenueTrend,
      occupancyTrend,
      roomTypeDistribution,
      totalRevenue: 35700,
      avgDailyRate: 185,
      revPAR: 138
    };
  });

  updateRoomStatus(roomId: string, status: RoomStatus) {
    this.rooms.update(rooms => rooms.map(r => r.id === roomId ? { ...r, status } : r));
  }

  addReservation(reservation: Reservation) {
    this.reservations.update(res => [...res, reservation]);
  }
}
