import { Component, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ArrivalFilters } from '../../models/arrival.model';

@Component({
  selector: 'app-arrivals-filter-bar',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <form [formGroup]="filterForm" class="flex flex-wrap items-center gap-6">
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filters:</span>
        
        <mat-form-field appearance="outline" class="w-[160px] no-subscript hms-select-field">
          <mat-select formControlName="status">
            <mat-option value="all">All Statuses</mat-option>
            <mat-option value="pending">Pending</mat-option>
            <mat-option value="confirmed">Confirmed</mat-option>
            <mat-option value="vip">VIP</mat-option>
            <mat-option value="checked-in">Checked In</mat-option>
            <mat-option value="no-show">No Show</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-[160px] no-subscript hms-select-field">
          <mat-select formControlName="roomType">
            <mat-option value="all">All Room Types</mat-option>
            <mat-option value="Standard">Standard</mat-option>
            <mat-option value="Deluxe">Deluxe</mat-option>
            <mat-option value="Junior Suite">Junior Suite</mat-option>
            <mat-option value="Suite">Suite</mat-option>
            <mat-option value="Presidential">Presidential</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-[160px] no-subscript hms-select-field">
          <mat-select formControlName="source">
            <mat-option value="all">All Sources</mat-option>
            <mat-option value="Walk-in">Walk-in</mat-option>
            <mat-option value="Phone">Phone</mat-option>
            <mat-option value="Booking.com">Booking.com</mat-option>
            <mat-option value="Agoda">Agoda</mat-option>
            <mat-option value="Airbnb">Airbnb</mat-option>
            <mat-option value="Corporate">Corporate</mat-option>
            <mat-option value="Direct">Direct</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      @if (isAnyFilterActive) {
        <button mat-button class="!text-xs !font-bold !text-rose-500 hover:!bg-rose-50 !rounded-lg" (click)="clearFilters()">
          <mat-icon class="mr-1 !text-sm">filter_list_off</mat-icon>
          Reset
        </button>
      }
    </form>
  `,
  styles: [`
    :host { display: block; }
    .no-subscript ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    ::ng-deep .hms-select-field .mat-mdc-form-field-flex { height: 36px !important; background-color: white !important; border-radius: 8px !important; }
    ::ng-deep .hms-select-field .mat-mdc-form-field-infix { padding-top: 6px !important; padding-bottom: 6px !important; }
    ::ng-deep .hms-select-field .mat-mdc-select-value { font-size: 12px; font-weight: 600; color: #475569; }
  `],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrivalsFilterBarComponent implements OnInit, OnDestroy {
  @Output() filtersChanged = new EventEmitter<ArrivalFilters>();

  filterForm = new FormGroup({
    status: new FormControl('all'),
    roomType: new FormControl('all'),
    source: new FormControl('all')
  });

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(values => {
        this.filtersChanged.emit(values as ArrivalFilters);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isAnyFilterActive(): boolean {
    const values = this.filterForm.value;
    return values.status !== 'all' || values.roomType !== 'all' || values.source !== 'all';
  }

  clearFilters() {
    this.filterForm.reset({
      status: 'all',
      roomType: 'all',
      source: 'all'
    });
  }
}
