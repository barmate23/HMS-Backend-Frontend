import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Arrival } from '../../models/arrival.model';

@Component({
  selector: 'app-no-show-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatInputModule
  ],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold text-hms-text-primary mb-2">Mark as No-Show?</h2>
      
      <div class="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0] mb-6">
        <div class="grid grid-cols-2 gap-y-2 text-xs">
          <span class="text-hms-text-muted">Guest:</span>
          <span class="font-bold">{{data.arrival.guestName}}</span>
          <span class="text-hms-text-muted">Res#:</span>
          <span class="font-bold">{{data.arrival.id}}</span>
          <span class="text-hms-text-muted">Room Type:</span>
          <span class="font-bold">{{data.arrival.roomType}}</span>
          <span class="text-hms-text-muted">Advance Paid:</span>
          <span class="font-bold text-success">₹{{data.arrival.advancePaid | number}}</span>
        </div>
        
        <div class="mt-4 pt-4 border-t border-[#CBD5E1] text-xs text-danger font-medium">
          No-show policy: ₹3,500 cancellation charge applies.
          Remaining ₹{{(data.arrival.advancePaid - 3500 > 0 ? data.arrival.advancePaid - 3500 : 0) | number}} will be refunded.
        </div>
      </div>

      <form [formGroup]="noShowForm" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Reason*</mat-label>
          <mat-select formControlName="reason">
            <mat-option value="Guest did not arrive">Guest did not arrive</mat-option>
            <mat-option value="Guest called to cancel">Guest called to cancel</mat-option>
            <mat-option value="OTA cancellation">OTA cancellation</mat-option>
            <mat-option value="Other">Other</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Remarks (optional)</mat-label>
          <textarea matInput rows="3" formControlName="remarks" placeholder="Any additional notes..."></textarea>
        </mat-form-field>
      </form>

      <div class="mt-8 flex justify-end gap-3">
        <button mat-button (click)="dialogRef.close()">Cancel</button>
        <button 
          mat-flat-button 
          color="warn" 
          [disabled]="noShowForm.invalid"
          (click)="confirm()"
        >
          Mark as No-Show
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoShowDialogComponent {
  noShowForm = new FormGroup({
    reason: new FormControl('Guest did not arrive', Validators.required),
    remarks: new FormControl('')
  });

  public dialogRef = inject(MatDialogRef<NoShowDialogComponent>);
  public data = inject<{ arrival: Arrival }>(MAT_DIALOG_DATA);

  confirm() {
    if (this.noShowForm.valid) {
      this.dialogRef.close(this.noShowForm.value);
    }
  }
}
