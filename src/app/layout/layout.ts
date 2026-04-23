import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, Header, MatIconModule],
  template: `
    <div class="flex h-screen overflow-hidden bg-hms-background dark:bg-dark-background transition-colors duration-150">
      <!-- Sidebar -->
      <app-sidebar></app-sidebar>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0 relative">
        <!-- Header -->
        <app-header></app-header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto overflow-x-hidden p-8 no-scrollbar">
          <div class="max-w-[1600px] mx-auto">
            <router-outlet></router-outlet>
          </div>
        </main>

        <!-- Quick Actions Floating Bar -->
        <div class="fixed bottom-8 right-8 flex items-center gap-3 z-50">
          <div 
            class="flex items-center gap-2 bg-hms-surface dark:bg-dark-surface border border-hms-border dark:border-dark-border p-1.5 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105"
            [class.translate-y-20]="!showQuickActions()"
            [class.opacity-0]="!showQuickActions()"
          >
            <button class="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group relative" title="New Reservation">
              <mat-icon class="text-sm">add</mat-icon>
            </button>
            <button class="p-3 bg-success text-white rounded-xl hover:bg-success/90 transition-all shadow-lg shadow-success/20 group relative" title="Quick Check-In">
              <mat-icon class="text-sm">login</mat-icon>
            </button>
            <button class="p-3 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 group relative" title="Post Charge">
              <mat-icon class="text-sm">payments</mat-icon>
            </button>
            <button class="p-3 bg-danger text-white rounded-xl hover:bg-danger/90 transition-all shadow-lg shadow-danger/20 group relative" title="Emergency Block">
              <mat-icon class="text-sm">block</mat-icon>
            </button>
          </div>
          
          <button 
            (click)="toggleQuickActions()"
            class="w-14 h-14 bg-accent text-primary rounded-2xl shadow-2xl shadow-accent/30 flex items-center justify-center hover:scale-110 transition-all active:scale-95"
          >
            <mat-icon class="text-2xl transition-transform duration-300" [class.rotate-45]="showQuickActions()">
              {{showQuickActions() ? 'add' : 'bolt'}}
            </mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class Layout {
  showQuickActions = signal(false);

  toggleQuickActions() {
    this.showQuickActions.update((v: boolean) => !v);
  }
}
