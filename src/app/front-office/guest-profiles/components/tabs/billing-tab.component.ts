import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { GuestProfile, PaymentStatus } from '../../models/guest-profile.model';

@Component({
  selector: 'app-billing-tab',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTableModule],
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-black text-[#1B3A5C] uppercase tracking-widest">Financial Records</h3>
        <div class="flex items-center gap-3">
          <div class="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Outstanding:</span>
            <span class="text-xs font-black text-[#FF8C42]">$0.00</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table mat-table [dataSource]="guest.billingHistory" class="w-full hms-table">
          <ng-container matColumnDef="invoice">
            <th mat-header-cell *matHeaderCellDef class="!text-[10px] !font-black !uppercase !tracking-widest !text-slate-400">Invoice ID</th>
            <td mat-cell *matCellDef="let record" class="!text-xs !font-bold !text-slate-900">{{record.invoiceId}}</td>
          </ng-container>

          <ng-container matColumnDef="resId">
            <th mat-header-cell *matHeaderCellDef class="!text-[10px] !font-black !uppercase !tracking-widest !text-slate-400">Res ID</th>
            <td mat-cell *matCellDef="let record" class="!text-xs !font-medium !text-slate-500">{{record.reservationId}}</td>
          </ng-container>

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef class="!text-[10px] !font-black !uppercase !tracking-widest !text-slate-400">Date</th>
            <td mat-cell *matCellDef="let record" class="!text-xs !font-medium !text-slate-600">{{record.date | date:'dd MMM yyyy'}}</td>
          </ng-container>

          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef class="!text-[10px] !font-black !uppercase !tracking-widest !text-slate-400 text-right">Amount</th>
            <td mat-cell *matCellDef="let record" class="!text-right !text-xs !font-bold !text-slate-900">{{record.amount | currency}}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef class="!text-[10px] !font-black !uppercase !tracking-widest !text-slate-400">Status</th>
            <td mat-cell *matCellDef="let record">
              <span [class]="getStatusClass(record.status)" class="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border">
                {{record.status}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="!w-10"></th>
            <td mat-cell *matCellDef="let record" class="!text-right">
              <button class="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <mat-icon class="!text-sm !w-4 !h-4">more_vert</mat-icon>
              </button>
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
export class BillingTabComponent {
  @Input({ required: true }) guest!: GuestProfile;
  displayedColumns = ['invoice', 'resId', 'date', 'amount', 'status', 'actions'];

  getStatusClass(status: PaymentStatus): string {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100/50';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100/50';
      case 'Refunded': return 'bg-blue-50 text-blue-600 border-blue-100/50';
      default: return 'bg-slate-50 text-slate-600 border-slate-100/50';
    }
  }
}
