import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InHouseGuest } from '../../models/in-house.model';

@Component({
  selector: 'app-in-house-directory',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  template: `
    <div class="space-y-6 animate-in fade-in duration-500">
      <!-- Search and Filter Bar -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div class="flex flex-col md:flex-row gap-4">
          <mat-form-field appearance="outline" class="flex-1 no-subscript hms-search-field">
            <mat-icon matPrefix class="text-slate-400 ml-3">search</mat-icon>
            <input matInput placeholder="Search by name, room, or phone..." (input)="onSearch($event)">
          </mat-form-field>
          
          <div class="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            @for (chip of filterChips; track chip.id) {
              <button 
                (click)="toggleFilter(chip.id)"
                [class]="activeFilter() === chip.id ? 'bg-[#1A3C5E] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'"
                class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200"
              >
                {{chip.label}}
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Guest Table -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50/80 h-12">
                <th class="pl-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">Room</th>
                <th class="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Guest Name</th>
                <th class="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th class="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stay Info</th>
                <th class="pr-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (guest of guests; track guest.id) {
                <tr class="h-16 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
                  <td class="pl-6">
                    <div class="flex flex-col">
                      <span class="text-sm font-black text-[#1A3C5E]">{{guest.roomNumber}}</span>
                      <span class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{{guest.roomType}}</span>
                    </div>
                  </td>
                  <td class="px-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <mat-icon class="text-lg">person</mat-icon>
                      </div>
                      <div class="flex flex-col min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-slate-900 truncate">{{guest.guestName}}</span>
                          @if (guest.isVip) {
                            <span class="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black rounded uppercase tracking-wider">VIP</span>
                          }
                        </div>
                        <span class="text-[11px] text-slate-500 font-medium tracking-tight">{{guest.phone}}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-4">
                    <span [class]="getStatusClass(guest.status)" class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border">
                      {{guest.status}}
                    </span>
                  </td>
                  <td class="px-4">
                    <div class="flex flex-col">
                      <span class="text-xs font-bold text-slate-700">{{guest.nightsRemaining}} Nights Left</span>
                      <span class="text-[10px] text-slate-400 font-medium">Out: {{guest.checkOut | date:'dd MMM'}}</span>
                    </div>
                  </td>
                  <td class="pr-6 text-right">
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button (click)="viewProfile.emit(guest)" class="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-[#1A3C5E] hover:text-white transition-all">
                        <mat-icon class="text-lg">visibility</mat-icon>
                      </button>
                      <button class="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-[#1A3C5E] hover:text-white transition-all">
                        <mat-icon class="text-lg">call</mat-icon>
                      </button>
                      <button class="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-[#1A3C5E] hover:text-white transition-all">
                        <mat-icon class="text-lg">chat</mat-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="py-20 text-center">
                    <div class="flex flex-col items-center">
                      <mat-icon class="text-4xl text-slate-200 mb-4">search_off</mat-icon>
                      <h3 class="text-lg font-bold text-slate-900">No guests found</h3>
                      <p class="text-sm text-slate-500">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .no-subscript ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    ::ng-deep .hms-search-field .mat-mdc-form-field-flex { height: 44px !important; background-color: #F8FAFC !important; border-radius: 12px !important; }
    ::ng-deep .hms-search-field .mat-mdc-form-field-infix { padding-top: 10px !important; padding-bottom: 10px !important; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InHouseDirectoryComponent {
  @Input() guests: InHouseGuest[] = [];
  @Output() guestSearch = new EventEmitter<string>();
  @Output() guestFilter = new EventEmitter<string>();
  @Output() viewProfile = new EventEmitter<InHouseGuest>();

  activeFilter = signal('all');

  filterChips = [
    { id: 'all', label: 'All Guests' },
    { id: 'vip', label: 'VIP Only' },
    { id: 'requests', label: 'Pending Requests' },
    { id: 'long-stay', label: 'Long Stay' },
    { id: 'departing', label: 'Departing Today' }
  ];

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.guestSearch.emit(value);
  }

  toggleFilter(id: string) {
    this.activeFilter.set(id);
    this.guestFilter.emit(id);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'happy': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'issue': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'vip-attention': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  }
}
