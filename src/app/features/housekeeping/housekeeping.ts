import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HotelService } from '../../services/hotel';

@Component({
  selector: 'app-housekeeping',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-surface-900">Housekeeping</h2>
          <p class="text-surface-500 text-sm">Monitor room status and manage cleaning tasks.</p>
        </div>
        <div class="flex space-x-3">
          <button class="bg-white border border-surface-200 text-surface-700 px-4 py-2 rounded-lg font-medium hover:bg-surface-50 transition-colors flex items-center">
            <mat-icon class="mr-2">print</mat-icon>
            Print Task List
          </button>
          <button class="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors flex items-center">
            <mat-icon class="mr-2">assignment</mat-icon>
            Assign Staff
          </button>
        </div>
      </div>

      <!-- Status Summary -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        @for (stat of statusSummary; track stat.label) {
          <div class="bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
            <p class="text-xs text-surface-500 font-medium uppercase tracking-wider">{{stat.label}}</p>
            <div class="flex items-end justify-between mt-1">
              <h4 class="text-xl font-bold text-surface-900">{{stat.count}}</h4>
              <mat-icon class="text-sm" [class]="stat.color">{{stat.icon}}</mat-icon>
            </div>
          </div>
        }
      </div>

      <!-- Room Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (room of hotelService.rooms(); track room.id) {
          <div class="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden group hover:border-brand-500 transition-all">
            <div class="p-5">
              <div class="flex items-center justify-between mb-4">
                <span class="text-lg font-bold text-surface-900">Room {{room.number}}</span>
                <span [class]="getRoomStatusClass(room.status)" class="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {{room.status}}
                </span>
              </div>
              
              <div class="space-y-3">
                <div class="flex items-center text-sm text-surface-500">
                  <mat-icon class="text-sm mr-2">king_bed</mat-icon>
                  {{room.type}}
                </div>
                <div class="flex items-center text-sm text-surface-500">
                  <mat-icon class="text-sm mr-2">layers</mat-icon>
                  Floor {{room.floor}}
                </div>
              </div>

              <div class="mt-6 pt-4 border-t border-surface-100 flex items-center justify-between">
                <div class="flex -space-x-2">
                  <div class="h-6 w-6 rounded-full bg-surface-200 border-2 border-white flex items-center justify-center text-[8px] font-bold">HK</div>
                </div>
                <div class="flex space-x-1">
                  @if (room.status === 'Dirty') {
                    <button 
                      (click)="hotelService.updateRoomStatus(room.id, 'Available')"
                      class="text-[10px] font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg hover:bg-brand-100 transition-colors"
                    >
                      MARK CLEAN
                    </button>
                  } @else if (room.status === 'Available') {
                    <button 
                      (click)="hotelService.updateRoomStatus(room.id, 'Dirty')"
                      class="text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors"
                    >
                      MARK DIRTY
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Housekeeping {
  hotelService = inject(HotelService);

  get statusSummary() {
    const stats = this.hotelService.stats();
    return [
      { label: 'Available', count: stats.available, icon: 'check_circle', color: 'text-green-500' },
      { label: 'Occupied', count: stats.occupied, icon: 'person', color: 'text-blue-500' },
      { label: 'Dirty', count: stats.dirty, icon: 'cleaning_services', color: 'text-orange-500' },
      { label: 'Maintenance', count: stats.maintenance, icon: 'build', color: 'text-red-500' },
      { label: 'Total', count: stats.total, icon: 'hotel', color: 'text-brand-500' },
    ];
  }

  getRoomStatusClass(status: string) {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700';
      case 'Occupied': return 'bg-blue-100 text-blue-700';
      case 'Dirty': return 'bg-orange-100 text-orange-700';
      case 'Maintenance': return 'bg-red-100 text-red-700';
      default: return 'bg-surface-100 text-surface-600';
    }
  }
}
