import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Departure, DepartureFilters, DepartureStatus } from '../models/departure.model';
import { DEPARTURES_MOCK_DATA } from '../departures-mock-data';

@Injectable({
  providedIn: 'root'
})
export class DeparturesService {
  private departuresSubject = new BehaviorSubject<Departure[]>(DEPARTURES_MOCK_DATA);
  departures$ = this.departuresSubject.asObservable();

  getDepartures(date: Date, filters?: DepartureFilters): Observable<Departure[]> {
    return this.departures$.pipe(
      delay(400),
      map(departures => {
        let filtered = [...departures];
        
        if (filters) {
          if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(d => 
              d.guestName.toLowerCase().includes(search) || 
              d.id.toLowerCase().includes(search) || 
              d.roomNumber.includes(search)
            );
          }
          
          if (filters.status && filters.status !== 'all') {
            filtered = filtered.filter(d => d.status === filters.status);
          }
          
          if (filters.roomType && filters.roomType !== 'all') {
            filtered = filtered.filter(d => d.roomType === filters.roomType);
          }
        }
        
        return filtered;
      })
    );
  }

  updateDepartureStatus(id: string, status: DepartureStatus): Observable<void> {
    return of(null).pipe(
      delay(500),
      tap(() => {
        const current = this.departuresSubject.value;
        const index = current.findIndex(d => d.id === id);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = { 
            ...updated[index], 
            status,
            actualCheckoutTime: status === 'completed' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : updated[index].actualCheckoutTime
          };
          this.departuresSubject.next(updated);
        }
      }),
      map(() => void 0)
    );
  }

  completeCheckOut(id: string): Observable<void> {
    return this.updateDepartureStatus(id, 'completed');
  }
}
