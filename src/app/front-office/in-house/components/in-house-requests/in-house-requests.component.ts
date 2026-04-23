import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ServiceRequest, RequestStatus } from '../../models/in-house.model';

@Component({
  selector: 'app-in-house-requests',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="space-y-6 animate-in fade-in duration-500">
      <!-- Tab Navigation -->
      <div class="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 w-fit shadow-sm">
        @for (tab of tabs; track tab.id) {
          <button 
            (click)="activeTab.set(tab.id); tabChanged.emit(tab.id)"
            [class]="activeTab() === tab.id ? 'bg-[#1A3C5E] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'"
            class="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2"
          >
            {{tab.label}}
            <span [class]="activeTab() === tab.id ? 'bg-white/20' : 'bg-slate-100'" class="px-2 py-0.5 rounded-lg text-[10px]">
              {{getTabCount(tab.id)}}
            </span>
          </button>
        }
      </div>

      <!-- Request Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        @for (request of requests; track request.id) {
          <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-[#1A3C5E] transition-all duration-300">
            <!-- Priority Indicator -->
            <div [class]="getPriorityBg(request.priority)" class="h-1.5 w-full"></div>
            
            <div class="p-6 flex-1 space-y-4">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div [class]="getTypeColor(request.type)" class="w-10 h-10 rounded-xl flex items-center justify-center">
                    <mat-icon>{{getTypeIcon(request.type)}}</mat-icon>
                  </div>
                  <div>
                    <h3 class="text-sm font-black text-slate-900 leading-tight">{{request.title}}</h3>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room {{request.roomNumber}} • {{request.guestName}}</p>
                  </div>
                </div>
                <span [class]="getPriorityBadgeClass(request.priority)" class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border">
                  {{request.priority}}
                </span>
              </div>

              <p class="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                {{request.description || 'No additional notes provided.'}}
              </p>

              <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Waiting</span>
                  <div class="flex items-center gap-1.5" [class.text-rose-500]="request.timeWaitingMinutes > 30">
                    <mat-icon class="!w-3.5 !h-3.5 !text-[14px]">schedule</mat-icon>
                    <span class="text-xs font-black tabular-nums">{{request.timeWaitingMinutes}}m</span>
                  </div>
                </div>

                <div class="flex flex-col items-end">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned To</span>
                  <span class="text-xs font-bold text-slate-700">{{request.assignedTo || 'Unassigned'}}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
              @if (request.status === 'pending') {
                <button (click)="updateStatus.emit({id: request.id, status: 'in-progress'})" class="flex-1 h-10 bg-[#1A3C5E] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#254e7a] transition-all">
                  Assign & Start
                </button>
              } @else if (request.status === 'in-progress') {
                <button (click)="updateStatus.emit({id: request.id, status: 'completed'})" class="flex-1 h-10 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all">
                  Mark Complete
                </button>
              } @else {
                <div class="flex-1 h-10 flex items-center justify-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                  <mat-icon class="text-sm">check_circle</mat-icon>
                  Resolved
                </div>
              }
              <button class="w-10 h-10 bg-white border border-slate-200 text-slate-400 rounded-xl flex items-center justify-center hover:text-[#1A3C5E] hover:border-[#1A3C5E] transition-all">
                <mat-icon class="text-lg">more_vert</mat-icon>
              </button>
            </div>
          </div>
        } @empty {
          <div class="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-200">
            <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <mat-icon class="text-4xl text-slate-200">assignment_turned_in</mat-icon>
            </div>
            <h3 class="text-xl font-black text-slate-900 mb-2">Queue is empty</h3>
            <p class="text-sm text-slate-500 max-w-xs mx-auto">All service requests for this category have been resolved. Great job!</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InHouseRequestsComponent {
  @Input() requests: ServiceRequest[] = [];
  @Input() allRequests: ServiceRequest[] = [];
  @Output() tabChanged = new EventEmitter<RequestStatus | 'all'>();
  @Output() updateStatus = new EventEmitter<{id: string, status: RequestStatus}>();

  activeTab = signal<RequestStatus | 'all'>('all');

  tabs: { id: RequestStatus | 'all', label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'escalated', label: 'Escalated' }
  ];

  getTabCount(id: string): number {
    if (id === 'all') return this.allRequests.length;
    return this.allRequests.filter(r => r.status === id).length;
  }

  getPriorityBg(priority: string): string {
    switch (priority) {
      case 'urgent': return 'bg-rose-500';
      case 'high': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'urgent': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'high': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'housekeeping': return 'cleaning_services';
      case 'maintenance': return 'build';
      case 'room-service': return 'restaurant';
      case 'concierge': return 'info';
      default: return 'help';
    }
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'housekeeping': return 'bg-purple-50 text-purple-600';
      case 'maintenance': return 'bg-orange-50 text-orange-600';
      case 'room-service': return 'bg-rose-50 text-rose-600';
      case 'concierge': return 'bg-indigo-50 text-indigo-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  }
}
