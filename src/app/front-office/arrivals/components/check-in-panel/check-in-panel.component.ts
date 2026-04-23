import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Arrival, Room } from '../../models/arrival.model';
import { RoomSelectorModalComponent } from './room-selector-modal/room-selector-modal.component';
import { ArrivalsService } from '../../services/arrivals.service';

@Component({
  selector: 'app-check-in-panel',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatSlideToggleModule, 
    MatTabsModule,
    MatDialogModule
  ],
  template: `
    <div class="fixed inset-0 z-50 flex justify-end overflow-hidden">
      <!-- Backdrop -->
      <button 
        type="button"
        class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] w-full h-full border-none cursor-default" 
        (click)="dismiss.emit()"
        aria-label="Close panel"
      ></button>

      <!-- Panel -->
      <div 
        class="relative w-[480px] h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300"
      >
        <!-- Header -->
        <div class="p-5 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-[#1A3C5E]">
              <mat-icon>how_to_reg</mat-icon>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900 leading-tight">Check In Guest</h2>
              <p class="text-xs text-slate-500 font-medium">{{arrival.guestName}} • {{arrival.id}}</p>
            </div>
          </div>
          <button mat-icon-button (click)="dismiss.emit()" class="text-slate-400 hover:text-slate-600">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/30">
          
          <!-- Section 1: Reservation Summary -->
          <section class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Reservation Details</h3>
              <button mat-button color="primary" class="!text-xs !font-bold !min-w-0 !p-0 hover:underline">Modify</button>
            </div>
            
            <div class="grid grid-cols-2 gap-x-6 gap-y-4">
              <div class="space-y-1">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Stay Period</p>
                <p class="text-xs font-bold text-slate-700">
                  {{arrival.checkIn | date:'dd MMM'}} - {{arrival.checkOut | date:'dd MMM yyyy'}}
                  <span class="text-slate-400 font-medium">({{arrival.nights}} nights)</span>
                </p>
              </div>
              <div class="space-y-1">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Room Category</p>
                <p class="text-xs font-bold text-slate-700">{{arrival.roomType}}</p>
              </div>
              <div class="space-y-1">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Rate Plan</p>
                <p class="text-xs font-bold text-slate-700">{{arrival.ratePlan}}</p>
              </div>
              <div class="space-y-1">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Guests</p>
                <p class="text-xs font-bold text-slate-700">{{arrival.adults}} Adults, {{arrival.children}} Children</p>
              </div>
            </div>

            <div class="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Total Amount</p>
                <p class="text-xl font-bold text-slate-900 tabular-nums">₹{{arrival.totalAmount | number}}</p>
              </div>
              <div class="text-right">
                <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">Advance Paid</p>
                <p class="text-xl font-bold text-emerald-600 tabular-nums">₹{{arrival.advancePaid | number}}</p>
              </div>
            </div>
          </section>

          <!-- Section 2: Room Assignment -->
          <section class="space-y-3">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Room Assignment</h3>
            @if (selectedRoom()) {
              <div class="flex items-center justify-between p-4 bg-white border border-emerald-200 rounded-xl shadow-sm ring-1 ring-emerald-50">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-lg font-bold shadow-lg shadow-emerald-100">
                    {{selectedRoom()?.number}}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-900">{{selectedRoom()?.type}}</p>
                    <p class="text-xs text-slate-500 font-medium">{{selectedRoom()?.floor}} • {{selectedRoom()?.view}} View</p>
                  </div>
                </div>
                <button mat-stroked-button color="primary" (click)="openRoomSelector()" class="!rounded-lg !border-slate-200">Change</button>
              </div>
            } @else {
              <button 
                mat-stroked-button 
                class="w-full h-20 !border-dashed !border-2 !border-slate-200 !rounded-xl hover:!bg-white hover:!border-[#1A3C5E] transition-all group"
                (click)="openRoomSelector()"
              >
                <div class="flex flex-col items-center gap-1">
                  <mat-icon class="text-slate-300 group-hover:text-[#1A3C5E]">meeting_room</mat-icon>
                  <span class="text-xs font-bold text-slate-400 group-hover:text-[#1A3C5E]">Assign a Room to Continue</span>
                </div>
              </button>
            }
          </section>

          <!-- Section 3: Guest Verification -->
          <section class="space-y-3">
            <div class="flex items-center justify-between px-1">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Guest Verification</h3>
              <button mat-button color="primary" class="!text-[10px] !font-bold !min-w-0 !p-0">Update Info</button>
            </div>
            
            <div class="bg-white p-4 border border-slate-200 rounded-xl shadow-sm space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <mat-icon>person</mat-icon>
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-900">{{arrival.guestName}}</p>
                  <p class="text-xs text-slate-500 font-medium">{{arrival.phone}} • {{arrival.email}}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="group border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-[#1A3C5E] transition-all">
                  <mat-icon class="text-slate-300 group-hover:text-[#1A3C5E] mb-1">add_a_photo</mat-icon>
                  <span class="text-[10px] font-bold text-slate-400 group-hover:text-[#1A3C5E] uppercase tracking-wider">ID Front</span>
                </div>
                <div class="group border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-[#1A3C5E] transition-all">
                  <mat-icon class="text-slate-300 group-hover:text-[#1A3C5E] mb-1">add_a_photo</mat-icon>
                  <span class="text-[10px] font-bold text-slate-400 group-hover:text-[#1A3C5E] uppercase tracking-wider">ID Back</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 4: Payment Collection -->
          <section class="space-y-3">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Payment Collection</h3>
            
            <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div class="p-4 bg-rose-50/50 border-b border-rose-100 flex justify-between items-center">
                <span class="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Balance Due</span>
                <span class="text-xl font-bold text-rose-600 tabular-nums">₹{{arrival.totalAmount - arrival.advancePaid | number}}</span>
              </div>

              <div class="p-4 space-y-4">
                <mat-tab-group class="payment-tabs-modern">
                  <mat-tab label="CASH"></mat-tab>
                  <mat-tab label="CARD"></mat-tab>
                  <mat-tab label="UPI"></mat-tab>
                  <mat-tab label="BANK"></mat-tab>
                </mat-tab-group>

                <div class="space-y-3">
                  <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                      <label for="paymentAmount" class="text-[10px] font-bold text-slate-400 uppercase ml-1">Amount</label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                        <input id="paymentAmount" type="number" [value]="arrival.totalAmount - arrival.advancePaid" class="w-full h-10 pl-7 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-[#1A3C5E]">
                      </div>
                    </div>
                    <div class="space-y-1">
                      <label for="refNumber" class="text-[10px] font-bold text-slate-400 uppercase ml-1">Ref Number</label>
                      <input id="refNumber" type="text" placeholder="TXN ID / Last 4" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#1A3C5E]">
                    </div>
                  </div>
                  <button mat-flat-button class="w-full h-10 !bg-[#1A3C5E] !text-white !font-bold !rounded-lg">Record Payment</button>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 5: Special Requests -->
          @if (arrival.specialRequests) {
            <section class="space-y-2">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Special Requests</h3>
              <div class="p-4 bg-amber-50 border border-amber-100 rounded-xl text-xs font-medium text-amber-800 leading-relaxed italic">
                "{{arrival.specialRequests}}"
              </div>
            </section>
          }

          <!-- Section 6: Options -->
          <section class="bg-white p-4 border border-slate-200 rounded-xl shadow-sm space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <mat-icon class="text-slate-400 text-sm">textsms</mat-icon>
                <span class="text-xs font-bold text-slate-600">Send welcome SMS</span>
              </div>
              <mat-slide-toggle [checked]="true" color="primary"></mat-slide-toggle>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <mat-icon class="text-slate-400 text-sm">mail</mat-icon>
                <span class="text-xs font-bold text-slate-600">Send welcome Email</span>
              </div>
              <mat-slide-toggle [checked]="true" color="primary"></mat-slide-toggle>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <mat-icon class="text-slate-400 text-sm">print</mat-icon>
                <span class="text-xs font-bold text-slate-600">Print key card slip</span>
              </div>
              <mat-slide-toggle color="primary"></mat-slide-toggle>
            </div>
          </section>
        </div>

        <!-- Footer -->
        <div class="p-5 border-t border-slate-200 flex items-center gap-3 bg-white sticky bottom-0 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <button mat-stroked-button class="flex-1 h-12 !rounded-xl !border-slate-200 !text-slate-600 !font-bold hover:!bg-slate-50" (click)="dismiss.emit()">Cancel</button>
          <button mat-stroked-button class="flex-1 h-12 !rounded-xl !border-slate-200 !text-slate-600 !font-bold hover:!bg-slate-50">Save Draft</button>
          <button 
            mat-flat-button 
            class="flex-[2] h-12 !rounded-xl !bg-[#1A3C5E] !text-white !font-bold shadow-lg shadow-slate-200 disabled:!bg-slate-200 disabled:!text-slate-400 transition-all"
            [disabled]="!selectedRoom() || isProcessing()"
            (click)="completeCheckIn()"
          >
            @if (isProcessing()) {
              <mat-icon class="animate-spin mr-2">sync</mat-icon>
              Processing...
            } @else {
              Complete Check-In
            }
          </button>
        </div>
      </div>
    </div>
  `,

  styles: [`
    .no-subscript ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    ::ng-deep .payment-tabs-modern .mat-mdc-tab-header { --mdc-tab-indicator-active-indicator-color: #1A3C5E; border-bottom: 1px solid #F1F5F9; }
    ::ng-deep .payment-tabs-modern .mat-mdc-tab .mdc-tab__text-label { font-size: 10px; font-weight: 800; color: #94A3B8; letter-spacing: 0.05em; }
    ::ng-deep .payment-tabs-modern .mat-mdc-tab.mdc-tab--active .mdc-tab__text-label { color: #1A3C5E; }
    
    /* Custom scrollbar for drawer */
    .overflow-y-auto::-webkit-scrollbar { width: 4px; }
    .overflow-y-auto::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckInPanelComponent {
  @Input() arrival!: Arrival;
  @Output() dismiss = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  selectedRoom = signal<Room | null>(null);
  isProcessing = signal(false);

  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private arrivalsService = inject(ArrivalsService);

  openRoomSelector() {
    const dialogRef = this.dialog.open(RoomSelectorModalComponent, {
      width: '720px',
      data: { roomType: this.arrival.roomType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedRoom.set(result);
      }
    });
  }

  completeCheckIn() {
    if (!this.selectedRoom()) return;

    this.isProcessing.set(true);
    this.arrivalsService.checkIn(this.arrival.id, {
      roomNumber: this.selectedRoom()!.number,
      paymentAmount: this.arrival.totalAmount - this.arrival.advancePaid,
      paymentMode: 'Cash'
    }).subscribe({
      next: () => {
        this.isProcessing.set(false);
        this.snackBar.open(`✓ ${this.arrival.guestName} checked into Room ${this.selectedRoom()!.number} successfully`, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.success.emit();
      },
      error: () => {
        this.isProcessing.set(false);
        this.snackBar.open('Error during check-in. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
}
