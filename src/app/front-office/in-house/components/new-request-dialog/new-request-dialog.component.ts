import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InHouseService } from '../../services/in-house.service';
import { RequestType, RequestPriority } from '../../models/in-house.model';

@Component({
  selector: 'app-new-request-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="p-6 max-w-md w-full bg-white rounded-3xl overflow-hidden">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-[#1A3C5E] rounded-xl flex items-center justify-center text-white">
            <mat-icon>add_task</mat-icon>
          </div>
          <h2 class="text-xl font-black text-slate-900 tracking-tight">New Service Request</h2>
        </div>
        <button mat-icon-button (click)="dialogRef.close()" class="text-slate-400">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form [formGroup]="requestForm" (ngSubmit)="onSubmit()" class="space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full no-subscript">
            <mat-label>Room Number</mat-label>
            <input matInput formControlName="roomNumber" placeholder="e.g. 305">
            @if (requestForm.get('roomNumber')?.invalid && requestForm.get('roomNumber')?.touched) {
              <mat-error class="text-[10px]">Required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full no-subscript">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="normal">Normal</mat-option>
              <mat-option value="high">High</mat-option>
              <mat-option value="urgent">Urgent</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full no-subscript">
          <mat-label>Request Type</mat-label>
          <mat-select formControlName="type">
            <mat-option value="housekeeping">Housekeeping</mat-option>
            <mat-option value="maintenance">Maintenance</mat-option>
            <mat-option value="room-service">Room Service</mat-option>
            <mat-option value="concierge">Concierge</mat-option>
            <mat-option value="other">Other</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full no-subscript">
          <mat-label>Request Title</mat-label>
          <input matInput formControlName="title" placeholder="e.g. Extra Towels">
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full no-subscript">
          <mat-label>Description (Optional)</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Add more details..."></textarea>
        </mat-form-field>

        <div class="pt-4 flex gap-3">
          <button type="button" mat-stroked-button class="flex-1 !h-12 !rounded-xl !font-bold !text-slate-600" (click)="dialogRef.close()">
            Cancel
          </button>
          <button type="submit" mat-flat-button class="flex-[2] !h-12 !rounded-xl !bg-[#1A3C5E] !text-white !font-bold shadow-lg shadow-slate-200" [disabled]="requestForm.invalid || isSubmitting()">
            @if (isSubmitting()) {
              <mat-icon class="animate-spin mr-2">sync</mat-icon>
              Creating...
            } @else {
              Create Request
            }
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .no-subscript ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    ::ng-deep .mat-mdc-form-field-flex { border-radius: 12px !important; }
  `]
})
export class NewRequestDialogComponent {
  dialogRef = inject(MatDialogRef<NewRequestDialogComponent>);
  private inHouseService = inject(InHouseService);
  
  isSubmitting = signal(false);

  requestForm = new FormGroup({
    roomNumber: new FormControl('', [Validators.required]),
    type: new FormControl<RequestType>('housekeeping', [Validators.required]),
    priority: new FormControl<RequestPriority>('normal', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('')
  });

  onSubmit() {
    if (this.requestForm.valid) {
      this.isSubmitting.set(true);
      // In a real app, we'd call the service to save.
      // For now, we simulate a delay and close.
      setTimeout(() => {
        this.isSubmitting.set(false);
        this.dialogRef.close(this.requestForm.value);
      }, 1000);
    }
  }
}
