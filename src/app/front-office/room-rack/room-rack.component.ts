import { Component, OnInit, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { RoomRackService } from './services/room-rack.service';
import { Room, RoomAssignment, MaintenanceBlock, RoomRackFilters, RoomStatus } from './models/room-rack.model';
import { RoomRackFilterToolbarComponent } from './components/filter-toolbar/filter-toolbar.component';
import { RoomRackGridComponent } from './components/room-rack-grid/room-rack-grid.component';
import { HousekeepingQueueComponent } from './components/housekeeping-queue/housekeeping-queue.component';

@Component({
  selector: 'app-room-rack',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    RoomRackFilterToolbarComponent,
    RoomRackGridComponent,
    HousekeepingQueueComponent
  ],
  template: `
    <div class="h-screen flex flex-col bg-[#F8FAFC]">
      <!-- Header -->
      <header class="bg-[#1B3A5C] text-white px-8 py-4 flex items-center justify-between shrink-0">
        <div>
          <div class="flex items-center gap-2 text-white/50 mb-1">
            <mat-icon class="text-xs w-4 h-4">dashboard</mat-icon>
            <span class="text-[9px] font-black uppercase tracking-widest">LuxeStay HMS</span>
            <mat-icon class="text-xs w-4 h-4">chevron_right</mat-icon>
            <span class="text-[9px] font-black uppercase tracking-widest text-white">Room Rack</span>
          </div>
          <h1 class="text-2xl font-black tracking-tight">Room Rack & Tape Chart</h1>
        </div>

        <div class="flex items-center gap-6">
          <div class="flex items-center gap-6 pr-6 border-r border-white/10">
            <div class="flex flex-col items-end">
              <span class="text-[9px] font-black text-white/50 uppercase tracking-widest">Occupancy</span>
              <span class="text-xl font-black text-white tabular-nums">{{occupancyRate()}}%</span>
            </div>
            <div class="flex flex-col items-end">
              <span class="text-[9px] font-black text-white/50 uppercase tracking-widest">Revenue Today</span>
              <span class="text-xl font-black text-[#FF8C42] tabular-nums">{{totalRevenueToday() | currency}}</span>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button mat-flat-button class="!bg-[#FF8C42] !text-white !font-bold" (click)="onNewReservation()">
              <mat-icon class="mr-1">add</mat-icon>
              New Reservation
            </button>
            <button mat-icon-button class="!text-white/70 hover:!text-white" (click)="refreshData()">
              <mat-icon>refresh</mat-icon>
            </button>
            <button mat-icon-button class="!text-white/70 hover:!text-white" (click)="toggleSidebar()">
              <mat-icon>{{sidebarOpen() ? 'vertical_split' : 'menu_open'}}</mat-icon>
            </button>
          </div>
        </div>
      </header>

      <!-- Filter Toolbar -->
      <app-room-rack-filter-toolbar 
        [currentDays]="daysToShow()"
        (filtersChanged)="onFiltersChanged($event)"
        (daysChanged)="onDaysChanged($event)"
        (goToToday)="onGoToToday()"
      ></app-room-rack-filter-toolbar>

      <!-- Main Layout -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Tape Chart Grid -->
        <main class="flex-1 overflow-hidden relative">
          @if (isLoading()) {
            <div class="absolute inset-0 bg-white/60 z-30 flex items-center justify-center backdrop-blur-[1px]">
              <div class="flex flex-col items-center gap-3">
                <div class="w-10 h-10 border-4 border-slate-100 border-t-[#1B3A5C] rounded-full animate-spin"></div>
                <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Syncing Grid...</span>
              </div>
            </div>
          }

          <app-room-rack-grid
            [rooms]="filteredRooms()"
            [assignments]="assignments()"
            [blocks]="blocks()"
            [dates]="gridDates()"
            (viewDetails)="onViewDetails($event)"
            (reassign)="onReassign($event)"
          ></app-room-rack-grid>
        </main>

        <!-- Right Sidebars -->
        <aside 
          [class.w-0]="!sidebarOpen()" 
          [class.w-80]="sidebarOpen()"
          class="shrink-0 transition-all duration-300 overflow-hidden border-l border-slate-200"
        >
          <app-housekeeping-queue
            [dirtyRooms]="dirtyRooms()"
            [assignments]="assignments()"
            (housekeepingAction)="onHousekeepingAction($event)"
          ></app-housekeeping-queue>
        </aside>
      </div>

      <!-- Footer / Legend -->
      <footer class="bg-white border-t border-slate-200 px-8 py-3 shrink-0 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></div>
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Occupied</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></div>
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Booked</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-200"></div>
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dirty</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-slate-300 shadow-sm shadow-slate-100"></div>
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Clean</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-purple-500 shadow-sm shadow-purple-200"></div>
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Maintenance</span>
          </div>
        </div>

        <div class="text-[10px] font-bold text-slate-400">
          Last updated: 2 mins ago • Auto-sync enabled
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; overflow: hidden; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomRackComponent implements OnInit {
  private service = inject(RoomRackService);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(false);
  sidebarOpen = signal(true);
  
  // Data Signals
  rooms = signal<Room[]>([]);
  assignments = signal<RoomAssignment[]>([]);
  blocks = signal<MaintenanceBlock[]>([]);
  
  // View State
  startDate = signal(new Date('2026-04-17'));
  daysToShow = signal<7 | 14 | 30>(7);
  
  // Filter Signals
  activeFilters = signal<Partial<RoomRackFilters>>({});

  // Dynamic Stats
  occupancyRate = computed(() => {
    const total = this.rooms().length;
    if (total === 0) return 0;
    const occupied = this.rooms().filter(r => r.currentStatus === 'Occupied').length;
    return Math.round((occupied / total) * 100);
  });

  totalRevenueToday = computed(() => {
    const today = new Date('2026-04-17');
    return this.assignments()
      .filter(a => {
        const checkIn = new Date(a.checkInDate);
        const checkOut = new Date(a.checkOutDate);
        return today >= checkIn && today < checkOut && (a.status === 'CheckedIn' || a.status === 'Booked');
      })
      .reduce((sum, a) => sum + a.rate, 0);
  });

  gridDates = computed(() => {
    const dates: Date[] = [];
    const start = this.startDate();
    const normalizedStart = new Date(start);
    normalizedStart.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < this.daysToShow(); i++) {
      const d = new Date(normalizedStart);
      d.setDate(normalizedStart.getDate() + i);
      dates.push(d);
    }
    return dates;
  });

  filteredRooms = computed(() => {
    let r = [...this.rooms()];
    const f = this.activeFilters();

    if (f.search) {
      const s = f.search.toLowerCase();
      r = r.filter(room => {
        const matchesRoom = room.roomNumber.toLowerCase().includes(s);
        const matchesGuest = this.assignments().some(a => 
          a.roomId === room.id && a.guestName.toLowerCase().includes(s)
        );
        return matchesRoom || matchesGuest;
      });
    }

    if (f.floors && f.floors.length > 0) {
      r = r.filter(room => f.floors?.includes(room.floor));
    }

    if (f.roomTypes && f.roomTypes.length > 0) {
      r = r.filter(room => f.roomTypes?.includes(room.roomType));
    }

    return r;
  });

  dirtyRooms = computed(() => {
    return this.rooms().filter(r => r.currentStatus === 'Dirty');
  });

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.isLoading.set(true);
    const end = new Date(this.startDate());
    end.setDate(end.getDate() + this.daysToShow());

    this.service.getRooms().subscribe(data => this.rooms.set(data));
    this.service.getAssignments(this.startDate(), end).subscribe(data => this.assignments.set(data));
    this.service.getMaintenanceBlocks(this.startDate(), end).subscribe(data => {
      this.blocks.set(data);
      this.isLoading.set(false);
    });
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  onFiltersChanged(f: Partial<RoomRackFilters>) {
    this.activeFilters.set(f);
  }

  onDaysChanged(days: 7 | 14 | 30) {
    this.daysToShow.set(days);
    this.refreshData();
  }

  onGoToToday() {
    this.startDate.set(new Date('2026-04-17'));
    this.refreshData();
  }

  onNewReservation() {
    this.snackBar.open('Opening New Reservation dialog...', 'Close', { duration: 2000 });
  }

  onViewDetails(a: RoomAssignment) {
    this.snackBar.open(`Opening details for ${a.guestName}...`, 'Close', { duration: 2000 });
  }

  onReassign(event: { assignment: RoomAssignment, room: Room }) {
    this.snackBar.open(`Opening Move Room dialog for ${event.assignment.guestName}...`, 'Close', { duration: 2000 });
  }

  onHousekeepingAction(event: { action: 'start' | 'complete', room: Room }) {
    const { action, room } = event;
    const msg = action === 'start' ? `Cleaning started for Room ${room.roomNumber}` : `Room ${room.roomNumber} marked as Clean`;
    
    this.isLoading.set(true);
    // If completed, set to Clean. If started, maybe keep as Dirty or set to a new status.
    // In our model, we'll use 'Dirty' for 'started' and 'Clean' for 'complete'.
    const newStatus: RoomStatus = action === 'complete' ? 'Clean' : 'Dirty'; 
    
    this.service.updateRoomStatus(room.id, newStatus).subscribe(() => {
      this.refreshData();
      this.snackBar.open(msg, 'Close', { duration: 2000 });
    });
  }
}
