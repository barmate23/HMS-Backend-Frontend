import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GuestProfile } from '../../models/guest-profile.model';

@Component({
  selector: 'app-overview-tab',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <!-- Personal Information -->
      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <mat-icon class="text-blue-600 !text-sm !w-4 !h-4">person</mat-icon>
          </div>
          <h3 class="text-sm font-black text-[#1B3A5C] uppercase tracking-widest">Personal Info</h3>
        </div>
        <div class="space-y-4">
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</span>
            <p class="text-sm font-bold text-slate-900">{{guest.firstName}} {{guest.lastName}}</p>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</span>
            <p class="text-sm font-bold text-slate-900">{{guest.dateOfBirth | date:'dd MMM yyyy'}}</p>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</span>
            <p class="text-sm font-bold text-slate-900">{{guest.gender}}</p>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nationality</span>
            <div class="flex items-center gap-2">
              <img [src]="guest.flagUrl" class="w-4 h-3 rounded-sm" alt="Nationality Flag">
              <p class="text-sm font-bold text-slate-900">{{guest.nationality}}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <mat-icon class="text-emerald-600 !text-sm !w-4 !h-4">mail</mat-icon>
          </div>
          <h3 class="text-sm font-black text-[#1B3A5C] uppercase tracking-widest">Contact Info</h3>
        </div>
        <div class="space-y-4">
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</span>
            <p class="text-sm font-bold text-slate-900">{{guest.phone}}</p>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Email</span>
            <p class="text-sm font-bold text-slate-900">{{guest.email}}</p>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</span>
            <p class="text-sm font-bold text-slate-900">{{guest.address}}, {{guest.city}}</p>
          </div>
        </div>
      </div>

      <!-- Loyalty & Stats -->
      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <mat-icon class="text-amber-600 !text-sm !w-4 !h-4">verified</mat-icon>
          </div>
          <h3 class="text-sm font-black text-[#1B3A5C] uppercase tracking-widest">Loyalty Status</h3>
        </div>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4">
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tier</p>
              <p class="text-lg font-black text-[#1B3A5C] leading-none">{{guest.loyalty.tier}}</p>
            </div>
            <mat-icon class="text-amber-400 text-3xl h-auto w-auto">military_tech</mat-icon>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points</span>
              <p class="text-sm font-bold text-slate-900">{{guest.loyalty.points | number}}</p>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifetime Spend</span>
              <p class="text-sm font-bold text-[#FF8C42]">{{guest.loyalty.lifetimeSpend | currency}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OverviewTabComponent {
  @Input({ required: true }) guest!: GuestProfile;
}
