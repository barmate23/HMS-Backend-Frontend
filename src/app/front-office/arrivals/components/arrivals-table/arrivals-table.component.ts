import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { Arrival, ArrivalStatus } from '../../models/arrival.model';

@Component({
  selector: 'app-arrivals-table',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatSortModule, 
    MatIconModule, 
    MatButtonModule, 
    MatMenuModule,
    MatChipsModule
  ],
  template: `
    <div class="bg-white overflow-hidden">
      @if (arrivals.length > 0) {
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="arrivals" matSort (matSortChange)="sortData($event)" class="w-full">
            
            <!-- Index Column -->
            <ng-container matColumnDef="index">
              <th mat-header-cell *matHeaderCellDef class="!pl-6 w-12"> # </th>
              <td mat-cell *matCellDef="let i = index" class="!pl-6 text-slate-400 font-medium tabular-nums text-[11px]"> {{i + 1}} </td>
            </ng-container>

            <!-- Guest Column -->
            <ng-container matColumnDef="guest">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-[220px]"> Guest Details </th>
              <td mat-cell *matCellDef="let arrival">
                <div class="flex items-center gap-3 py-3">
                  <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <mat-icon class="text-lg">person</mat-icon>
                  </div>
                  <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-900">{{arrival.guestName}}</span>
                      @if (arrival.isVip) {
                        <span class="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black rounded uppercase tracking-wider">VIP</span>
                      }
                    </div>
                    <span class="text-[11px] text-slate-500 font-medium tracking-tight">{{arrival.id}} • {{arrival.phone}}</span>
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Room Column -->
            <ng-container matColumnDef="room">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="w-24"> Room </th>
              <td mat-cell *matCellDef="let arrival">
                @if (arrival.roomNumber) {
                  <div class="flex flex-col">
                    <span class="text-sm font-black text-[#1A3C5E]">{{arrival.roomNumber}}</span>
                    <span class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{{arrival.roomType}}</span>
                  </div>
                } @else {
                  <button mat-button color="primary" class="!text-[10px] !font-bold !min-w-0 !px-2 !h-7 !bg-slate-50 border border-slate-200" (click)="assignRoom.emit(arrival)">
                    Assign
                  </button>
                }
              </td>
            </ng-container>

            <!-- Room Type Column (Hidden in favor of combined Room column) -->
            <ng-container matColumnDef="roomType">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Type </th>
              <td mat-cell *matCellDef="let arrival" class="text-xs text-slate-500 font-medium"> {{arrival.roomType}} </td>
            </ng-container>

            <!-- Rate Plan Column -->
            <ng-container matColumnDef="ratePlan">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="w-28"> Rate Plan </th>
              <td mat-cell *matCellDef="let arrival">
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-slate-700">{{arrival.ratePlan}}</span>
                  <span class="text-[10px] text-slate-400 font-medium tracking-tight">Standard Rate</span>
                </div>
              </td>
            </ng-container>

            <!-- Source Column -->
            <ng-container matColumnDef="source">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="w-32"> Source </th>
              <td mat-cell *matCellDef="let arrival">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded bg-slate-50 flex items-center justify-center border border-slate-100">
                    <mat-icon class="text-sm text-slate-400">{{getSourceIcon(arrival.source)}}</mat-icon>
                  </div>
                  <span class="text-xs font-medium text-slate-600">{{arrival.source}}</span>
                </div>
              </td>
            </ng-container>

            <!-- ETA Column -->
            <ng-container matColumnDef="eta">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="w-24"> ETA </th>
              <td mat-cell *matCellDef="let arrival">
                <div class="flex items-center gap-1.5" [class.text-rose-500]="isOverdue(arrival)">
                  <mat-icon class="text-sm w-4 h-4">{{isOverdue(arrival) ? 'warning' : 'schedule'}}</mat-icon>
                  <span class="text-xs font-bold tabular-nums">{{arrival.eta}}</span>
                </div>
              </td>
            </ng-container>

            <!-- PAX Column -->
            <ng-container matColumnDef="pax">
              <th mat-header-cell *matHeaderCellDef class="w-20"> PAX </th>
              <td mat-cell *matCellDef="let arrival">
                <div class="flex items-center gap-1 text-xs font-bold text-slate-600">
                  <span>{{arrival.adults}}</span>
                  <span class="text-slate-300 font-normal">/</span>
                  <span>{{arrival.children}}</span>
                  <mat-icon class="text-xs w-3 h-3 text-slate-400 ml-0.5">group</mat-icon>
                </div>
              </td>
            </ng-container>

            <!-- Deposit Column -->
            <ng-container matColumnDef="deposit">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="w-28"> Deposit </th>
              <td mat-cell *matCellDef="let arrival">
                <div class="flex flex-col">
                  <span [class]="arrival.advancePaid > 0 ? 'text-emerald-600' : 'text-rose-500'" class="text-xs font-bold tabular-nums">
                    ₹{{arrival.advancePaid | number}}
                  </span>
                  <span class="text-[10px] text-slate-400 font-medium">of ₹{{arrival.totalAmount | number}}</span>
                </div>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="w-32"> Status </th>
              <td mat-cell *matCellDef="let arrival">
                <span [class]="getStatusClass(arrival.status)" class="status-badge">
                  {{getStatusLabel(arrival.status)}}
                </span>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="!pr-6 w-32 text-right"> Actions </th>
              <td mat-cell *matCellDef="let arrival" class="!pr-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  @if (arrival.status === 'pending' || arrival.status === 'confirmed' || arrival.status === 'vip') {
                    <button mat-flat-button class="check-in-btn" (click)="checkIn.emit(arrival)">
                      Check In
                    </button>
                  } @else if (arrival.status === 'checked-in') {
                    <div class="flex items-center gap-1 text-emerald-600 font-bold text-[10px] uppercase px-2 py-1 bg-emerald-50 rounded border border-emerald-100">
                      <mat-icon class="text-sm w-4 h-4">check_circle</mat-icon>
                      Done
                    </div>
                  } @else if (arrival.status === 'no-show') {
                    <button mat-stroked-button class="reinstate-btn" (click)="reinstate.emit(arrival)">
                      Reinstate
                    </button>
                  }

                  <button mat-icon-button [matMenuTriggerFor]="menu" class="text-slate-400">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu" class="hms-menu">
                    @if (arrival.status !== 'checked-in') {
                      <button mat-menu-item (click)="assignRoom.emit(arrival)">
                        <mat-icon>meeting_room</mat-icon>
                        <span>Assign Room</span>
                      </button>
                      <button mat-menu-item (click)="markNoShow.emit(arrival)">
                        <mat-icon>person_off</mat-icon>
                        <span>Mark No-Show</span>
                      </button>
                    }
                    <button mat-menu-item>
                      <mat-icon>visibility</mat-icon>
                      <span>View Details</span>
                    </button>
                    <button mat-menu-item>
                      <mat-icon>edit</mat-icon>
                      <span>Edit Reservation</span>
                    </button>
                    <div class="h-[1px] bg-slate-100 my-1"></div>
                    <button mat-menu-item class="!text-rose-500">
                      <mat-icon class="!text-rose-500">cancel</mat-icon>
                      <span>Cancel Reservation</span>
                    </button>
                  </mat-menu>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns" class="bg-slate-50/80 h-11"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns; let i = index" 
                class="hover:bg-slate-50 transition-colors h-14 group border-b border-slate-100 last:border-0"
                [class.is-vip]="row.isVip"
                [class.is-checked-in]="row.status === 'checked-in'"
                [class.is-no-show]="row.status === 'no-show'">
            </tr>
          </table>
        </div>
      } @else {
        <div class="p-20 flex flex-col items-center justify-center text-center bg-white">
          <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <mat-icon class="text-4xl text-slate-200">inbox</mat-icon>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">No arrivals found</h3>
          <p class="text-sm text-slate-500 mb-8 max-w-xs mx-auto">We couldn't find any arrival records matching your current filters or date selection.</p>
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
    .is-checked-in { opacity: 0.7; }
    .is-no-show { background-color: #FFF5F5; }
    
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
    .status-confirmed { background-color: #EFF6FF; color: #1D4ED8; border-color: #DBEAFE; }
    .status-vip { background-color: #FFF7ED; color: #C2410C; border-color: #FFEDD5; }
    .status-checked-in { background-color: #ECFDF5; color: #047857; border-color: #D1FAE5; }
    .status-no-show { background-color: #FFF1F2; color: #BE123C; border-color: #FFE4E6; }
    .status-pre-assigned { background-color: #F5F3FF; color: #6D28D9; border-color: #EDE9FE; }

    .check-in-btn { 
      height: 32px !important; 
      padding: 0 16px !important; 
      font-size: 10px !important; 
      font-weight: 900 !important; 
      border-radius: 8px !important; 
      background-color: #1A3C5E !important; 
      color: white !important;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
    }
    
    .reinstate-btn { 
      height: 32px !important; 
      padding: 0 16px !important; 
      font-size: 10px !important; 
      font-weight: 900 !important; 
      border-radius: 8px !important; 
      border: 1px solid #E2E8F0 !important; 
      color: #475569 !important;
    }
    
    ::ng-deep .hms-menu.mat-mdc-menu-panel { border-radius: 12px !important; border: 1px solid #E2E8F0 !important; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important; }
    ::ng-deep .hms-menu .mat-mdc-menu-item { font-size: 12px !important; font-weight: 600 !important; color: #475569 !important; }
    ::ng-deep .hms-menu .mat-mdc-menu-item mat-icon { color: #94A3B8 !important; margin-right: 8px !important; }
  `],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrivalsTableComponent {
  @Input() arrivals: Arrival[] = [];
  @Output() checkIn = new EventEmitter<Arrival>();
  @Output() assignRoom = new EventEmitter<Arrival>();
  @Output() markNoShow = new EventEmitter<Arrival>();
  @Output() reinstate = new EventEmitter<Arrival>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() sort = new EventEmitter<Sort>();

  displayedColumns: string[] = [
    'index', 'guest', 'room', 'roomType', 'ratePlan', 
    'source', 'eta', 'pax', 'deposit', 'status', 'actions'
  ];

  getSourceIcon(source: string): string {
    switch (source) {
      case 'Walk-in': return 'directions_walk';
      case 'Phone': return 'phone';
      case 'Booking.com': return 'public';
      case 'Agoda': return 'language';
      case 'Corporate': return 'business';
      case 'Direct': return 'hotel';
      default: return 'help_outline';
    }
  }

  getStatusClass(status: ArrivalStatus): string {
    return `status-${status}`;
  }

  getStatusLabel(status: ArrivalStatus): string {
    switch (status) {
      case 'pending': return '● Pending';
      case 'confirmed': return '● Confirmed';
      case 'vip': return '★ VIP';
      case 'checked-in': return '✓ Checked In';
      case 'no-show': return '✗ No Show';
      case 'pre-assigned': return '◆ Pre-Assigned';
      default: return status;
    }
  }

  isOverdue(arrival: Arrival): boolean {
    if (arrival.status === 'checked-in' || arrival.status === 'no-show') return false;
    // Mock overdue logic: if ETA is before 14:00 (assuming current time is later)
    const [hours] = arrival.eta.split(':').map(Number);
    return hours < 12; 
  }

  sortData(sort: Sort) {
    this.sort.emit(sort);
  }
}
