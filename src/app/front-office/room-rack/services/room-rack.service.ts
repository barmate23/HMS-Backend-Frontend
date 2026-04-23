import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Room, RoomAssignment, MaintenanceBlock, RoomStatus } from '../models/room-rack.model';
import { ROOMS_MOCK, ASSIGNMENTS_MOCK, MAINTENANCE_MOCK } from '../room-rack-mock-data';

@Injectable({
  providedIn: 'root'
})
export class RoomRackService {
  private roomsSubject = new BehaviorSubject<Room[]>(ROOMS_MOCK);
  private assignmentsSubject = new BehaviorSubject<RoomAssignment[]>(ASSIGNMENTS_MOCK);
  private maintenanceSubject = new BehaviorSubject<MaintenanceBlock[]>(MAINTENANCE_MOCK);

  rooms$ = this.roomsSubject.asObservable();
  assignments$ = this.assignmentsSubject.asObservable();
  maintenance$ = this.maintenanceSubject.asObservable();

  getRooms(): Observable<Room[]> {
    return this.rooms$.pipe(delay(500));
  }

  getAssignments(startDate: Date, endDate: Date): Observable<RoomAssignment[]> {
    return this.assignments$.pipe(
      delay(300),
      map(assignments => assignments.filter(a => {
        const checkIn = new Date(a.checkInDate);
        const checkOut = new Date(a.checkOutDate);
        return checkIn <= endDate && checkOut >= startDate;
      }))
    );
  }

  getMaintenanceBlocks(startDate: Date, endDate: Date): Observable<MaintenanceBlock[]> {
    return this.maintenance$.pipe(
      delay(300),
      map(blocks => blocks.filter(b => {
        const start = new Date(b.startDate);
        const end = new Date(b.endDate);
        return start <= endDate && end >= startDate;
      }))
    );
  }

  updateRoomStatus(roomId: string, status: RoomStatus): Observable<void> {
    return of(void 0).pipe(
      delay(500),
      tap(() => {
        const rooms = this.roomsSubject.value;
        const index = rooms.findIndex(r => r.id === roomId);
        if (index !== -1) {
          const updated = [...rooms];
          updated[index] = { ...updated[index], currentStatus: status };
          this.roomsSubject.next(updated);
        }
      })
    );
  }

  moveAssignment(assignmentId: string, newRoomId: string, newCheckIn?: Date, newCheckOut?: Date): Observable<void> {
    return of(void 0).pipe(
      delay(800),
      tap(() => {
        const assignments = this.assignmentsSubject.value;
        const index = assignments.findIndex(a => a.id === assignmentId);
        if (index !== -1) {
          const updated = [...assignments];
          updated[index] = { 
            ...updated[index], 
            roomId: newRoomId,
            ...(newCheckIn && { checkInDate: newCheckIn }),
            ...(newCheckOut && { checkOutDate: newCheckOut })
          };
          this.assignmentsSubject.next(updated);
        }
      })
    );
  }
}
