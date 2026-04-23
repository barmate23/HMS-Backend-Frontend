import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RoomAssignment, Room } from '../../models/room-rack.model';

@Component({
  selector: 'app-housekeeping-queue',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="h-full bg-slate-50 border-l border-slate-200 p-6 flex flex-col space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-black text-[#1B3A5C] tracking-tight">Housekeeping Queue</h2>
        <span class="bg-[#1B3A5C] text-white text-[10px] font-black px-2 py-0.5 rounded-lg">{{dirtyRooms.length}}</span>
      </div>

      <div class="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        @for (room of dirtyRooms; track room.id) {
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-300 transition-colors group">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="text-sm font-black text-slate-900 leading-none mb-1">Room {{room.roomNumber}}</h3>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{room.roomType}}</p>
              </div>
              <span [class]="getPriorityClass(room)" class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border">
                {{getPriority(room)}}
              </span>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <div class="w-1 h-1 rounded-full bg-slate-300"></div>
                <p class="text-[11px] text-slate-500 font-medium">Last Guest: {{getLastGuest(room.id)}}</p>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-1 h-1 rounded-full bg-slate-300"></div>
                <p class="text-[11px] text-slate-500 font-medium">Assigned: {{getStaff()}}</p>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button (click)="housekeepingAction.emit({ action: 'start', room })" class="flex-1 h-8 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
                Start
              </button>
              <button (click)="housekeepingAction.emit({ action: 'complete', room })" class="flex-1 h-8 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                Mark Clean
              </button>
            </div>
          </div>
        } @empty {
          <div class="text-center py-10">
            <mat-icon class="text-4xl text-slate-200 mb-2">check_circle</mat-icon>
            <p class="text-xs font-bold text-slate-400">All rooms are clean!</p>
          </div>
        }
      </div>

      <!-- Quick Stats -->
      <div class="mt-auto pt-6 border-t border-slate-200">
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-white p-3 rounded-xl border border-slate-100">
            <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Time</p>
            <p class="text-sm font-black text-[#1B3A5C]">24m</p>
          </div>
          <div class="bg-white p-3 rounded-xl border border-slate-100">
            <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Staff Online</p>
            <p class="text-sm font-black text-[#1B3A5C]">8</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 4px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HousekeepingQueueComponent {
  @Input() dirtyRooms: Room[] = [];
  @Input() assignments: RoomAssignment[] = [];
  @Output() housekeepingAction = new EventEmitter<{ action: 'start' | 'complete', room: Room }>();

  getPriority(room: Room): string {
    // Mock logic: suites are urgent
    return room.roomType === 'Suite' || room.roomType === 'Penthouse' ? 'URGENT' : 'NORMAL';
  }

  getPriorityClass(room: Room): string {
    return this.getPriority(room) === 'URGENT' 
      ? 'bg-rose-50 text-rose-600 border-rose-100' 
      : 'bg-amber-50 text-amber-600 border-amber-100';
  }

  getLastGuest(roomId: string): string {
    const a = this.assignments.find(asgn => asgn.roomId === roomId && asgn.status === 'CheckedOut');
    return a ? a.guestName : 'N/A';
  }

  getStaff(): string {
    return 'Unassigned';
  }
}
