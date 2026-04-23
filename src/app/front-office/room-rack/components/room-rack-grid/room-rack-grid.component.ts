import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Room, RoomAssignment, MaintenanceBlock } from '../../models/room-rack.model';

@Component({
  selector: 'app-room-rack-grid',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule],
  template: `
    <div class="overflow-x-auto bg-white" #scrollContainer>
      <div class="min-w-max">
        <!-- Timeline Header -->
        <div class="flex border-b border-slate-200 bg-slate-50/50 sticky top-0 z-20">
          <div class="w-[200px] border-r border-slate-200 p-4 shrink-0 flex items-center justify-between sticky left-0 bg-slate-50 z-30 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)]">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room Information</span>
            <mat-icon class="text-xs text-slate-300">import_export</mat-icon>
          </div>
          <div class="flex">
            @for (date of dates; track date.getTime()) {
              <div class="w-[140px] px-3 py-4 border-r border-slate-200 flex flex-col items-center justify-center gap-1 transition-colors"
                [class.bg-orange-50/50]="isToday(date)">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{{date | date:'EEE'}}</span>
                <span class="text-sm font-black text-slate-900 leading-none">{{date | date:'dd MMM'}}</span>
                @if (isToday(date)) {
                  <span class="text-[8px] font-black text-orange-600 uppercase tracking-widest">Today</span>
                }
              </div>
            }
          </div>
        </div>

        <!-- Grid Body -->
        <div class="relative min-h-[400px]">
          @for (room of rooms; track room.id) {
            <div class="flex border-b border-slate-100 h-20 group hover:bg-slate-50/30 transition-colors">
              <!-- Room Info Cell -->
              <div class="w-[200px] border-r border-slate-200 p-4 shrink-0 flex flex-col justify-center sticky left-0 bg-white z-20 group-hover:bg-slate-50 transition-colors shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-lg font-black text-[#1B3A5C] tracking-tighter">{{room.roomNumber}}</span>
                  <span class="px-1.5 py-0.5 rounded bg-slate-100 text-[8px] font-black text-slate-500 uppercase tracking-widest">{{room.roomType}}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div [class]="getStatusDotClass(room.currentStatus)" class="w-1.5 h-1.5 rounded-full"></div>
                  <span class="text-[9px] font-medium text-slate-400 uppercase tracking-wider">{{room.currentStatus}}</span>
                </div>
              </div>

              <!-- Reservation Grid Area -->
              <div class="flex relative">
                <!-- Vertical Day Separators -->
                @for (date of dates; track date.getTime()) {
                  <div class="w-[140px] border-r border-slate-100 h-full shrink-0"></div>
                }

                <!-- Assignments Layer -->
                <div class="absolute inset-0 z-10">
                  @for (assignment of getRoomAssignments(room.id); track assignment.id) {
                    <div 
                      [style.left.px]="getLeftOffset(assignment.checkInDate)"
                      [style.width.px]="getWidth(assignment.checkInDate, assignment.checkOutDate)"
                      [class]="getAssignmentClass(assignment)"
                      class="absolute top-1/2 -translate-y-1/2 h-14 rounded-xl p-2.5 border-2 shadow-sm flex flex-col justify-center cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden"
                      [matMenuTriggerFor]="assignmentMenu"
                      [matMenuTriggerData]="{ assignment: assignment, room: room }"
                      (contextmenu)="$event.preventDefault(); assignmentMenuTrigger.openMenu()"
                      #assignmentMenuTrigger="matMenuTrigger"
                    >
                      <div class="flex items-center justify-between mb-0.5">
                        <span class="text-[10px] font-black uppercase tracking-tighter truncate">{{assignment.guestName}}</span>
                        <mat-icon class="text-xs !w-4 !h-4 opacity-50">{{getStatusIcon(assignment.status)}}</mat-icon>
                      </div>
                      <div class="flex items-center gap-3">
                        <span class="text-[9px] font-medium opacity-70 flex items-center gap-1">
                          <mat-icon class="!w-2.5 !h-2.5 !text-[10px]">login</mat-icon>
                          {{assignment.checkInDate | date:'HH:mm'}}
                        </span>
                        <span class="text-[9px] font-medium opacity-70 flex items-center gap-1">
                          <mat-icon class="!w-2.5 !h-2.5 !text-[10px]">logout</mat-icon>
                          {{assignment.checkOutDate | date:'HH:mm'}}
                        </span>
                      </div>
                    </div>
                  }

                  @for (block of getRoomBlocks(room.id); track block.id) {
                    <div 
                      [style.left.px]="getLeftOffset(block.startDate)"
                      [style.width.px]="getWidth(block.startDate, block.endDate)"
                      class="absolute top-1/2 -translate-y-1/2 h-14 rounded-xl p-2.5 border-2 border-purple-200 bg-purple-50 text-purple-700 shadow-sm flex items-center gap-3 cursor-pointer opacity-70"
                    >
                      <mat-icon class="text-purple-400">build</mat-icon>
                      <div class="flex flex-col">
                        <span class="text-[10px] font-black uppercase tracking-widest">{{block.blockType}}</span>
                        <span class="text-[9px] font-medium truncate opacity-80">{{block.reason}}</span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          } @empty {
            <div class="flex flex-col items-center justify-center py-20 bg-white">
              <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <mat-icon class="text-3xl text-slate-200">search_off</mat-icon>
              </div>
              <h3 class="text-lg font-black text-slate-900 mb-1">No rooms found</h3>
              <p class="text-xs text-slate-400 font-medium">Try adjusting your filters or search terms</p>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Assignment Context Menu -->
    <mat-menu #assignmentMenu="matMenu" class="hms-context-menu">
      <ng-template matMenuContent let-assignment="assignment" let-room="room">
        <div class="px-4 py-2 border-b border-slate-100">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Reservation</p>
          <p class="text-xs font-bold text-slate-900">{{assignment.id}} • {{assignment.guestName}}</p>
        </div>
        <button mat-menu-item (click)="viewDetails.emit(assignment)">
          <mat-icon>visibility</mat-icon>
          <span>View Details</span>
        </button>
        <button mat-menu-item>
          <mat-icon>edit</mat-icon>
          <span>Modify Stay</span>
        </button>
        @if (assignment.status === 'Booked') {
          <button mat-menu-item class="text-emerald-600">
            <mat-icon class="text-emerald-500">login</mat-icon>
            <span>Express Check-in</span>
          </button>
        }
        @if (assignment.status === 'CheckedIn') {
          <button mat-menu-item class="text-rose-600">
            <mat-icon class="text-rose-500">logout</mat-icon>
            <span>Express Check-out</span>
          </button>
        }
        <div class="border-t border-slate-100"></div>
        <button mat-menu-item (click)="reassign.emit({ assignment, room })">
          <mat-icon>move_down</mat-icon>
          <span>Move Room</span>
        </button>
      </ng-template>
    </mat-menu>
  `,
  styles: [`
    :host { display: block; }
    .hms-context-menu { border-radius: 12px !important; overflow: hidden; }
    ::ng-deep .mat-mdc-menu-panel { background: rgba(255, 255, 255, 0.98) !important; backdrop-filter: blur(8px) !important; border: 1px solid #F1F5F9 !important; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important; }
    ::ng-deep .mat-mdc-menu-item { min-height: 40px !important; }
    ::ng-deep .mat-mdc-menu-item .mdc-list-item__primary-text { font-size: 12px !important; font-weight: 600 !important; color: #475569 !important; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomRackGridComponent {
  @Input() rooms: Room[] = [];
  @Input() assignments: RoomAssignment[] = [];
  @Input() blocks: MaintenanceBlock[] = [];
  @Input() dates: Date[] = [];
  @Input() today: Date = new Date('2026-04-17');
  
  @Output() viewDetails = new EventEmitter<RoomAssignment>();
  @Output() reassign = new EventEmitter<{ assignment: RoomAssignment, room: Room }>();

  DAY_WIDTH = 140;

  getRoomAssignments(roomId: string) {
    return this.assignments.filter(a => a.roomId === roomId);
  }

  getRoomBlocks(roomId: string) {
    return this.blocks.filter(b => b.roomId === roomId);
  }

  isToday(date: Date): boolean {
    return date.getDate() === this.today.getDate() && 
           date.getMonth() === this.today.getMonth() && 
           date.getFullYear() === this.today.getFullYear();
  }

  getLeftOffset(date: Date): number {
    const startDate = this.dates[0];
    const diffTime = (new Date(date).getTime() - startDate.getTime());
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays * this.DAY_WIDTH + 8; // Added a small margin for aesthetics
  }

  getWidth(start: Date, end: Date): number {
    const diffTime = (new Date(end).getTime() - new Date(start).getTime());
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays * this.DAY_WIDTH - 16; // Subtracted margin from both sides
  }

  getAssignmentClass(assignment: RoomAssignment): string {
    const base = ' ';
    switch (assignment.status) {
      case 'CheckedIn': return base + 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'Booked': return base + 'bg-blue-50 border-blue-200 text-blue-700';
      case 'CheckedOut': return base + 'bg-slate-50 border-slate-200 text-slate-500 opacity-60';
      default: return base + 'bg-slate-100 border-slate-200 text-slate-700';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'CheckedIn': return 'check_circle';
      case 'Booked': return 'schedule';
      case 'CheckedOut': return 'logout';
      default: return 'help';
    }
  }

  getStatusDotClass(status: string): string {
    switch (status) {
      case 'Occupied': return 'bg-emerald-500';
      case 'Dirty': return 'bg-rose-500';
      case 'Maintenance': return 'bg-purple-500';
      case 'Clean': return 'bg-blue-500';
      default: return 'bg-slate-300';
    }
  }
}
