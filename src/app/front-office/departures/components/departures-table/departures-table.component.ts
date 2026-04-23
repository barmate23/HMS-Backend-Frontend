import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Departure, DepartureStatus } from '../../models/departure.model';

@Component({
  selector: 'app-departures-table',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatSortModule, 
    MatIconModule, 
    MatButtonModule, 
    MatMenuModule
  ],
  template: `
    <div class="bg-white overflow-hidden">
      @if (departures.length > 0) {
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="departures" matSort (matSortChange)="sortData($event)" class="w-full">
            
            <ng-container matColumnDef="room">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="!pl-6 w-24"> Room </th>
              <td mat-cell *matCellDef="let departure" class="!pl-6">
                <div class="flex flex-col">
                  <span class="text-sm font-black text-[#1A3C5E]">{{departure.roomNumber}}</span>
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{{departure.roomType}}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="guest">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-[200px]"> Guest </th>
              <td mat-cell *matCellDef="let departure">
                <div class="flex items-center gap-3 py-3">
                  <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <mat-icon class="text-lg">person</mat-icon>
                  </div>
                  <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-900">{{departure.guestName}}</span>
                      @if (departure.isVip) {
                        <span class="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black rounded uppercase tracking-wider">VIP</span>
                      }
                    </div>
                    <span class="text-[11px] text-slate-500 font-medium tracking-tight">{{departure.id}}</span>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="scheduledTime">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="w-32"> Scheduled </th>
              <td mat-cell *matCellDef="let departure">
                <div class="flex items-center gap-1.5">
                  <mat-icon class="text-sm w-4 h-4 text-slate-400">schedule</mat-icon>
                  <span class="text-xs font-bold tabular-nums text-slate-700">{{departure.scheduledCheckoutTime}}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="balance">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="w-32"> Balance </th>
              <td mat-cell *matCellDef="let departure">
                <div class="flex flex-col">
                  <span [class]="departure.balanceDue > 0 ? 'text-rose-500' : 'text-emerald-600'" class="text-xs font-bold tabular-nums">
                    ₹{{departure.balanceDue | number}}
                  </span>
                  <span class="text-[10px] text-slate-400 font-medium">Total: ₹{{departure.totalAmount | number}}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="w-32"> Status </th>
              <td mat-cell *matCellDef="let departure">
                <span [class]="getStatusClass(departure.status)" class="status-badge">
                  {{getStatusLabel(departure.status)}}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="!pr-6 w-32 text-right"> Actions </th>
              <td mat-cell *matCellDef="let departure" class="!pr-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  @if (departure.status !== 'completed') {
                    <button mat-flat-button class="check-out-btn" (click)="checkOut.emit(departure)">
                      Check Out
                    </button>
                  } @else {
                    <div class="flex items-center gap-1 text-emerald-600 font-bold text-[10px] uppercase px-2 py-1 bg-emerald-50 rounded border border-emerald-100">
                      <mat-icon class="text-sm w-4 h-4">check_circle</mat-icon>
                      Done
                    </div>
                  }

                  <button mat-icon-button [matMenuTriggerFor]="menu" class="text-slate-400">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu" class="hms-menu">
                    <button mat-menu-item (click)="viewDetails.emit(departure)">
                      <mat-icon>visibility</mat-icon>
                      <span>View Details</span>
                    </button>
                    <button mat-menu-item>
                      <mat-icon>receipt_long</mat-icon>
                      <span>Print Folio</span>
                    </button>
                    @if (departure.status !== 'completed') {
                      <button mat-menu-item>
                        <mat-icon>more_time</mat-icon>
                        <span>Late Check-out</span>
                      </button>
                    }
                  </mat-menu>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns" class="bg-slate-50/80 h-11"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns" 
                class="hover:bg-slate-50 transition-colors h-14 group border-b border-slate-100 last:border-0"
                [class.is-vip]="row.isVip"
                [class.is-completed]="row.status === 'completed'"
                [class.is-late]="row.status === 'late'">
            </tr>
          </table>
        </div>
      } @else {
        <div class="p-20 flex flex-col items-center justify-center text-center bg-white">
          <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <mat-icon class="text-4xl text-slate-200">inbox</mat-icon>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">No departures found</h3>
          <p class="text-sm text-slate-500 mb-8 max-w-xs mx-auto">We couldn't find any departure records matching your current filters or date selection.</p>
          <button mat-flat-button class="!bg-[#1A3C5E] !text-white !font-bold !px-8 !h-11 !rounded-xl" (click)="clearFilters.emit()">
            Reset All Filters
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .mat-mdc-header-cell { font-size: 10px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #F1F5F9; }
    .mat-mdc-cell { border-bottom: 1px solid #F1F5F9; }
    
    .is-vip { background-color: #FFFBF2; border-left: 4px solid #F4A261 !important; }
    .is-completed { opacity: 0.7; }
    .is-late { background-color: #FFF5F5; }
    
    .status-badge { 
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
      border: 1px solid transparent;
    }
    
    .status-pending { background-color: #FFFBEB; color: #B45309; border-color: #FEF3C7; }
    .status-in-progress { background-color: #EFF6FF; color: #1D4ED8; border-color: #DBEAFE; }
    .status-completed { background-color: #ECFDF5; color: #047857; border-color: #D1FAE5; }
    .status-late { background-color: #FFF1F2; color: #BE123C; border-color: #FFE4E6; }
    .status-no-show { background-color: #F1F5F9; color: #475569; border-color: #E2E8F0; }

    .check-out-btn { 
      height: 32px !important; 
      padding: 0 16px !important; 
      font-size: 10px !important; 
      font-weight: 900 !important; 
      border-radius: 8px !important; 
      background-color: #1A3C5E !important; 
      color: white !important;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
    }
    
    ::ng-deep .hms-menu.mat-mdc-menu-panel { border-radius: 12px !important; border: 1px solid #E2E8F0 !important; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important; }
    ::ng-deep .hms-menu .mat-mdc-menu-item { font-size: 12px !important; font-weight: 600 !important; color: #475569 !important; }
    ::ng-deep .hms-menu .mat-mdc-menu-item mat-icon { color: #94A3B8 !important; margin-right: 8px !important; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeparturesTableComponent {
  @Input() departures: Departure[] = [];
  @Output() checkOut = new EventEmitter<Departure>();
  @Output() viewDetails = new EventEmitter<Departure>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() sort = new EventEmitter<Sort>();

  displayedColumns: string[] = [
    'room', 'guest', 'scheduledTime', 'balance', 'status', 'actions'
  ];

  getStatusClass(status: DepartureStatus): string {
    return `status-${status}`;
  }

  getStatusLabel(status: DepartureStatus): string {
    switch (status) {
      case 'pending': return '● Pending';
      case 'in-progress': return '● In Progress';
      case 'completed': return '✓ Checked Out';
      case 'late': return '⚠ Late';
      case 'no-show': return '✗ No Show';
      default: return status;
    }
  }

  sortData(sort: Sort) {
    this.sort.emit(sort);
  }
}
