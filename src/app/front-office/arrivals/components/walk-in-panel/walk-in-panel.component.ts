import { Component, Output, EventEmitter, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArrivalsService } from '../../services/arrivals.service';
import { WalkInPayload } from '../../models/arrival.model';

@Component({
  selector: 'app-walk-in-panel',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatIconModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatDatepickerModule, 
    MatNativeDateModule
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
        class="relative w-[520px] h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300"
      >
        <!-- Header -->
        <div class="p-5 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#1A3C5E] rounded-lg flex items-center justify-center text-white">
              <mat-icon>add_circle</mat-icon>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900 leading-tight">New Walk-in Reservation</h2>
              <p class="text-xs text-slate-500 font-medium">Create a quick reservation and check-in</p>
            </div>
          </div>
          <button mat-icon-button (click)="dismiss.emit()" class="text-slate-400 hover:text-slate-600">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/30">
          <form [formGroup]="walkInForm" class="space-y-6">
            
            <!-- Section 1: Guest Information -->
            <section class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Guest Information</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label for="firstName" class="text-[10px] font-bold text-slate-400 uppercase ml-1">First Name*</label>
                  <input id="firstName" type="text" formControlName="firstName" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#1A3C5E]">
                </div>
                <div class="space-y-1">
                  <label for="lastName" class="text-[10px] font-bold text-slate-400 uppercase ml-1">Last Name*</label>
                  <input id="lastName" type="text" formControlName="lastName" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#1A3C5E]">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label for="mobile" class="text-[10px] font-bold text-slate-400 uppercase ml-1">Mobile*</label>
                  <input id="mobile" type="text" formControlName="mobile" placeholder="+91 9876543210" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#1A3C5E]">
                </div>
                <div class="space-y-1">
                  <label for="email" class="text-[10px] font-bold text-slate-400 uppercase ml-1">Email</label>
                  <input id="email" type="email" formControlName="email" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#1A3C5E]">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label for="idType" class="text-[10px] font-bold text-slate-400 uppercase ml-1">ID Type*</label>
                  <mat-form-field appearance="outline" class="w-full no-subscript hms-select-field">
                    <mat-select id="idType" formControlName="idType">
                      <mat-option value="Aadhaar">Aadhaar</mat-option>
                      <mat-option value="Passport">Passport</mat-option>
                      <mat-option value="PAN">PAN</mat-option>
                      <mat-option value="Driving License">Driving License</mat-option>
                      <mat-option value="Voter ID">Voter ID</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
                <div class="space-y-1">
                  <label for="idNumber" class="text-[10px] font-bold text-slate-400 uppercase ml-1">ID Number*</label>
                  <input id="idNumber" type="text" formControlName="idNumber" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#1A3C5E]">
                </div>
              </div>
            </section>

            <!-- Section 2: Stay Details -->
            <section class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Stay Details</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label for="checkInDate" class="text-[10px] font-bold text-slate-400 uppercase ml-1">Check-in Date</label>
                  <div id="checkInDate" class="w-full h-10 px-3 bg-slate-100 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 flex items-center justify-between">
                    {{today | date:'dd MMM yyyy'}}
                    <mat-icon class="text-xs">lock</mat-icon>
                  </div>
                </div>
                <div class="space-y-1">
                  <label for="checkOutDate" class="text-[10px] font-bold text-slate-400 uppercase ml-1">Check-out Date*</label>
                  <div class="relative">
                    <input id="checkOutDate" [matDatepicker]="picker" formControlName="checkOutDate" [min]="tomorrow" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-[#1A3C5E] cursor-pointer" (click)="picker.open()">
                    <mat-datepicker-toggle matSuffix [for]="picker" class="absolute right-1 top-1/2 -translate-y-1/2 scale-75"></mat-datepicker-toggle>
                    <mat-datepicker #picker></mat-datepicker>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label for="adults" class="text-[10px] font-bold text-slate-400 uppercase ml-1">Adults*</label>
                  <input id="adults" type="number" formControlName="adults" min="1" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-[#1A3C5E]">
                </div>
                <div class="space-y-1">
                  <label for="children" class="text-[10px] font-bold text-slate-400 uppercase ml-1">Children</label>
                  <input id="children" type="number" formControlName="children" min="0" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-[#1A3C5E]">
                </div>
              </div>
            </section>

            <!-- Section 3: Room & Rate -->
            <section class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Room & Rate</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label for="roomType" class="text-[10px] font-bold text-slate-400 uppercase ml-1">Room Type*</label>
                  <mat-form-field appearance="outline" class="w-full no-subscript hms-select-field">
                    <mat-select id="roomType" formControlName="roomType">
                      <mat-option value="Standard">Standard</mat-option>
                      <mat-option value="Deluxe">Deluxe</mat-option>
                      <mat-option value="Junior Suite">Junior Suite</mat-option>
                      <mat-option value="Suite">Suite</mat-option>
                      <mat-option value="Presidential">Presidential</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
                <div class="space-y-1">
                  <label for="roomNumber" class="text-[10px] font-bold text-slate-400 uppercase ml-1">Room Number*</label>
                  <input id="roomNumber" type="text" formControlName="roomNumber" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-[#1A3C5E]">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label for="ratePlan" class="text-[10px] font-bold text-slate-400 uppercase ml-1">Rate Plan*</label>
                  <mat-form-field appearance="outline" class="w-full no-subscript hms-select-field">
                    <mat-select id="ratePlan" formControlName="ratePlan">
                      <mat-option value="Rack">Rack Rate</mat-option>
                      <mat-option value="Corporate">Corporate</mat-option>
                      <mat-option value="Package">Package</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
                <div class="space-y-1">
                  <label for="ratePerNight" class="text-[10px] font-bold text-slate-400 uppercase ml-1">Rate per Night*</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                    <input id="ratePerNight" type="number" formControlName="ratePerNight" class="w-full h-10 pl-7 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:border-[#1A3C5E]">
                  </div>
                </div>
              </div>

              <div class="mt-4 p-4 bg-[#1A3C5E]/5 border border-[#1A3C5E]/10 rounded-xl flex justify-between items-center">
                <span class="text-[10px] font-black uppercase text-[#1A3C5E] tracking-widest">Grand Total</span>
                <span class="text-2xl font-black text-[#1A3C5E] tabular-nums">₹{{calculateTotal() | number}}</span>
              </div>
            </section>

            <!-- Section 4: Special Requests -->
            <section class="space-y-2">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Special Requests</h3>
              <label for="specialRequests" class="sr-only">Special Requests</label>
              <textarea id="specialRequests" formControlName="specialRequests" rows="3" placeholder="Any special requests or notes..." class="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1A3C5E]"></textarea>
            </section>

          </form>
        </div>

        <!-- Footer -->
        <div class="p-5 border-t border-slate-200 flex items-center gap-3 bg-white sticky bottom-0 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <button mat-stroked-button class="flex-1 h-12 !rounded-xl !border-slate-200 !text-slate-600 !font-bold hover:!bg-slate-50" (click)="dismiss.emit()">Cancel</button>
          <button 
            mat-flat-button 
            class="flex-[2] h-12 !rounded-xl !bg-[#1A3C5E] !text-white !font-bold shadow-lg shadow-slate-200 disabled:!bg-slate-200 disabled:!text-slate-400 transition-all"
            [disabled]="walkInForm.invalid || isProcessing()"
            (click)="submit()"
          >
            @if (isProcessing()) {
              <mat-icon class="animate-spin mr-2">sync</mat-icon>
              Creating...
            } @else {
              Create & Check In
            }
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .no-subscript ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    ::ng-deep .hms-select-field .mat-mdc-form-field-flex { height: 40px !important; background-color: #F8FAFC !important; border-radius: 8px !important; border: 1px solid #E2E8F0 !important; }
    ::ng-deep .hms-select-field .mat-mdc-form-field-infix { padding-top: 8px !important; padding-bottom: 8px !important; }
    ::ng-deep .hms-select-field .mat-mdc-select-value { font-size: 13px; font-weight: 600; color: #1E293B; }
    
    /* Custom scrollbar for drawer */
    .overflow-y-auto::-webkit-scrollbar { width: 4px; }
    .overflow-y-auto::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalkInPanelComponent {
  @Output() dismiss = new EventEmitter<void>();
  @Output() completed = new EventEmitter<void>();

  today = new Date();
  tomorrow = new Date(this.today.getTime() + 24 * 60 * 60 * 1000);
  isProcessing = signal(false);

  private arrivalsService = inject(ArrivalsService);
  private snackBar = inject(MatSnackBar);

  walkInForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    mobile: new FormControl('', [Validators.required, Validators.pattern(/^\+?[0-9]{10,12}$/)]),
    email: new FormControl('', Validators.email),
    idType: new FormControl('Aadhaar', Validators.required),
    idNumber: new FormControl('', Validators.required),
    checkOutDate: new FormControl(this.tomorrow, Validators.required),
    adults: new FormControl(1, [Validators.required, Validators.min(1)]),
    children: new FormControl(0, Validators.min(0)),
    roomType: new FormControl('Standard', Validators.required),
    roomNumber: new FormControl('', Validators.required),
    ratePlan: new FormControl('Rack', Validators.required),
    ratePerNight: new FormControl(5000, [Validators.required, Validators.min(0)]),
    specialRequests: new FormControl(''),
    nationality: new FormControl('Indian', Validators.required)
  });

  calculateTotal(): number {
    const rate = this.walkInForm.get('ratePerNight')?.value || 0;
    const checkOut = this.walkInForm.get('checkOutDate')?.value;
    if (!checkOut) return 0;
    
    const nights = Math.ceil((checkOut.getTime() - this.today.getTime()) / (1000 * 60 * 60 * 24));
    return rate * (nights > 0 ? nights : 1);
  }

  submit() {
    if (this.walkInForm.invalid) return;

    this.isProcessing.set(true);
    const formData = {
      ...this.walkInForm.value,
      nights: Math.ceil((this.walkInForm.get('checkOutDate')!.value!.getTime() - this.today.getTime()) / (1000 * 60 * 60 * 24)),
      totalAmount: this.calculateTotal()
    } as unknown as WalkInPayload;

    this.arrivalsService.createWalkIn(formData).subscribe({
      next: (arrival) => {
        this.isProcessing.set(false);
        this.snackBar.open(`✓ Walk-in reservation created. Room ${arrival.roomNumber} assigned.`, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.completed.emit();
      },
      error: () => {
        this.isProcessing.set(false);
        this.snackBar.open('Error creating walk-in. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
}
