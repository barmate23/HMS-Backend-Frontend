import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { GuestProfile } from '../../models/guest-profile.model';

@Component({
  selector: 'app-stay-history-tab',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTableModule],
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total stays</p>
          <p class="text-xl font-black text-[#1B3A5C]">{{guest.stayCount}}</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. duration</p>
          <p class="text-xl font-black text-[#1B3A5C]">2.8 Days</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
          <p class="text-xl font-black text-[#FF8C42]">{{guest.loyalty.lifetimeSpend | currency}}</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Favorite Room</p>
          <p class="text-xl font-black text-[#1B3A5C]">Suite</p>
        </div>
      </div>

      <!-- History Table -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table mat-table [dataSource]="guest.stayHistory" class="w-full hms-table">
          <ng-container matColumnDef="resId">
            <th mat-header-cell *matHeaderCellDef class="!text-[10px] !font-black !uppercase !tracking-widest !text-slate-400">Res ID</th>
            <td mat-cell *matCellDef="let stay" class="!text-xs !font-bold !text-slate-900">{{stay.reservationId}}</td>
          </ng-container>

          <ng-container matColumnDef="dates">
            <th mat-header-cell *matHeaderCellDef class="!text-[10px] !font-black !uppercase !tracking-widest !text-slate-400">Dates</th>
            <td mat-cell *matCellDef="let stay" class="!text-xs !font-medium !text-slate-600">
              {{stay.checkIn | date:'dd MMM'}} - {{stay.checkOut | date:'dd MMM yyyy'}}
            </td>
          </ng-container>

          <ng-container matColumnDef="room">
            <th mat-header-cell *matHeaderCellDef class="!text-[10px] !font-black !uppercase !tracking-widest !text-slate-400">Room</th>
            <td mat-cell *matCellDef="let stay">
              <span class="text-xs font-bold text-[#1B3A5C]">{{stay.roomNumber}}</span>
              <span class="text-[10px] text-slate-400 ml-2 uppercase font-medium tracking-tighter">{{stay.roomType}}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="bill">
            <th mat-header-cell *matHeaderCellDef class="!text-[10px] !font-black !uppercase !tracking-widest !text-slate-400 text-right">Bill</th>
            <td mat-cell *matCellDef="let stay" class="!text-right !text-xs !font-bold !text-slate-900">{{stay.totalBill | currency}}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef class="!text-[10px] !font-black !uppercase !tracking-widest !text-slate-400">Status</th>
            <td mat-cell *matCellDef="let stay">
              <span class="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
                {{stay.status}}
              </span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-slate-50 transition-colors"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .hms-table { background: transparent !important; }
    ::ng-deep .hms-table .mat-mdc-header-cell { height: 48px !important; border-bottom: 1px solid #F1F5F9 !important; background: #F8FAFC !important; }
    ::ng-deep .hms-table .mat-mdc-cell { height: 56px !important; border-bottom: 1px solid #F8FAFC !important; }
  `]
})
export class StayHistoryTabComponent {
  @Input({ required: true }) guest!: GuestProfile;
  displayedColumns = ['resId', 'dates', 'room', 'bill', 'status'];
}
