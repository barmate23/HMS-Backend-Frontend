import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DashboardAnalyticsComponent } from '../../front-office/dashboard/analytics/dashboard-analytics.component';
import { DashboardService } from '../../services/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, DashboardAnalyticsComponent],
  template: `
    <div class="space-y-8">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-hms-text-primary dark:text-dark-text-primary">Front Office Dashboard</h1>
        <div class="flex gap-3">
          <button class="px-4 py-2 bg-hms-surface dark:bg-dark-surface border border-hms-border dark:border-dark-border rounded-xl text-xs font-bold hover:bg-hms-background transition-all">
            Export Report
          </button>
          <button 
            (click)="dashboardService.triggerRefresh()"
            class="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            Refresh Data
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        @for (kpi of kpis; track kpi.label) {
          <div class="bg-hms-surface dark:bg-dark-surface p-6 rounded-2xl border border-hms-border dark:border-dark-border shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <div class="flex items-center justify-between mb-4">
              <div [class]="kpi.bgClass" class="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg">
                <mat-icon class="text-sm">{{kpi.icon}}</mat-icon>
              </div>
              <span [class]="kpi.deltaClass" class="text-[10px] font-bold px-2 py-0.5 rounded-full">
                {{kpi.delta}}
              </span>
            </div>
            <p class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest mb-1">{{kpi.label}}</p>
            <h3 class="text-2xl font-bold text-hms-text-primary dark:text-dark-text-primary tabular-nums">{{kpi.value}}</h3>
          </div>
        }
      </div>

      <!-- Analytics Section -->
      <app-dashboard-analytics></app-dashboard-analytics>

      <div class="grid grid-cols-12 gap-8">
        <!-- Arrivals Widget -->
        <div class="col-span-12 lg:col-span-7 bg-hms-surface dark:bg-dark-surface rounded-2xl border border-hms-border dark:border-dark-border shadow-sm overflow-hidden">
          <div class="p-6 border-b border-hms-border dark:border-dark-border flex items-center justify-between">
            <div class="flex items-center gap-3">
              <h3 class="text-sm font-bold text-hms-text-primary dark:text-dark-text-primary">Today's Arrivals</h3>
              <span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">24 Pending</span>
            </div>
            <button class="text-xs font-bold text-primary hover:underline">View All</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-hms-background dark:bg-dark-background text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">
                  <th class="px-6 py-4">Guest Name</th>
                  <th class="px-6 py-4">Room Type</th>
                  <th class="px-6 py-4">ETA</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-hms-border dark:divide-dark-border">
                @for (arrival of arrivals; track arrival.name) {
                  <tr class="hover:bg-hms-background/50 dark:hover:bg-dark-background/50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex flex-col">
                        <span class="text-sm font-bold text-hms-text-primary dark:text-dark-text-primary">{{arrival.name}}</span>
                        <span class="text-[10px] text-hms-text-muted">RES-2024-{{arrival.id}}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-xs font-medium text-hms-text-muted">{{arrival.roomType}}</td>
                    <td class="px-6 py-4 text-xs font-bold text-hms-text-primary dark:text-dark-text-primary tabular-nums">{{arrival.eta}}</td>
                    <td class="px-6 py-4">
                      <span [class]="arrival.statusClass" class="px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {{arrival.status}}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button class="px-3 py-1.5 bg-success text-white rounded-lg text-[10px] font-bold hover:bg-success/90 transition-all">
                        Check In
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Departures Widget -->
        <div class="col-span-12 lg:col-span-5 bg-hms-surface dark:bg-dark-surface rounded-2xl border border-hms-border dark:border-dark-border shadow-sm overflow-hidden">
          <div class="p-6 border-b border-hms-border dark:border-dark-border flex items-center justify-between">
            <div class="flex items-center gap-3">
              <h3 class="text-sm font-bold text-hms-text-primary dark:text-dark-text-primary">Today's Departures</h3>
              <span class="px-2 py-0.5 bg-danger/10 text-danger text-[10px] font-bold rounded-full">12 Pending</span>
            </div>
            <button class="text-xs font-bold text-primary hover:underline">View All</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-hms-background dark:bg-dark-background text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">
                  <th class="px-6 py-4">Room</th>
                  <th class="px-6 py-4">Guest</th>
                  <th class="px-6 py-4">Balance</th>
                  <th class="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-hms-border dark:divide-dark-border">
                @for (departure of departures; track departure.room) {
                  <tr class="hover:bg-hms-background/50 dark:hover:bg-dark-background/50 transition-colors">
                    <td class="px-6 py-4 text-sm font-bold text-hms-text-primary dark:text-dark-text-primary tabular-nums">#{{departure.room}}</td>
                    <td class="px-6 py-4 text-sm font-medium text-hms-text-primary dark:text-dark-text-primary">{{departure.name}}</td>
                    <td class="px-6 py-4">
                      <span [class]="departure.balance > 0 ? 'text-danger' : 'text-success'" class="text-xs font-bold tabular-nums">
                        ₹{{departure.balance | number}}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button class="px-3 py-1.5 bg-secondary text-white rounded-lg text-[10px] font-bold hover:bg-secondary/90 transition-all">
                        Check Out
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    mat-icon { font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class Dashboard {
  dashboardService = inject(DashboardService);
  
  kpis = [
    { label: 'Arrivals', value: '24', icon: 'login', delta: '+4', deltaClass: 'bg-success/10 text-success', bgClass: 'bg-primary' },
    { label: 'Departures', value: '18', icon: 'logout', delta: '-2', deltaClass: 'bg-danger/10 text-danger', bgClass: 'bg-secondary' },
    { label: 'In-House', value: '143', icon: 'person', delta: '+12', deltaClass: 'bg-success/10 text-success', bgClass: 'bg-accent' },
    { label: 'Occupancy', value: '78%', icon: 'bed', delta: '+5%', deltaClass: 'bg-success/10 text-success', bgClass: 'bg-success' },
    { label: 'Available', value: '24', icon: 'door_open', delta: '-4', deltaClass: 'bg-danger/10 text-danger', bgClass: 'bg-warning' },
    { label: 'Revenue', value: '₹1.24L', icon: 'payments', delta: '+15%', deltaClass: 'bg-success/10 text-success', bgClass: 'bg-danger' },
  ];

  arrivals = [
    { id: '1024', name: 'John Doe', roomType: 'Deluxe King', eta: '14:30', status: 'Confirmed', statusClass: 'bg-success/10 text-success' },
    { id: '1025', name: 'Jane Smith', roomType: 'Standard Twin', eta: '15:45', status: 'Pending', statusClass: 'bg-warning/10 text-warning' },
    { id: '1026', name: 'Robert Brown', roomType: 'Executive Suite', eta: '12:00', status: 'VIP', statusClass: 'bg-accent/10 text-accent' },
    { id: '1027', name: 'Emily Davis', roomType: 'Deluxe King', eta: '18:20', status: 'Confirmed', statusClass: 'bg-success/10 text-success' },
  ];

  departures = [
    { room: '204', name: 'Michael Wilson', balance: 12500 },
    { room: '305', name: 'Sarah Miller', balance: 0 },
    { room: '108', name: 'David Garcia', balance: 4200 },
    { room: '412', name: 'Linda Martinez', balance: 0 },
  ];
}
