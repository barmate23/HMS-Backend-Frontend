import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <aside 
      class="h-screen bg-primary text-white flex flex-col transition-all duration-300 ease-in-out z-50 shadow-xl"
      [class.w-64]="!isCollapsed()"
      [class.w-20]="isCollapsed()"
    >
      <!-- Logo Area -->
      <div class="h-16 flex items-center px-6 border-b border-white/10 overflow-hidden">
        <div class="min-w-[32px] h-8 bg-accent rounded-lg flex items-center justify-center shadow-lg">
          <mat-icon class="text-white">hotel</mat-icon>
        </div>
        <span 
          class="ml-3 font-bold text-lg tracking-tight whitespace-nowrap transition-opacity duration-300"
          [class.opacity-0]="isCollapsed()"
          [class.pointer-events-none]="isCollapsed()"
        >
          HMS Cloud
        </span>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 py-4 overflow-y-auto no-scrollbar px-3 space-y-1">
        @for (item of menuItems; track item.route) {
          <a 
            [routerLink]="item.route"
            routerLinkActive="bg-white/10 border-l-4 border-accent"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
            class="flex items-center h-12 px-3 rounded-lg hover:bg-white/5 transition-all group relative"
            [title]="isCollapsed() ? item.label : ''"
          >
            <mat-icon 
              class="text-white/70 group-hover:text-white transition-colors"
              [class.mr-3]="!isCollapsed()"
            >
              {{item.icon}}
            </mat-icon>
            
            <span 
              class="font-medium text-sm whitespace-nowrap transition-all duration-300"
              [class.opacity-0]="isCollapsed()"
              [class.w-0]="isCollapsed()"
              [class.overflow-hidden]="isCollapsed()"
            >
              {{item.label}}
            </span>

            @if (item.badge && !isCollapsed()) {
              <span class="ml-auto bg-accent text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {{item.badge}}
              </span>
            }
          </a>
        }
      </nav>

      <!-- Bottom Actions -->
      <div class="p-4 border-t border-white/10 space-y-2">
        <button 
          (click)="toggleSidebar()"
          class="w-full flex items-center h-10 px-3 rounded-lg hover:bg-white/5 transition-all text-white/60 hover:text-white"
        >
          <mat-icon [class.mr-3]="!isCollapsed()">
            {{isCollapsed() ? 'chevron_right' : 'chevron_left'}}
          </mat-icon>
          <span 
            class="text-xs font-medium whitespace-nowrap"
            [class.hidden]="isCollapsed()"
          >
            Collapse Sidebar
          </span>
        </button>

        <div class="flex items-center p-2 rounded-xl bg-white/5 overflow-hidden">
          <div class="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-xs font-bold">
            AB
          </div>
          <div 
            class="ml-3 transition-all duration-300"
            [class.opacity-0]="isCollapsed()"
            [class.w-0]="isCollapsed()"
          >
            <p class="text-xs font-bold truncate">Akshay B.</p>
            <p class="text-[10px] text-white/50 truncate">Front Desk Manager</p>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    :host { display: block; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class Sidebar {
  isCollapsed = signal(false);
  
  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Reservations', icon: 'calendar_month', route: '/reservations', badge: '12' },
    { label: 'Arrivals', icon: 'login', route: '/arrivals', badge: '8' },
    { label: 'Departures', icon: 'logout', route: '/departures', badge: '6' },
    { label: 'In-House', icon: 'people', route: '/in-house' },
    { label: 'Room Rack', icon: 'grid_view', route: '/room-rack' },
    { label: 'Guest Profiles', icon: 'person_search', route: '/guest-profile' },
    { label: 'Night Audit', icon: 'nights_stay', route: '/night-audit' },
    { label: 'Reports', icon: 'bar_chart', route: '/reports' },
  ];

  toggleSidebar() {
    this.isCollapsed.update((v: boolean) => !v);
  }
}
