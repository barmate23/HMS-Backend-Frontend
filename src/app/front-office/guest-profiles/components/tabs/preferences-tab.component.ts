import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { GuestProfile } from '../../models/guest-profile.model';

@Component({
  selector: 'app-preferences-tab',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <!-- Room Preferences -->
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <mat-icon class="text-orange-600">bed</mat-icon>
          </div>
          <div>
            <h3 class="text-sm font-black text-[#1B3A5C] tracking-tight">Room Preferences</h3>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Guest requirements for stay</p>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2">
          @for (pref of guest.preferences.room; track pref) {
            <span class="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm flex items-center gap-2 hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-default group">
              <mat-icon class="text-[14px] !w-3.5 !h-3.5 text-slate-300 group-hover:text-orange-400">check_circle</mat-icon>
              {{pref}}
            </span>
          } @empty {
            <div class="p-6 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center w-full">
              <mat-icon class="text-3xl text-slate-100 mb-2">hotel</mat-icon>
              <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">No room preferences</p>
            </div>
          }
          <button class="px-3 py-2 rounded-xl border-2 border-dashed border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50 transition-all">
            + Add Pref
          </button>
        </div>
      </div>

      <!-- Service Preferences -->
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <mat-icon class="text-blue-600">room_service</mat-icon>
          </div>
          <div>
            <h3 class="text-sm font-black text-[#1B3A5C] tracking-tight">Service Preferences</h3>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Amenities and special requests</p>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2">
          @for (pref of guest.preferences.service; track pref) {
            <span class="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm flex items-center gap-2 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-default group">
              <mat-icon class="text-[14px] !w-3.5 !h-3.5 text-slate-300 group-hover:text-blue-400">volunteer_activism</mat-icon>
              {{pref}}
            </span>
          } @empty {
            <div class="p-6 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center w-full">
              <mat-icon class="text-3xl text-slate-100 mb-2">stars</mat-icon>
              <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">No service preferences</p>
            </div>
          }
          <button class="px-3 py-2 rounded-xl border-2 border-dashed border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all">
            + Add Spec
          </button>
        </div>
      </div>
    </div>
  `
})
export class PreferencesTabComponent {
  @Input({ required: true }) guest!: GuestProfile;
}
