import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { InHouseGuest, ServiceRequest, RoomStatus, Interaction, InHouseStats, RequestStatus, InHouseFilters } from '../models/in-house.model';
import { IN_HOUSE_GUESTS_MOCK, SERVICE_REQUESTS_MOCK, ROOM_STATUS_MAP_MOCK, INTERACTIONS_MOCK } from '../in-house-mock-data';

@Injectable({
  providedIn: 'root'
})
export class InHouseService {
  private guestsSubject = new BehaviorSubject<InHouseGuest[]>(IN_HOUSE_GUESTS_MOCK);
  private requestsSubject = new BehaviorSubject<ServiceRequest[]>(SERVICE_REQUESTS_MOCK);
  private roomStatusSubject = new BehaviorSubject<RoomStatus[]>(ROOM_STATUS_MAP_MOCK);
  private interactionsSubject = new BehaviorSubject<Interaction[]>(INTERACTIONS_MOCK);

  guests$ = this.guestsSubject.asObservable();
  requests$ = this.requestsSubject.asObservable();
  roomStatus$ = this.roomStatusSubject.asObservable();
  interactions$ = this.interactionsSubject.asObservable();

  getStats(): Observable<InHouseStats> {
    return this.guests$.pipe(
      map(guests => {
        const requests = this.requestsSubject.value;
        return {
          totalGuests: guests.length,
          occupancyPercentage: 75, // Mock value
          vipGuests: guests.filter(g => g.isVip).length,
          pendingRequests: requests.filter(r => r.status === 'pending').length,
          criticalIssues: guests.filter(g => g.status === 'issue').length
        };
      })
    );
  }

  getGuests(filters?: InHouseFilters): Observable<InHouseGuest[]> {
    return this.guests$.pipe(
      delay(300),
      map(guests => {
        if (!filters) return guests;
        let filtered = [...guests];
        if (filters.search) {
          const s = filters.search.toLowerCase();
          filtered = filtered.filter(g => 
            g.guestName.toLowerCase().includes(s) || 
            g.roomNumber.includes(s) || 
            g.phone.includes(s)
          );
        }
        if (filters.vipOnly) {
          filtered = filtered.filter(g => g.isVip);
        }
        return filtered;
      })
    );
  }

  getRequests(status?: RequestStatus | 'all'): Observable<ServiceRequest[]> {
    return this.requests$.pipe(
      delay(300),
      map(requests => {
        if (!status || status === 'all') return requests;
        return requests.filter(r => r.status === status);
      })
    );
  }

  updateRequestStatus(id: string, status: RequestStatus): Observable<void> {
    return of(null).pipe(
      delay(400),
      tap(() => {
        const current = this.requestsSubject.value;
        const index = current.findIndex(r => r.id === id);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = { ...updated[index], status };
          this.requestsSubject.next(updated);
        }
      }),
      map(() => void 0)
    );
  }

  getRoomStatusMap(floor?: number): Observable<RoomStatus[]> {
    return this.roomStatus$.pipe(
      map(rooms => {
        if (!floor) return rooms;
        return rooms.filter(r => r.floor === floor);
      })
    );
  }

  getGuestInteractions(guestId: string): Observable<Interaction[]> {
    return this.interactions$.pipe(
      map(interactions => interactions.filter(i => i.guestId === guestId))
    );
  }
}
