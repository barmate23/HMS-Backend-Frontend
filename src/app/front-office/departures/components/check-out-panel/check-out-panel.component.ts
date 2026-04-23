import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Departure } from '../../models/departure.model';
import { DeparturesService } from '../../services/departures.service';

@Component({
  selector: 'app-check-out-panel',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatSlideToggleModule, 
    MatTabsModule
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
              <mat-icon>logout</mat-icon>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900 leading-tight">Guest Check Out</h2>
              <p class="text-xs text-slate-500 font-medium">{{departure.guestName}} • Room {{departure.roomNumber}}</p>
            </div>
          </div>
          <button mat-icon-button (click)="dismiss.emit()" class="text-slate-400 hover:text-slate-600">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/30">
          
          <!-- Step Indicator -->
          <div class="flex items-center justify-between px-2 mb-2">
            @for (step of steps; track step.id) {
              <div class="flex flex-col items-center gap-1.5 relative">
                <div 
                  [class]="currentStep() >= step.id ? 'bg-[#1A3C5E] text-white' : 'bg-slate-200 text-slate-400'"
                  class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10"
                >
                  @if (currentStep() > step.id) {
                    <mat-icon class="text-sm">check</mat-icon>
                  } @else {
                    {{step.id}}
                  }
                </div>
                <span [class]="currentStep() >= step.id ? 'text-[#1A3C5E] font-bold' : 'text-slate-400 font-medium'" class="text-[9px] uppercase tracking-wider">
                  {{step.label}}
                </span>
                @if (step.id < 4) {
                  <div class="absolute left-[2.5rem] top-4 w-[5.5rem] h-[2px] bg-slate-200 -z-0">
                    <div 
                      class="h-full bg-[#1A3C5E] transition-all duration-500"
                      [style.width]="currentStep() > step.id ? '100%' : '0%'"
                    ></div>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Step 1: Billing Review -->
          @if (currentStep() === 1) {
            <section class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">Billing Summary</h3>
                  <span class="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded border border-emerald-100 uppercase">Verified</span>
                </div>
                
                <div class="space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500 font-medium">Room Charges (3 Nights)</span>
                    <span class="text-slate-900 font-bold">₹18,000.00</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500 font-medium">Food & Beverage</span>
                    <span class="text-slate-900 font-bold">₹4,500.00</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500 font-medium">Laundry Services</span>
                    <span class="text-slate-900 font-bold">₹1,200.00</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500 font-medium">Taxes (GST 12%)</span>
                    <span class="text-slate-900 font-bold">₹1,300.00</span>
                  </div>
                  <div class="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span class="text-sm font-black text-slate-900 uppercase">Total Amount</span>
                    <span class="text-xl font-black text-slate-900">₹{{departure.totalAmount | number}}</span>
                  </div>
                </div>
              </div>

              <div class="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex justify-between items-center">
                <div>
                  <p class="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Balance Due</p>
                  <p class="text-2xl font-black text-rose-600 tabular-nums">₹{{departure.balanceDue | number}}</p>
                </div>
                <button mat-flat-button class="!bg-rose-600 !text-white !font-bold !rounded-xl !h-10">
                  Settle Payment
                </button>
              </div>

              <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div class="flex items-center gap-3 mb-3">
                  <mat-icon class="text-slate-400">receipt_long</mat-icon>
                  <span class="text-xs font-bold text-slate-700">Folio Actions</span>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <button mat-stroked-button class="!rounded-xl !border-slate-200 !text-slate-600 !font-bold !h-10">
                    <mat-icon class="mr-1 text-sm">print</mat-icon> Print Folio
                  </button>
                  <button mat-stroked-button class="!rounded-xl !border-slate-200 !text-slate-600 !font-bold !h-10">
                    <mat-icon class="mr-1 text-sm">mail</mat-icon> Email Folio
                  </button>
                </div>
              </div>
            </section>
          }

          <!-- Step 2: Room Audit -->
          @if (currentStep() === 2) {
            <section class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">Room Condition Audit</h3>
                
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-slate-700">General Cleanliness</span>
                      <span class="text-[10px] text-slate-400 font-medium">Visual inspection of room state</span>
                    </div>
                    <div class="flex gap-1">
                      @for (i of [1,2,3,4,5]; track i) {
                        <button (click)="cleanliness.set(i)" class="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                          [class]="cleanliness() >= i ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-300'">
                          <mat-icon class="text-sm">star</mat-icon>
                        </button>
                      }
                    </div>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm font-bold text-slate-700">Amenities Working?</span>
                    <mat-slide-toggle [checked]="true" color="primary"></mat-slide-toggle>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm font-bold text-slate-700">Damage Found?</span>
                    <mat-slide-toggle (change)="hasDamage.set($event.checked)" color="warn"></mat-slide-toggle>
                  </div>

                  @if (hasDamage()) {
                    <div class="space-y-3 animate-in fade-in zoom-in-95 duration-300">
                      <mat-form-field appearance="outline" class="w-full no-subscript">
                        <mat-label>Damage Severity</mat-label>
                        <mat-select value="minor">
                          <mat-option value="minor">Minor (Scuffs, small stains)</mat-option>
                          <mat-option value="moderate">Moderate (Broken fixtures)</mat-option>
                          <mat-option value="major">Major (Structural/Appliance)</mat-option>
                        </mat-select>
                      </mat-form-field>
                      <textarea placeholder="Describe the damage..." class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-rose-500" rows="3"></textarea>
                      <div class="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-[#1A3C5E] hover:text-[#1A3C5E] transition-all cursor-pointer">
                        <mat-icon class="text-3xl mb-2">add_a_photo</mat-icon>
                        <span class="text-[10px] font-black uppercase tracking-widest">Upload Damage Photos</span>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Key Return</h3>
                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200 text-[#1A3C5E]">
                      <mat-icon class="text-lg">vpn_key</mat-icon>
                    </div>
                    <span class="text-sm font-bold text-slate-700">Room Key Card</span>
                  </div>
                  <mat-slide-toggle [checked]="true" color="primary"></mat-slide-toggle>
                </div>
              </div>
            </section>
          }

          <!-- Step 3: Guest Feedback -->
          @if (currentStep() === 3) {
            <section class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-6">
                <div>
                  <h3 class="text-lg font-black text-slate-900 mb-1">Guest Satisfaction</h3>
                  <p class="text-xs text-slate-500 font-medium">How was {{departure.guestName}}'s stay?</p>
                </div>

                <div class="flex justify-center gap-2">
                  @for (i of [1,2,3,4,5]; track i) {
                    <button (click)="overallRating.set(i)" class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300"
                      [class]="overallRating() >= i ? 'bg-amber-400 text-white scale-110 shadow-lg shadow-amber-100' : 'bg-slate-50 text-slate-200'">
                      <mat-icon class="text-2xl">star</mat-icon>
                    </button>
                  }
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</span>
                    <div class="flex justify-center gap-1">
                      @for (i of [1,2,3,4,5]; track i) {
                        <mat-icon class="text-sm w-4 h-4" [class]="overallRating() >= i ? 'text-amber-400' : 'text-slate-100'">star</mat-icon>
                      }
                    </div>
                  </div>
                  <div class="space-y-2">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cleanliness</span>
                    <div class="flex justify-center gap-1">
                      @for (i of [1,2,3,4,5]; track i) {
                        <mat-icon class="text-sm w-4 h-4" [class]="overallRating() >= i ? 'text-amber-400' : 'text-slate-100'">star</mat-icon>
                      }
                    </div>
                  </div>
                </div>

                <div class="space-y-3 pt-4 border-t border-slate-100">
                  <p class="text-xs font-bold text-slate-700 text-left">Would the guest recommend us?</p>
                  <div class="flex gap-2">
                    <button mat-stroked-button class="flex-1 !rounded-xl !h-10 !font-bold !text-xs hover:!bg-emerald-50 hover:!text-emerald-600 hover:!border-emerald-200">Yes</button>
                    <button mat-stroked-button class="flex-1 !rounded-xl !h-10 !font-bold !text-xs hover:!bg-slate-50">Maybe</button>
                    <button mat-stroked-button class="flex-1 !rounded-xl !h-10 !font-bold !text-xs hover:!bg-rose-50 hover:!text-rose-600 hover:!border-rose-200">No</button>
                  </div>
                </div>

                <textarea placeholder="Guest comments or feedback..." class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#1A3C5E]" rows="4"></textarea>
              </div>
            </section>
          }

          <!-- Step 4: Final Confirmation -->
          @if (currentStep() === 4) {
            <section class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
                <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <mat-icon class="text-4xl">check_circle</mat-icon>
                </div>
                <div>
                  <h3 class="text-xl font-black text-slate-900">Ready for Check Out</h3>
                  <p class="text-sm text-slate-500 font-medium">All steps are completed. Room {{departure.roomNumber}} will be marked as Vacant Dirty.</p>
                </div>

                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 text-left">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-400 font-bold uppercase tracking-widest">Billing</span>
                    <span class="text-emerald-600 font-black">SETTLED</span>
                  </div>
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-400 font-bold uppercase tracking-widest">Room Audit</span>
                    <span class="text-emerald-600 font-black">PASSED</span>
                  </div>
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-400 font-bold uppercase tracking-widest">Keys</span>
                    <span class="text-emerald-600 font-black">RETURNED</span>
                  </div>
                </div>

                <div class="bg-[#1A3C5E]/5 p-4 rounded-2xl border border-[#1A3C5E]/10 space-y-3 text-left">
                  <p class="text-[10px] font-black text-[#1A3C5E] uppercase tracking-widest">Housekeeping Assignment</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                        <mat-icon class="text-sm">person</mat-icon>
                      </div>
                      <span class="text-xs font-bold text-slate-700">Auto-assign: Sunita K.</span>
                    </div>
                    <span class="px-2 py-0.5 bg-[#1A3C5E] text-white text-[9px] font-black rounded uppercase">Priority</span>
                  </div>
                </div>
              </div>
            </section>
          }

        </div>

        <!-- Footer -->
        <div class="p-5 border-t border-slate-200 flex items-center gap-3 bg-white sticky bottom-0 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          @if (currentStep() > 1) {
            <button mat-stroked-button class="flex-1 h-12 !rounded-xl !border-slate-200 !text-slate-600 !font-bold hover:!bg-slate-50" (click)="prevStep()">Back</button>
          } @else {
            <button mat-stroked-button class="flex-1 h-12 !rounded-xl !border-slate-200 !text-slate-600 !font-bold hover:!bg-slate-50" (click)="dismiss.emit()">Cancel</button>
          }
          
          @if (currentStep() < 4) {
            <button mat-flat-button class="flex-[2] h-12 !rounded-xl !bg-[#1A3C5E] !text-white !font-bold shadow-lg shadow-slate-200" (click)="nextStep()">
              Continue to {{steps[currentStep()].label}}
            </button>
          } @else {
            <button 
              mat-flat-button 
              class="flex-[2] h-12 !rounded-xl !bg-[#1A3C5E] !text-white !font-bold shadow-lg shadow-slate-200 disabled:!bg-slate-200 disabled:!text-slate-400 transition-all"
              [disabled]="isProcessing()"
              (click)="completeCheckOut()"
            >
              @if (isProcessing()) {
                <mat-icon class="animate-spin mr-2">sync</mat-icon>
                Processing...
              } @else {
                Complete Check Out
              }
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .no-subscript ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    
    /* Custom scrollbar for drawer */
    .overflow-y-auto::-webkit-scrollbar { width: 4px; }
    .overflow-y-auto::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckOutPanelComponent {
  @Input() departure!: Departure;
  @Output() dismiss = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  currentStep = signal(1);
  isProcessing = signal(false);
  
  // Form states
  cleanliness = signal(5);
  hasDamage = signal(false);
  overallRating = signal(5);

  private snackBar = inject(MatSnackBar);
  private departuresService = inject(DeparturesService);

  steps = [
    { id: 1, label: 'Billing' },
    { id: 2, label: 'Audit' },
    { id: 3, label: 'Feedback' },
    { id: 4, label: 'Confirm' }
  ];

  nextStep() {
    if (this.currentStep() < 4) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  completeCheckOut() {
    this.isProcessing.set(true);
    this.departuresService.completeCheckOut(this.departure.id).subscribe({
      next: () => {
        this.isProcessing.set(false);
        this.snackBar.open(`✓ ${this.departure.guestName} checked out successfully. Room ${this.departure.roomNumber} is now Vacant Dirty.`, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.success.emit();
      },
      error: () => {
        this.isProcessing.set(false);
        this.snackBar.open('Error during check-out. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
}
