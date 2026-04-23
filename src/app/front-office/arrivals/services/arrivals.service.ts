import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Arrival, ArrivalFilters, ArrivalStatus, CheckInPayload, Room, RoomType, WalkInPayload } from '../models/arrival.model';
import { ARRIVALS_MOCK_DATA, ROOMS_MOCK_DATA } from '../arrivals-mock-data';

@Injectable({
  providedIn: 'root'
})
export class ArrivalsService {
  private arrivalsSubject = new BehaviorSubject<Arrival[]>(ARRIVALS_MOCK_DATA);
  arrivals$ = this.arrivalsSubject.asObservable();

  getArrivals(date: Date, filters?: ArrivalFilters): Observable<Arrival[]> {
    // In a real app, we would fetch for the specific date
    return this.arrivals$.pipe(
      delay(400),
      map(arrivals => {
        let filtered = [...arrivals];
        
        if (filters) {
          if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(a => 
              a.guestName.toLowerCase().includes(search) || 
              a.id.toLowerCase().includes(search) || 
              (a.roomNumber && a.roomNumber.includes(search)) ||
              a.phone.includes(search)
            );
          }
          
          if (filters.status && filters.status !== 'all') {
            filtered = filtered.filter(a => a.status === filters.status);
          }
          
          if (filters.roomType && filters.roomType !== 'all') {
            filtered = filtered.filter(a => a.roomType === filters.roomType);
          }
          
          if (filters.source && filters.source !== 'all') {
            filtered = filtered.filter(a => a.source === filters.source);
          }
        }
        
        return filtered;
      })
    );
  }

  checkIn(arrivalId: string, checkInData: CheckInPayload): Observable<void> {
    return of(null).pipe(
      delay(800),
      tap(() => {
        const current = this.arrivalsSubject.value;
        const index = current.findIndex(a => a.id === arrivalId);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = { 
            ...updated[index], 
            status: 'checked-in', 
            roomNumber: checkInData.roomNumber 
          };
          this.arrivalsSubject.next(updated);
        }
      }),
      map(() => void 0)
    );
  }

  assignRoom(arrivalId: string, roomNumber: string): Observable<void> {
    return of(null).pipe(
      delay(300),
      tap(() => {
        const current = this.arrivalsSubject.value;
        const index = current.findIndex(a => a.id === arrivalId);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = { ...updated[index], roomNumber };
          this.arrivalsSubject.next(updated);
        }
      }),
      map(() => void 0)
    );
  }

  markNoShow(arrivalId: string, _reason: string, _remarks?: string): Observable<void> {
    console.log('Marking no-show:', _reason, _remarks);
    return of(null).pipe(
      delay(500),
      tap(() => {
        const current = this.arrivalsSubject.value;
        const index = current.findIndex(a => a.id === arrivalId);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = { ...updated[index], status: 'no-show' };
          this.arrivalsSubject.next(updated);
        }
      }),
      map(() => void 0)
    );
  }

  createWalkIn(walkInData: WalkInPayload): Observable<Arrival> {
    const newArrival: Arrival = {
      id: `RES-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: `${walkInData.firstName} ${walkInData.lastName}`,
      guestId: `G-${Math.floor(100 + Math.random() * 900)}`,
      phone: walkInData.mobile,
      email: walkInData.email || '',
      roomNumber: walkInData.roomNumber,
      roomType: walkInData.roomType || 'Standard',
      ratePlan: walkInData.ratePlan,
      source: 'Walk-in',
      eta: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      checkIn: new Date(),
      checkOut: walkInData.checkOutDate,
      nights: walkInData.nights || 1,
      adults: walkInData.adults,
      children: walkInData.children,
      advancePaid: walkInData.ratePerNight || 0, // Using ratePerNight as a dummy if advance not provided
      totalAmount: walkInData.totalAmount || 0,
      status: 'checked-in',
      isVip: false,
      specialRequests: walkInData.specialRequests || '',
      idVerified: true,
      nationality: walkInData.nationality
    };

    return of(newArrival).pipe(
      delay(1000),
      tap(arrival => {
        const current = this.arrivalsSubject.value;
        this.arrivalsSubject.next([arrival, ...current]);
      })
    );
  }

  getAvailableRooms(roomType: RoomType, _checkIn: Date, _checkOut: Date): Observable<Room[]> {
    console.log('Fetching rooms:', _checkIn, _checkOut);
    return of(ROOMS_MOCK_DATA).pipe(
      delay(400),
      map(rooms => rooms.filter(r => r.type === roomType))
    );
  }

  updateArrivalStatus(arrivalId: string, status: ArrivalStatus): Observable<void> {
    return of(null).pipe(
      delay(300),
      tap(() => {
        const current = this.arrivalsSubject.value;
        const index = current.findIndex(a => a.id === arrivalId);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = { ...updated[index], status };
          this.arrivalsSubject.next(updated);
        }
      }),
      map(() => void 0)
    );
  }
}
