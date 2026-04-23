import { Component, OnInit, ChangeDetectionStrategy, signal, computed, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { Arrival, ArrivalFilters, ArrivalStatus } from './models/arrival.model';
import { ArrivalsService } from './services/arrivals.service';
import { ArrivalsStatsStripComponent } from './components/arrivals-stats-strip/arrivals-stats-strip.component';
import { ArrivalsFilterBarComponent } from './components/arrivals-filter-bar/arrivals-filter-bar.component';
import { ArrivalsTableComponent } from './components/arrivals-table/arrivals-table.component';
import { CheckInPanelComponent } from './components/check-in-panel/check-in-panel.component';
import { WalkInPanelComponent } from './components/walk-in-panel/walk-in-panel.component';
import { NoShowDialogComponent } from './components/no-show-dialog/no-show-dialog.component';

@Component({
  selector: 'app-arrivals',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTabsModule, 
    MatDatepickerModule, 
    MatInputModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule,
    ArrivalsStatsStripComponent,
    ArrivalsFilterBarComponent,
    ArrivalsTableComponent,
    CheckInPanelComponent,
    WalkInPanelComponent
  ],
  template: `
    <div class="min-h-screen bg-[#F8FAFC]">
      <!-- TOP BAR: Property Context & User Info -->
      <div class="h-14 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded transition-colors">
            <div class="w-8 h-8 bg-[#1A3C5E] rounded flex items-center justify-center text-white font-bold text-sm">LS</div>
            <div class="flex flex-col">
              <span class="text-xs font-bold text-[#1A3C5E] leading-none">LuxeStay HMS</span>
              <span class="text-[10px] text-slate-500 font-medium">Grand Plaza, New York</span>
            </div>
            <mat-icon class="text-slate-400 text-sm">unfold_more</mat-icon>
          </div>
          
          <div class="h-6 w-[1px] bg-slate-200"></div>
          
          <nav class="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span class="hover:text-[#1A3C5E] cursor-pointer">Front Office</span>
            <mat-icon class="text-[14px] w-auto h-auto">chevron_right</mat-icon>
            <span class="text-[#1A3C5E] font-bold">Arrivals</span>
          </nav>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg">
            <div class="flex flex-col items-end">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Date</span>
              <span class="text-xs font-bold text-slate-700 tabular-nums">{{selectedDate() | date:'dd MMM yyyy'}}</span>
            </div>
            <div class="h-6 w-[1px] bg-slate-200"></div>
            <div class="flex flex-col items-start">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shift</span>
              <span class="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Morning (07:00 - 15:00)
              </span>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button mat-icon-button class="text-slate-400 hover:text-slate-600">
              <mat-icon>notifications_none</mat-icon>
            </button>
            <div class="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm cursor-pointer overflow-hidden">
              <img src="https://picsum.photos/seed/user/32/32" alt="User" referrerpolicy="no-referrer">
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 space-y-6 max-w-[1600px] mx-auto">
        <!-- SECTION 1: PAGE HEADER ROW -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-[#1A3C5E] tracking-tight">Today's Arrivals</h1>
            <p class="text-sm text-slate-500 font-medium">Manage and process guest check-ins for today.</p>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="relative group">
              <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-[#1A3C5E] transition-colors">search</mat-icon>
              <input 
                type="text" 
                placeholder="Search Guest, Res#, Room..." 
                class="h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#1A3C5E] focus:ring-2 focus:ring-[#1A3C5E]/10 w-64 transition-all"
                (input)="onSearchInput($event)"
              >
            </div>

            <button mat-stroked-button class="h-10 !rounded-lg !border-slate-200 !bg-white !text-slate-600 !font-bold hover:!bg-slate-50" (click)="picker.open()">
              <mat-icon class="mr-2 text-slate-400">calendar_today</mat-icon>
              {{selectedDate() | date:'MMM d, yyyy'}}
              <input matInput [matDatepicker]="picker" [value]="selectedDate()" (dateChange)="onDateChange($event.value)" class="hidden">
              <mat-datepicker #picker></mat-datepicker>
            </button>
            
            <button mat-stroked-button class="h-10 !rounded-lg !border-slate-200 !bg-white !text-slate-600 !font-bold hover:!bg-slate-50" (click)="printList()">
              <mat-icon class="mr-2 text-slate-400">print</mat-icon>
              Print List
            </button>
            
            <button mat-flat-button class="h-10 !rounded-lg !bg-[#1A3C5E] !text-white !font-bold shadow-md shadow-slate-200 hover:!bg-[#142e4a] transition-all" (click)="isWalkInPanelOpen.set(true)">
              <mat-icon class="mr-2">add</mat-icon>
              Walk-in Reservation
            </button>
          </div>
        </div>

        <!-- Date mismatch banner -->
        @if (!isToday()) {
          <div class="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between text-amber-800 text-xs font-bold animate-in fade-in slide-in-from-top-2">
            <div class="flex items-center gap-2">
              <mat-icon class="text-amber-500">info</mat-icon>
              <span>Viewing arrivals for {{selectedDate() | date:'MMM d, yyyy'}}</span>
            </div>
            <button mat-button class="!text-xs !font-bold !text-amber-700 hover:!bg-amber-100" (click)="backToToday()">[Back to Today]</button>
          </div>
        }

        <!-- SECTION 2: STATS STRIP -->
        <app-arrivals-stats-strip 
          [counts]="statsCounts()" 
          (statClicked)="onStatClicked($event)">
        </app-arrivals-stats-strip>

        <!-- SECTION 3: FILTER BAR & TABS -->
        <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div class="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
            <app-arrivals-filter-bar (filtersChanged)="onFiltersChanged($event)"></app-arrivals-filter-bar>
          </div>
          
          <div class="px-4">
            <mat-tab-group [selectedIndex]="activeTabIndex()" (selectedIndexChange)="onTabChange($event)" class="arrivals-tabs">
              <mat-tab label="All Arrivals ({{totalCount()}})"></mat-tab>
              <mat-tab label="Pending ({{pendingCount()}})"></mat-tab>
              <mat-tab label="Confirmed ({{confirmedCount()}})"></mat-tab>
              <mat-tab label="Checked In ({{checkedInCount()}})"></mat-tab>
              <mat-tab label="No Show ({{noShowCount()}})"></mat-tab>
            </mat-tab-group>
          </div>

          <!-- SECTION 4: ARRIVALS TABLE -->
          <div class="relative">
            <app-arrivals-table 
              [arrivals]="filteredArrivals()"
              (checkIn)="onCheckIn($event)"
              (assignRoom)="onAssignRoom($event)"
              (markNoShow)="onMarkNoShow($event)"
              (reinstate)="onReinstate($event)"
              (clearFilters)="onClearFilters()"
              (sort)="onSort($event)">
            </app-arrivals-table>
          </div>
        </div>
      </div>
    </div>

    <!-- PANELS -->
    @if (isCheckInPanelOpen()) {
      <app-check-in-panel 
        [arrival]="selectedArrival()!" 
        (dismiss)="isCheckInPanelOpen.set(false)"
        (success)="onCheckInSuccess()">
      </app-check-in-panel>
    }

    @if (isWalkInPanelOpen()) {
      <app-walk-in-panel 
        (dismiss)="isWalkInPanelOpen.set(false)"
        (completed)="onWalkInSuccess()">
      </app-walk-in-panel>
    }
  `,
  styles: [`
    :host { display: block; background-color: #F8FAFC; min-height: 100vh; }
    ::ng-deep .arrivals-tabs .mat-mdc-tab-header { --mdc-tab-indicator-active-indicator-color: #1A3C5E; }
    ::ng-deep .arrivals-tabs .mat-mdc-tab .mdc-tab__text-label { font-size: 13px; font-weight: 600; color: #64748B; }
    ::ng-deep .arrivals-tabs .mat-mdc-tab.mdc-tab--active .mdc-tab__text-label { color: #1A3C5E; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrivalsComponent implements OnInit {
  private arrivalsService = inject(ArrivalsService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Signals for state management
  arrivals = signal<Arrival[]>([]);
  selectedDate = signal<Date>(new Date());
  filters = signal<ArrivalFilters>({ search: '', status: 'all', roomType: 'all', source: 'all' });
  activeTab = signal<ArrivalStatus | 'all'>('all');
  
  isCheckInPanelOpen = signal(false);
  isWalkInPanelOpen = signal(false);
  selectedArrival = signal<Arrival | null>(null);

  // Computed values
  isToday = computed(() => {
    const today = new Date();
    const selected = this.selectedDate();
    return today.getDate() === selected.getDate() &&
           today.getMonth() === selected.getMonth() &&
           today.getFullYear() === selected.getFullYear();
  });

  filteredArrivals = computed(() => {
    let list = this.arrivals();
    const f = this.filters();
    const tab = this.activeTab();

    // Tab filter (overrides status filter if not 'all')
    if (tab !== 'all') {
      list = list.filter(a => a.status === tab);
    } else if (f.status !== 'all') {
      list = list.filter(a => a.status === f.status);
    }

    // Other filters
    if (f.search) {
      const search = f.search.toLowerCase();
      list = list.filter(a => 
        a.guestName.toLowerCase().includes(search) || 
        a.id.toLowerCase().includes(search) || 
        (a.roomNumber && a.roomNumber.includes(search))
      );
    }

    if (f.roomType !== 'all') {
      list = list.filter(a => a.roomType === f.roomType);
    }

    if (f.source !== 'all') {
      list = list.filter(a => a.source === f.source);
    }

    return list;
  });

  statsCounts = computed(() => {
    const list = this.arrivals();
    return {
      total: list.length,
      checkedIn: list.filter(a => a.status === 'checked-in').length,
      pending: list.filter(a => a.status === 'pending' || a.status === 'confirmed' || a.status === 'vip').length,
      noShow: list.filter(a => a.status === 'no-show').length
    };
  });

  // Tab counts (always reflect totals for the date)
  totalCount = computed(() => this.arrivals().length);
  pendingCount = computed(() => this.arrivals().filter(a => a.status === 'pending').length);
  confirmedCount = computed(() => this.arrivals().filter(a => a.status === 'confirmed').length);
  checkedInCount = computed(() => this.arrivals().filter(a => a.status === 'checked-in').length);
  noShowCount = computed(() => this.arrivals().filter(a => a.status === 'no-show').length);

  activeTabIndex = computed(() => {
    const tab = this.activeTab();
    switch (tab) {
      case 'all': return 0;
      case 'pending': return 1;
      case 'confirmed': return 2;
      case 'checked-in': return 3;
      case 'no-show': return 4;
      default: return 0;
    }
  });

  ngOnInit() {
    this.loadArrivals();
  }

  loadArrivals() {
    this.arrivalsService.getArrivals(this.selectedDate()).subscribe(data => {
      this.arrivals.set(data);
    });
  }

  onDateChange(date: Date | null) {
    if (date) {
      this.selectedDate.set(date);
      this.loadArrivals();
    }
  }

  backToToday() {
    this.onDateChange(new Date());
  }

  onFiltersChanged(filters: ArrivalFilters) {
    this.filters.set(filters);
  }

  onStatClicked(status: ArrivalStatus | 'all') {
    this.activeTab.set(status);
  }

  onTabChange(index: number) {
    const statuses: (ArrivalStatus | 'all')[] = ['all', 'pending', 'confirmed', 'checked-in', 'no-show'];
    this.activeTab.set(statuses[index]);
  }

  onSort(sort: Sort) {
    const data = [...this.arrivals()];
    if (!sort.active || sort.direction === '') {
      this.arrivals.set(data);
      return;
    }

    data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'guest': return this.compare(a.guestName, b.guestName, isAsc);
        case 'room': return this.compare(a.roomNumber || '', b.roomNumber || '', isAsc);
        case 'roomType': return this.compare(a.roomType, b.roomType, isAsc);
        case 'eta': return this.compare(a.eta, b.eta, isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
    this.arrivals.set(data);
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onCheckIn(arrival: Arrival) {
    this.selectedArrival.set(arrival);
    this.isCheckInPanelOpen.set(true);
  }

  onCheckInSuccess() {
    this.isCheckInPanelOpen.set(false);
    this.loadArrivals();
  }

  onWalkInSuccess() {
    this.isWalkInPanelOpen.set(false);
    this.loadArrivals();
  }

  onAssignRoom(arrival: Arrival) {
    // For now, reuse check-in panel or open room selector directly
    this.onCheckIn(arrival);
  }

  onMarkNoShow(arrival: Arrival) {
    const dialogRef = this.dialog.open(NoShowDialogComponent, {
      width: '400px',
      data: { arrival }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.arrivalsService.markNoShow(arrival.id, result.reason, result.remarks).subscribe(() => {
          this.snackBar.open(`${arrival.guestName} marked as No-Show. Cancellation charge applied.`, 'Close', { duration: 3000 });
          this.loadArrivals();
        });
      }
    });
  }

  onReinstate(arrival: Arrival) {
    this.arrivalsService.updateArrivalStatus(arrival.id, 'pending').subscribe(() => {
      this.snackBar.open(`${arrival.guestName} reservation reinstated.`, 'Close', { duration: 3000 });
      this.loadArrivals();
    });
  }

  onClearFilters() {
    this.filters.set({ search: '', status: 'all', roomType: 'all', source: 'all' });
    this.activeTab.set('all');
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filters.update(f => ({ ...f, search: value }));
  }

  printList() {
    window.print();
  }

  @HostListener('keydown.escape')
  onEscape() {
    this.isCheckInPanelOpen.set(false);
    this.isWalkInPanelOpen.set(false);
  }

  @HostListener('keydown.control.f', ['$event'])
  onCtrlF(event: Event) {
    if (event instanceof KeyboardEvent) {
      event.preventDefault();
    }
    // Focus search input logic would go here
  }
}
