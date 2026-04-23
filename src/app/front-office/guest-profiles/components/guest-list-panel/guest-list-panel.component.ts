import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { GuestProfilesService } from '../../services/guest-profiles.service';

@Component({
  selector: 'app-guest-list-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  template: `
    <div class="h-full bg-white border-r border-slate-200 flex flex-col">
      <!-- Search and Filter -->
      <div class="p-6 border-b border-slate-100 space-y-4">
        <mat-form-field appearance="outline" class="w-full hms-search-field no-subscript">
          <mat-icon matPrefix class="text-slate-400 ml-2">search</mat-icon>
          <input matInput [formControl]="searchControl" placeholder="Search Guest Name, Phone, Email">
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full hms-select-field no-subscript">
          <mat-select [formControl]="filterControl">
            @for (option of filterOptions; track option) {
              <mat-option [value]="option">{{option}}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Guest List -->
      <div class="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        @for (guest of guests(); track guest.id) {
          <button 
            (click)="selectGuest(guest.id)"
            [class.bg-blue-50]="selectedId() === guest.id"
            [class.border-blue-200]="selectedId() === guest.id"
            class="w-full text-left p-4 rounded-xl border border-transparent transition-all hover:bg-slate-50 relative group"
          >
            <div class="flex items-center gap-3">
              <img [src]="guest.avatarUrl" class="w-10 h-10 rounded-full bg-slate-100 shadow-sm" alt="Guest avatar">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                  <h3 class="text-sm font-bold text-slate-900 truncate tracking-tight">{{guest.firstName}} {{guest.lastName}}</h3>
                  @if (guest.type.includes('VIP')) {
                    <span class="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
                  }
                </div>
                <div class="flex items-center gap-2">
                  <img [src]="guest.flagUrl" class="w-3.5 h-2.5 rounded-sm object-cover" alt="Nationality Flag">
                  <p class="text-[11px] font-medium text-slate-500 truncate">{{guest.phone}}</p>
                </div>
              </div>
              <div class="text-right shrink-0">
                <span class="text-[9px] font-black text-[#1B3A5C] bg-blue-50/50 px-1.5 py-0.5 rounded-lg border border-blue-100/50 uppercase tracking-widest">
                  {{guest.stayCount}} Stays
                </span>
              </div>
            </div>

            <!-- Type Badges overlay on hover/active -->
            <div class="absolute top-2 right-2 flex gap-1 opacity-100">
               @for (type of guest.type; track type) {
                  @if (type === 'VIP') {
                    <mat-icon class="text-[10px] !w-3.5 !h-3.5 text-amber-500">star</mat-icon>
                  }
               }
            </div>
          </button>
        } @empty {
          <div class="flex flex-col items-center justify-center py-20 bg-white">
            <mat-icon class="text-4xl text-slate-200 mb-2">account_circle</mat-icon>
            <p class="text-xs font-bold text-slate-400">No guests found</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .no-subscript ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    ::ng-deep .hms-search-field .mat-mdc-form-field-flex { height: 42px !important; border-radius: 12px !important; background: #F8FAFC !important; }
    ::ng-deep .hms-select-field .mat-mdc-form-field-flex { height: 40px !important; border-radius: 10px !important; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 4px; }
  `]
})
export class GuestListPanelComponent {
  private service = inject(GuestProfilesService);
  
  guests = this.service.filteredGuests;
  selectedId = this.service.selectedGuestId;
  
  searchControl = new FormControl('');
  filterControl = new FormControl('All Guests');
  
  filterOptions = ['All Guests', 'VIP Guests', 'Repeat Guests', 'Corporate Guests', 'Blacklisted Guests', 'In-House Guests'];

  constructor() {
    this.searchControl.valueChanges.subscribe(v => this.service.setSearchQuery(v || ''));
    this.filterControl.valueChanges.subscribe(v => this.service.setTypeFilter(v || 'All Guests'));
  }

  selectGuest(id: string) {
    this.service.selectGuest(id);
  }
}
