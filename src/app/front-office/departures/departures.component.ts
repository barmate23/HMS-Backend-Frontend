import { Component, OnInit, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
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

import { Departure, DepartureFilters, DepartureStatus } from './models/departure.model';
import { DeparturesService } from './services/departures.service';
import { DeparturesStatsStripComponent } from './components/departures-stats-strip/departures-stats-strip.component';
import { DeparturesFilterBarComponent } from './components/departures-filter-bar/departures-filter-bar.component';
import { DeparturesTableComponent } from './components/departures-table/departures-table.component';
import { CheckOutPanelComponent } from './components/check-out-panel/check-out-panel.component';

@Component({
  selector: 'app-departures',
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
    DeparturesStatsStripComponent,
    DeparturesFilterBarComponent,
    DeparturesTableComponent,
    CheckOutPanelComponent
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
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#1A3C5E]">Departures</span>
          </div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Departures Dashboard</h1>
          <p class="text-sm text-slate-500 font-medium">Manage guest check-outs, billing, and room audits for today.</p>
        </div>

        <div class="flex items-center gap-3">
          <div class="bg-white border border-slate-200 rounded-xl p-1 flex items-center shadow-sm">
            <button mat-icon-button class="!w-8 !h-8 !leading-8 text-slate-400" (click)="changeDate(-1)">
              <mat-icon class="text-lg">chevron_left</mat-icon>
            </button>
            <div class="px-3 flex flex-col items-center min-w-[120px]">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Check-out Date</span>
              <span class="text-xs font-bold text-slate-700">{{selectedDate() | date:'dd MMM, yyyy'}}</span>
            </div>
            <button mat-icon-button class="!w-8 !h-8 !leading-8 text-slate-400" (click)="changeDate(1)">
              <mat-icon class="text-lg">chevron_right</mat-icon>
            </button>
          </div>
          
          <button mat-flat-button class="!bg-[#1A3C5E] !text-white !font-bold !h-11 !px-6 !rounded-xl shadow-lg shadow-slate-200">
            <mat-icon class="mr-2">print</mat-icon>
            Daily Report
          </button>
        </div>
      </header>

      <!-- Stats Strip -->
      <app-departures-stats-strip 
        [counts]="stats()" 
        (statClicked)="onStatFilter($event)"
        class="mb-8"
      ></app-departures-stats-strip>

      <!-- Main Content Area -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <!-- Filter Bar & Tabs -->
        <div class="px-6 py-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/30">
          <div class="flex items-center gap-1">
            @for (tab of tabs; track tab.id) {
              <button 
                (click)="activeTab.set(tab.id)"
                [class]="activeTab() === tab.id ? 'bg-[#1A3C5E] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'"
                class="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200"
              >
                {{tab.label}}
                <span class="ml-1.5 opacity-60 text-[10px]">{{getTabCount(tab.id)}}</span>
              </button>
            }
          </div>

          <app-departures-filter-bar (filtersChanged)="onFiltersChanged($event)"></app-departures-filter-bar>
        </div>

        <!-- Table Area -->
        <div class="relative min-h-[400px]">
          @if (isLoading()) {
            <div class="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <div class="flex flex-col items-center gap-3">
                <div class="w-10 h-10 border-4 border-slate-100 border-t-[#1A3C5E] rounded-full animate-spin"></div>
                <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Departures...</span>
              </div>
            </div>
          }

          <app-departures-table 
            [departures]="filteredDepartures()"
            (checkOut)="onCheckOut($event)"
            (viewDetails)="onViewDetails($event)"
            (clearFilters)="resetFilters()"
            (sort)="onSort($event)"
          ></app-departures-table>
        </div>

        <!-- Pagination/Footer -->
        <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Showing {{filteredDepartures().length}} of {{departures().length}} Departures
          </span>
          <div class="flex items-center gap-2">
            <button mat-icon-button disabled class="text-slate-300"><mat-icon>chevron_left</mat-icon></button>
            <button mat-icon-button class="text-slate-600"><mat-icon>chevron_right</mat-icon></button>
          </div>
        </div>
      </div>

      <!-- Check-out Panel -->
      @if (selectedDeparture()) {
        <app-check-out-panel
          [departure]="selectedDeparture()!"
          (dismiss)="selectedDeparture.set(null)"
          (success)="onCheckOutSuccess()"
        ></app-check-out-panel>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeparturesComponent implements OnInit {
  private departuresService = inject(DeparturesService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  departures = signal<Departure[]>([]);
  isLoading = signal(false);
  selectedDate = signal(new Date());
  activeTab = signal<'all' | 'pending' | 'completed' | 'late'>('all');
  filters = signal<DepartureFilters>({ search: '', status: 'all', roomType: 'all' });
  sortState = signal<Sort>({ active: 'room', direction: 'asc' });
  selectedDeparture = signal<Departure | null>(null);

  tabs = [
    { id: 'all', label: 'All Departures' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Checked Out' },
    { id: 'late', label: 'Late' }
  ] as const;

  stats = computed(() => {
    const data = this.departures();
    return {
      total: data.length,
      completed: data.filter(d => d.status === 'completed').length,
      pending: data.filter(d => d.status === 'pending' || d.status === 'in-progress').length,
      late: data.filter(d => d.status === 'late').length
    };
  });

  filteredDepartures = computed(() => {
    let data = [...this.departures()];
    const f = this.filters();
    const tab = this.activeTab();

    // Tab filtering
    if (tab !== 'all') {
      if (tab === 'pending') {
        data = data.filter(d => d.status === 'pending' || d.status === 'in-progress');
      } else {
        data = data.filter(d => d.status === tab);
      }
    }

    // Filter bar filtering
    if (f.status !== 'all') {
      data = data.filter(d => d.status === f.status);
    }
    if (f.roomType !== 'all') {
      data = data.filter(d => d.roomType === f.roomType);
    }
    if (f.search) {
      const s = f.search.toLowerCase();
      data = data.filter(d => 
        d.guestName.toLowerCase().includes(s) || 
        d.id.toLowerCase().includes(s) || 
        d.roomNumber.includes(s)
      );
    }

    // Sorting
    const sort = this.sortState();
    if (sort.direction) {
      data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'room': return this.compare(a.roomNumber, b.roomNumber, isAsc);
          case 'guest': return this.compare(a.guestName, b.guestName, isAsc);
          case 'scheduledTime': return this.compare(a.scheduledCheckoutTime, b.scheduledCheckoutTime, isAsc);
          case 'balance': return this.compare(a.balanceDue, b.balanceDue, isAsc);
          case 'status': return this.compare(a.status, b.status, isAsc);
          default: return 0;
        }
      });
    }

    return data;
  });

  ngOnInit() {
    this.loadDepartures();
  }

  loadDepartures() {
    this.isLoading.set(true);
    this.departuresService.getDepartures(this.selectedDate()).subscribe(data => {
      this.departures.set(data);
      this.isLoading.set(false);
    });
  }

  changeDate(days: number) {
    const current = this.selectedDate();
    const next = new Date(current.getTime() + days * 24 * 60 * 60 * 1000);
    this.selectedDate.set(next);
    this.loadDepartures();
  }

  onFiltersChanged(filters: DepartureFilters) {
    this.filters.set(filters);
  }

  onStatFilter(status: DepartureStatus | 'all') {
    if (status === 'all') {
      this.activeTab.set('all');
    } else if (status === 'pending' || status === 'in-progress') {
      this.activeTab.set('pending');
    } else if (status === 'completed') {
      this.activeTab.set('completed');
    } else if (status === 'late') {
      this.activeTab.set('late');
    }
  }

  onSort(sort: Sort) {
    this.sortState.set(sort);
  }

  onCheckOut(departure: Departure) {
    this.selectedDeparture.set(departure);
  }

  onCheckOutSuccess() {
    this.selectedDeparture.set(null);
    this.loadDepartures();
  }

  onViewDetails(departure: Departure) {
    this.snackBar.open(`Viewing details for ${departure.guestName}`, 'Close', { duration: 2000 });
  }

  resetFilters() {
    this.filters.set({ search: '', status: 'all', roomType: 'all' });
    this.activeTab.set('all');
  }

  getTabCount(tabId: string): number {
    const data = this.departures();
    if (tabId === 'all') return data.length;
    if (tabId === 'pending') return data.filter(d => d.status === 'pending' || d.status === 'in-progress').length;
    return data.filter(d => d.status === tabId).length;
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
