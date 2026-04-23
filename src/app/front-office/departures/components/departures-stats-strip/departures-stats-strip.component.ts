import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DepartureStatus } from '../../models/departure.model';

@Component({
  selector: 'app-departures-stats-strip',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      @for (stat of stats; track stat.label) {
        <button 
          type="button"
          (click)="statClicked.emit(stat.status)"
          class="group relative flex items-center w-full text-left gap-4 bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-[#1A3C5E] hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden"
        >
          <div [class]="stat.colorClass" class="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0 transition-transform group-hover:scale-110">
            <mat-icon>{{stat.icon}}</mat-icon>
          </div>
          <div class="flex flex-col">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-0.5">{{stat.label}}</p>
            <div class="flex items-baseline gap-1">
              <h4 class="text-2xl font-black text-slate-900 tabular-nums">{{stat.count}}</h4>
              <span class="text-[10px] font-bold text-slate-400">Rooms</span>
            </div>
          </div>
          
          <div class="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <mat-icon class="!w-16 !h-16 !text-[64px]">{{stat.icon}}</mat-icon>
          </div>
        </button>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeparturesStatsStripComponent {
  @Input() counts: { total: number; completed: number; pending: number; late: number } = { total: 0, completed: 0, pending: 0, late: 0 };
  @Output() statClicked = new EventEmitter<DepartureStatus | 'all'>();

  get stats() {
    return [
      { label: 'Total Departures', icon: 'logout', count: this.counts.total, status: 'all' as const, colorClass: 'bg-[#1A3C5E]' },
      { label: 'Checked Out', icon: 'check_circle', count: this.counts.completed, status: 'completed' as const, colorClass: 'bg-[#2D9E6B]' },
      { label: 'Pending', icon: 'schedule', count: this.counts.pending, status: 'pending' as const, colorClass: 'bg-[#F4A261]' },
      { label: 'Late Check-out', icon: 'warning', count: this.counts.late, status: 'late' as const, colorClass: 'bg-[#E63946]' }
    ];
  }
}
