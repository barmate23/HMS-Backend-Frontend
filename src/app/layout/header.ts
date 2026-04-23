import { Component, signal, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <header class="h-16 bg-hms-surface border-b border-hms-border px-8 flex items-center justify-between z-40 shadow-sm transition-colors duration-150 dark:bg-dark-surface dark:border-dark-border">
      <!-- Left: Property & Breadcrumb -->
      <div class="flex items-center gap-6">
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-hms-text-primary dark:text-dark-text-primary">Grand Plaza Resort</span>
            <mat-icon class="text-xs text-hms-text-muted">expand_more</mat-icon>
          </div>
          <span class="text-[10px] font-bold text-accent uppercase tracking-widest">Property ID: GPR-001</span>
        </div>

        <div class="h-8 w-px bg-hms-border dark:bg-dark-border"></div>

        <div class="flex items-center gap-2 text-hms-text-muted text-xs font-medium">
          <span class="hover:text-primary cursor-pointer">Front Office</span>
          <mat-icon class="text-xs">chevron_right</mat-icon>
          <span class="text-hms-text-primary dark:text-dark-text-primary font-bold">Dashboard</span>
        </div>
      </div>

      <!-- Center: Quick Search -->
      <div class="flex-1 max-w-md mx-8 group">
        <div class="relative">
          <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-hms-text-muted text-sm group-focus-within:text-primary transition-colors">search</mat-icon>
          <input 
            type="text" 
            placeholder="Search guests, rooms, reservations (Ctrl+K)" 
            class="w-full pl-10 pr-4 py-2 bg-hms-background border border-hms-border rounded-xl text-xs focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all dark:bg-dark-background dark:border-dark-border dark:text-dark-text-primary"
          >
        </div>
      </div>

      <!-- Right: Actions & User -->
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-end">
          <span class="text-xs font-bold text-hms-text-primary dark:text-dark-text-primary">{{currentTime() | date:'EEEE, MMM d, y'}}</span>
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold text-success uppercase tracking-widest">Business Date: {{businessDate() | date:'MMM d, y'}}</span>
            <span class="text-[10px] font-bold text-secondary uppercase tracking-widest">• Morning Shift</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button class="p-2 text-hms-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all relative">
            <mat-icon class="text-sm">notifications</mat-icon>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-hms-surface dark:border-dark-surface"></span>
          </button>
          
          <button (click)="toggleDarkMode()" class="p-2 text-hms-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
            <mat-icon class="text-sm">{{isDarkMode() ? 'light_mode' : 'dark_mode'}}</mat-icon>
          </button>

          <div class="h-8 w-px bg-hms-border dark:bg-dark-border"></div>

          <button class="flex items-center gap-3 pl-2 group">
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs group-hover:bg-primary group-hover:text-white transition-all">
              AB
            </div>
            <mat-icon class="text-xs text-hms-text-muted group-hover:text-primary transition-colors">expand_more</mat-icon>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Header implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  currentTime = signal(new Date());
  businessDate = signal(new Date());
  isDarkMode = signal(false);
  private timer: ReturnType<typeof setInterval> | undefined;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.timer = setInterval(() => {
        this.currentTime.set(new Date());
      }, 1000);
      
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.isDarkMode.set(true);
        document.documentElement.classList.add('dark');
      }
    }
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  toggleDarkMode() {
    this.isDarkMode.update((v: boolean) => !v);
    if (isPlatformBrowser(this.platformId)) {
      if (this.isDarkMode()) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
}
