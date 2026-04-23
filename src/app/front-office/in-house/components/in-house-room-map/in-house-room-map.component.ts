import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoomStatus } from '../../models/in-house.model';

@Component({
  selector: 'app-in-house-room-map',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="space-y-8 animate-in fade-in duration-500">
      <!-- Floor Selector -->
      <div class="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Select Floor:</span>
          <div class="flex items-center gap-1">
            @for (floor of floors; track floor) {
              <button 
                (click)="activeFloor.set(floor); floorChanged.emit(floor)"
                [class]="activeFloor() === floor ? 'bg-[#1A3C5E] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'"
                class="w-10 h-10 rounded-xl text-xs font-black transition-all duration-300"
              >
                {{floor}}
              </button>
            }
          </div>
        </div>

        <div class="flex items-center gap-6 pr-4">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Occupied</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-amber-500"></div>
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Warning</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-rose-500"></div>
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Critical</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-slate-200"></div>
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vacant</span>
          </div>
        </div>
      </div>

      <!-- Room Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        @for (room of rooms; track room.roomNumber) {
          <button 
            (click)="viewRoom.emit(room)"
            [class]="getRoomClass(room)"
            class="relative aspect-square rounded-3xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 group"
          >
            <span class="text-xl font-black tracking-tighter">{{room.roomNumber}}</span>
            <span class="text-[9px] font-black uppercase tracking-widest opacity-60">{{room.type}}</span>
            
            <!-- Indicators -->
            <div class="absolute top-3 right-3 flex flex-col gap-1">
              @if (room.hasVip) {
                <mat-icon class="!w-4 !h-4 !text-[16px] text-amber-500">stars</mat-icon>
              }
              @if (room.hasRequest) {
                <mat-icon class="!w-4 !h-4 !text-[16px] text-rose-500 animate-pulse">priority_high</mat-icon>
              }
            </div>

            <!-- Tooltip-like info on hover -->
            <div class="absolute inset-0 bg-slate-900/90 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
              <span class="text-[10px] font-black text-white uppercase tracking-widest mb-1">{{room.status}}</span>
              <span class="text-xs font-bold text-white truncate w-full">{{room.guestName || 'Vacant'}}</span>
              @if (room.guestName) {
                <span class="text-[9px] text-slate-400 font-medium mt-1">Click to view profile</span>
              }
            </div>
          </button>
        }
      </div>

      <!-- Floor Stats -->
      <div class="bg-slate-50 rounded-3xl p-6 border border-slate-200 flex flex-wrap items-center justify-around gap-8">
        <div class="flex flex-col items-center">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Rooms</span>
          <span class="text-2xl font-black text-slate-900">{{rooms.length}}</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Occupied</span>
          <span class="text-2xl font-black text-emerald-600">{{getOccupiedCount()}}</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Issues</span>
          <span class="text-2xl font-black text-rose-600">{{getIssueCount()}}</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Happiness</span>
          <div class="flex items-center gap-1">
            <mat-icon class="text-emerald-500">sentiment_very_satisfied</mat-icon>
            <span class="text-2xl font-black text-slate-900">4.8</span>
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
export class InHouseRoomMapComponent {
  @Input() rooms: RoomStatus[] = [];
  @Output() floorChanged = new EventEmitter<number>();
  @Output() viewRoom = new EventEmitter<RoomStatus>();

  activeFloor = signal(1);
  floors = [1, 2, 3, 4, 5];

  getRoomClass(room: RoomStatus): string {
    if (room.status === 'vacant' || room.status === 'dirty') {
      return 'bg-slate-50 border-slate-200 text-slate-400';
    }
    
    switch (room.condition) {
      case 'critical': return 'bg-rose-50 border-rose-200 text-rose-600';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-600';
      case 'happy': return 'bg-emerald-50 border-emerald-200 text-emerald-600';
      default: return 'bg-blue-50 border-blue-200 text-blue-600';
    }
  }

  getOccupiedCount(): number {
    return this.rooms.filter(r => r.status === 'occupied').length;
  }

  getIssueCount(): number {
    return this.rooms.filter(r => r.condition === 'critical' || r.condition === 'warning').length;
  }
}
