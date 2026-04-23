import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { InHouseStats, ServiceRequest } from '../../models/in-house.model';

@Component({
  selector: 'app-in-house-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-8 animate-in fade-in duration-500">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <mat-icon>apartment</mat-icon>
            </div>
            <span class="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
              {{stats.occupancyPercentage}}% Occupancy
            </span>
          </div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Total Guests</p>
          <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{stats.totalGuests}}</h3>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <mat-icon>stars</mat-icon>
            </div>
            <span class="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
              High Priority
            </span>
          </div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">VIP Guests</p>
          <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{stats.vipGuests}}</h3>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <mat-icon>assignment</mat-icon>
            </div>
            <span class="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
              Action Required
            </span>
          </div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Pending Requests</p>
          <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{stats.pendingRequests}}</h3>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
              <mat-icon>error_outline</mat-icon>
            </div>
            <span class="px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
              Critical
            </span>
          </div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Issues / Alerts</p>
          <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{stats.criticalIssues}}</h3>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Recent Activity Feed -->
        <div class="lg:col-span-2 space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h2>
            <button (click)="viewAllActivity.emit()" class="text-xs font-bold text-[#1A3C5E] hover:underline">View All</button>
          </div>

          <div class="space-y-4">
            @for (request of recentRequests; track request.id) {
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 group hover:border-[#1A3C5E] transition-all duration-300">
                <div [class]="getPriorityClass(request.priority)" class="w-1.5 h-12 rounded-full shrink-0"></div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-black text-[#1A3C5E] uppercase tracking-tighter">Room {{request.roomNumber}}</span>
                    <span class="text-xs font-bold text-slate-900 truncate">{{request.guestName}}</span>
                  </div>
                  <h4 class="text-sm font-bold text-slate-700 mb-1">{{request.title}}</h4>
                  <div class="flex items-center gap-3">
                    <span class="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <mat-icon class="!w-3 !h-3 !text-[12px]">schedule</mat-icon>
                      {{request.timeWaitingMinutes}}m ago
                    </span>
                    <span [class]="getStatusClass(request.status)" class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border">
                      {{request.status}}
                    </span>
                  </div>
                </div>

                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button (click)="viewRequest.emit(request)" class="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-[#1A3C5E] hover:text-white transition-all">
                    <mat-icon class="text-lg">visibility</mat-icon>
                  </button>
                  <button (click)="markDone.emit(request)" class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                    <mat-icon class="text-lg">check</mat-icon>
                  </button>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="space-y-6">
          <h2 class="text-xl font-black text-slate-900 tracking-tight">Quick Actions</h2>
          <div class="grid grid-cols-1 gap-4">
            <button (click)="action.emit('view-guests')" class="w-full h-16 bg-[#1A3C5E] text-white rounded-2xl flex items-center px-6 gap-4 shadow-lg shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <mat-icon>group</mat-icon>
              <div class="text-left">
                <p class="text-xs font-black uppercase tracking-widest">View All Guests</p>
                <p class="text-[10px] opacity-70 font-medium">Manage current in-house directory</p>
              </div>
            </button>

            <button (click)="action.emit('manage-requests')" class="w-full h-16 bg-white border border-slate-200 text-slate-700 rounded-2xl flex items-center px-6 gap-4 hover:border-[#1A3C5E] hover:text-[#1A3C5E] transition-all">
              <mat-icon>assignment</mat-icon>
              <div class="text-left">
                <p class="text-xs font-black uppercase tracking-widest">Manage Requests</p>
                <p class="text-[10px] text-slate-400 font-medium">Service queue and dispatch</p>
              </div>
            </button>

            <button (click)="action.emit('room-map')" class="w-full h-16 bg-white border border-slate-200 text-slate-700 rounded-2xl flex items-center px-6 gap-4 hover:border-[#1A3C5E] hover:text-[#1A3C5E] transition-all">
              <mat-icon>map</mat-icon>
              <div class="text-left">
                <p class="text-xs font-black uppercase tracking-widest">Room Status Map</p>
                <p class="text-[10px] text-slate-400 font-medium">Visual floor plan overview</p>
              </div>
            </button>
          </div>

          <!-- Quick Tip -->
          <div class="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
            <div class="flex items-center gap-2 mb-2 text-indigo-600">
              <mat-icon class="text-lg">lightbulb</mat-icon>
              <span class="text-xs font-black uppercase tracking-widest">Pro Tip</span>
            </div>
            <p class="text-xs text-indigo-700 font-medium leading-relaxed">
              VIP guests in rooms 201 and 408 have requested early breakfast. Ensure kitchen is notified.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InHouseDashboardComponent {
  @Input() stats: InHouseStats = { totalGuests: 0, occupancyPercentage: 0, vipGuests: 0, pendingRequests: 0, criticalIssues: 0 };
  @Input() recentRequests: ServiceRequest[] = [];
  
  @Output() viewAllActivity = new EventEmitter<void>();
  @Output() viewRequest = new EventEmitter<ServiceRequest>();
  @Output() markDone = new EventEmitter<ServiceRequest>();
  @Output() action = new EventEmitter<string>();

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'urgent': return 'bg-rose-500';
      case 'high': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'in-progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  }
}
