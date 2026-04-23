import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { GuestListPanelComponent } from './components/guest-list-panel/guest-list-panel.component';
import { GuestDetailPanelComponent } from './components/guest-detail-panel/guest-detail-panel.component';

@Component({
  selector: 'app-guest-profiles',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatMenuModule,
    GuestListPanelComponent,
    GuestDetailPanelComponent
  ],
  template: `
    <div class="h-screen flex flex-col bg-[#F8FAFC] overflow-hidden">
      <!-- Global Header -->
      <header class="bg-[#1B3A5C] text-white h-16 px-8 flex items-center justify-between shrink-0 shadow-lg z-50">
        <div class="flex items-center gap-8">
          <div>
            <div class="flex items-center gap-2 text-white/50 mb-0.5">
              <mat-icon class="text-xs w-4 h-4">dashboard</mat-icon>
              <span class="text-[9px] font-black uppercase tracking-widest">LuxeStay HMS</span>
              <mat-icon class="text-xs w-4 h-4">chevron_right</mat-icon>
              <span class="text-[9px] font-black uppercase tracking-widest text-white">Guest Profiles</span>
            </div>
            <h1 class="text-xl font-black tracking-tight leading-none">Guest Master Directory</h1>
          </div>

          <!-- Property Selector -->
          <div class="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 ml-4 cursor-pointer hover:bg-white/10 transition-all">
            <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span class="text-xs font-black tracking-tight">Grand Plaza Resort</span>
            <mat-icon class="text-sm">expand_more</mat-icon>
          </div>
        </div>

        <!-- Global Search & Actions -->
        <div class="flex items-center gap-6">
          <div class="relative w-80">
            <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 !w-4 !h-4 text-xs font-black">search</mat-icon>
            <input 
              type="text" 
              placeholder="Guest, Phone, Email or Res ID..." 
              class="w-full h-10 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-xs font-medium placeholder:text-white/30 focus:bg-white/10 focus:outline-none focus:border-white/20 transition-all"
            >
          </div>

          <div class="flex items-center gap-4">
             <div class="text-right hidden lg:block">
                <p class="text-[9px] font-black text-white/40 uppercase tracking-widest">Business Date</p>
                <p class="text-[11px] font-black tracking-tight">Friday, 17 April 2026</p>
             </div>
             
             <div class="flex items-center gap-1">
                <button mat-icon-button class="!text-white/70 hover:!text-white"><mat-icon>notifications</mat-icon></button>
                <button mat-icon-button class="!text-white/70 hover:!text-white"><mat-icon>dark_mode</mat-icon></button>
                <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center p-[2px] cursor-pointer hover:scale-110 transition-transform">
                   <img src="https://i.pravatar.cc/150?u=admin" class="w-full h-full rounded-lg border-2 border-[#1B3A5C]" alt="Admin">
                </div>
             </div>
          </div>
        </div>
      </header>

      <!-- Main Layout -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Sidebar Navigation (Mock) -->
        <nav class="w-64 bg-[#1B3A5C] border-r border-white/5 flex flex-col pt-4 overflow-y-auto shrink-0 hidden lg:flex">
          @for (item of navItems; track item.label) {
            <div 
              class="mx-4 px-4 py-3 rounded-xl flex items-center gap-4 mb-1 cursor-pointer transition-all border border-transparent"
              [class]="item.active ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' : 'text-white/60 hover:text-white hover:bg-white/5'"
            >
              <mat-icon class="!w-5 !h-5 text-sm">{{item.icon}}</mat-icon>
              <span class="text-[11px] font-black uppercase tracking-widest">{{item.label}}</span>
              @if (item.badge) {
                <span class="ml-auto bg-white/20 text-[9px] px-1.5 py-0.5 rounded-lg border border-white/10">{{item.badge}}</span>
              }
            </div>
          }
        </nav>

        <!-- Module Content -->
        <div class="flex-1 flex overflow-hidden">
          <!-- Left List Panel -->
          <div class="w-[340px] shrink-0 h-full">
            <app-guest-list-panel></app-guest-list-panel>
          </div>

          <!-- Right Detail Panel -->
          <div class="flex-1 h-full">
            <app-guest-detail-panel></app-guest-detail-panel>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; overflow: hidden; }
  `]
})
export class GuestProfilesComponent {
  navItems = [
    { label: 'Dashboard', icon: 'grid_view' },
    { label: 'Reservations', icon: 'book_online' },
    { label: 'Arrivals', icon: 'login', badge: '12' },
    { label: 'Departures', icon: 'logout', badge: '8' },
    { label: 'In-House', icon: 'meeting_room', badge: '54' },
    { label: 'Room Rack', icon: 'view_timeline' },
    { label: 'Guest Profiles', icon: 'group', active: true },
    { label: 'Night Audit', icon: 'bedtime_off' },
    { label: 'Reports', icon: 'analytics' }
  ];
}
