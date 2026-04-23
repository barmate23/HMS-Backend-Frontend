import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-hms-text-primary dark:text-dark-text-primary">Reports Dashboard</h1>
      <div class="bg-hms-surface dark:bg-dark-surface p-8 rounded-2xl border border-hms-border dark:border-dark-border shadow-sm text-center">
        <p class="text-hms-text-muted">Analytics and reports coming soon...</p>
      </div>
    </div>
  `
})
export class ReportsPage {}
