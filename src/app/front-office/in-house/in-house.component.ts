import { Component, OnInit, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { InHouseService } from './services/in-house.service';
import { InHouseGuest, ServiceRequest, RoomStatus, InHouseStats, RequestStatus } from './models/in-house.model';
import { InHouseDashboardComponent } from './components/in-house-dashboard/in-house-dashboard.component';
import { InHouseDirectoryComponent } from './components/in-house-directory/in-house-directory.component';
import { InHouseRequestsComponent } from './components/in-house-requests/in-house-requests.component';
import { InHouseRoomMapComponent } from './components/in-house-room-map/in-house-room-map.component';
import { NewRequestDialogComponent } from './components/new-request-dialog/new-request-dialog.component';

@Component({
  selector: 'app-in-house',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    InHouseDashboardComponent,
    InHouseDirectoryComponent,
    InHouseRequestsComponent,
    InHouseRoomMapComponent
  ],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
      <!-- Header -->
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div class="flex items-center gap-2 text-slate-400 mb-1">
            <mat-icon class="text-sm w-4 h-4">home</mat-icon>
            <span class="text-[10px] font-bold uppercase tracking-widest">Front Office</span>
            <mat-icon class="text-sm w-4 h-4">chevron_right</mat-icon>
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#1A3C5E]">In-House</span>
          </div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">In-House Management</h1>
          <p class="text-sm text-slate-500 font-medium">Real-time visibility into guest status, requests, and room conditions.</p>
        </div>

        <div class="flex items-center gap-3">
          <div class="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="text-xs font-bold text-slate-600 tabular-nums">{{currentTime() | date:'HH:mm:ss'}}</span>
          </div>
          
          <button (click)="openNewRequestDialog()" mat-flat-button class="!bg-[#1A3C5E] !text-white !font-bold !h-11 !px-6 !rounded-xl shadow-lg shadow-slate-200">
            <mat-icon class="mr-2">add</mat-icon>
            New Request
          </button>
        </div>
      </header>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-1 mb-8 overflow-x-auto no-scrollbar pb-2">
        @for (tab of mainTabs; track tab.id) {
          <button 
            (click)="activeTab.set(tab.id)"
            [class]="activeTab() === tab.id ? 'bg-[#1A3C5E] text-white shadow-lg shadow-slate-200' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'"
            class="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
          >
            <mat-icon class="text-lg">{{tab.icon}}</mat-icon>
            {{tab.label}}
          </button>
        }
      </div>

      <!-- Main Content Area -->
      <div class="relative min-h-[500px]">
        @if (isLoading()) {
          <div class="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-3xl">
            <div class="flex flex-col items-center gap-3">
              <div class="w-10 h-10 border-4 border-slate-100 border-t-[#1A3C5E] rounded-full animate-spin"></div>
              <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Updating View...</span>
            </div>
          </div>
        }

        @switch (activeTab()) {
          @case ('dashboard') {
            <app-in-house-dashboard 
              [stats]="stats()" 
              [recentRequests]="recentRequests()"
              (action)="onDashboardAction($event)"
              (viewRequest)="onViewRequest($event)"
              (markDone)="onMarkRequestDone($event)"
            ></app-in-house-dashboard>
          }
          @case ('directory') {
            <app-in-house-directory 
              [guests]="filteredGuests()"
              (guestSearch)="onSearch($event)"
              (guestFilter)="onFilter($event)"
              (viewProfile)="onViewProfile($event)"
            ></app-in-house-directory>
          }
          @case ('requests') {
            <app-in-house-requests 
              [requests]="filteredRequests()"
              [allRequests]="allRequests()"
              (tabChanged)="onRequestTabChanged($event)"
              (updateStatus)="onUpdateRequestStatus($event)"
            ></app-in-house-requests>
          }
          @case ('room-map') {
            <app-in-house-room-map 
              [rooms]="roomStatus()"
              (floorChanged)="onFloorChanged($event)"
              (viewRoom)="onViewRoom($event)"
            ></app-in-house-room-map>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InHouseComponent implements OnInit {
  private inHouseService = inject(InHouseService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  currentTime = signal(new Date());
  isLoading = signal(false);
  activeTab = signal<'dashboard' | 'directory' | 'requests' | 'room-map'>('dashboard');
  
  // Data Signals
  stats = signal<InHouseStats>({ totalGuests: 0, occupancyPercentage: 0, vipGuests: 0, pendingRequests: 0, criticalIssues: 0 });
  allGuests = signal<InHouseGuest[]>([]);
  allRequests = signal<ServiceRequest[]>([]);
  roomStatus = signal<RoomStatus[]>([]);
  
  // Filter Signals
  guestSearch = signal('');
  guestFilter = signal('all');
  requestStatusFilter = signal<RequestStatus | 'all'>('all');
  activeFloor = signal(1);

  mainTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'directory', label: 'Guest Directory', icon: 'group' },
    { id: 'requests', label: 'Service Queue', icon: 'assignment' },
    { id: 'room-map', label: 'Room Status Map', icon: 'map' }
  ] as const;

  recentRequests = computed(() => {
    return this.allRequests()
      .filter(r => r.status !== 'completed')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
  });

  filteredGuests = computed(() => {
    let guests = [...this.allGuests()];
    const search = this.guestSearch().toLowerCase();
    const filter = this.guestFilter();

    if (search) {
      guests = guests.filter(g => 
        g.guestName.toLowerCase().includes(search) || 
        g.roomNumber.includes(search)
      );
    }

    if (filter === 'vip') guests = guests.filter(g => g.isVip);
    if (filter === 'requests') guests = guests.filter(g => g.pendingRequestsCount > 0);
    if (filter === 'long-stay') guests = guests.filter(g => g.nightsRemaining >= 3);
    if (filter === 'departing') guests = guests.filter(g => g.nightsRemaining === 0);

    return guests;
  });

  filteredRequests = computed(() => {
    const status = this.requestStatusFilter();
    if (status === 'all') return this.allRequests();
    return this.allRequests().filter(r => r.status === status);
  });

  ngOnInit() {
    this.loadAllData();
    
    // Update time every second
    setInterval(() => this.currentTime.set(new Date()), 1000);
  }

  loadAllData() {
    this.isLoading.set(true);
    
    this.inHouseService.getStats().subscribe(s => this.stats.set(s));
    this.inHouseService.getGuests().subscribe(g => this.allGuests.set(g));
    this.inHouseService.getRequests().subscribe(r => this.allRequests.set(r));
    this.inHouseService.getRoomStatusMap(this.activeFloor()).subscribe(rs => {
      this.roomStatus.set(rs);
      this.isLoading.set(false);
    });
  }

  onDashboardAction(action: string) {
    switch (action) {
      case 'view-guests': this.activeTab.set('directory'); break;
      case 'manage-requests': this.activeTab.set('requests'); break;
      case 'room-map': this.activeTab.set('room-map'); break;
    }
  }

  onSearch(query: string) {
    this.guestSearch.set(query);
  }

  onFilter(filter: string) {
    this.guestFilter.set(filter);
  }

  onRequestTabChanged(status: RequestStatus | 'all') {
    this.requestStatusFilter.set(status);
  }

  onUpdateRequestStatus(event: {id: string, status: RequestStatus}) {
    this.isLoading.set(true);
    this.inHouseService.updateRequestStatus(event.id, event.status).subscribe(() => {
      this.loadAllData();
      this.snackBar.open(`Request status updated to ${event.status}`, 'Close', { duration: 2000 });
    });
  }

  onFloorChanged(floor: number) {
    this.activeFloor.set(floor);
    this.isLoading.set(true);
    this.inHouseService.getRoomStatusMap(floor).subscribe(rs => {
      this.roomStatus.set(rs);
      this.isLoading.set(false);
    });
  }

  onViewProfile(guest: InHouseGuest) {
    this.snackBar.open(`Opening profile for ${guest.guestName}`, 'Close', { duration: 2000 });
  }

  onViewRequest(request: ServiceRequest) {
    this.snackBar.open(`Viewing request: ${request.title}`, 'Close', { duration: 2000 });
  }

  onMarkRequestDone(request: ServiceRequest) {
    this.onUpdateRequestStatus({ id: request.id, status: 'completed' });
  }

  onViewRoom(room: RoomStatus) {
    if (room.guestName) {
      this.snackBar.open(`Room ${room.roomNumber}: ${room.guestName}`, 'Close', { duration: 2000 });
    } else {
      this.snackBar.open(`Room ${room.roomNumber} is ${room.status}`, 'Close', { duration: 2000 });
    }
  }

  openNewRequestDialog() {
    const dialogRef = this.dialog.open(NewRequestDialogComponent, {
      width: '400px',
      panelClass: 'hms-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(`✓ Request "${result.title}" created for Room ${result.roomNumber}`, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        // In a real app, we'd refresh the list here
        this.loadAllData();
      }
    });
  }
}
