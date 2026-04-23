import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RoomRackFilters, RoomType } from '../../models/room-rack.model';

@Component({
  selector: 'app-room-rack-filter-toolbar',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatInputModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="bg-white px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-4 flex-1">
        <!-- Search -->
        <mat-form-field appearance="outline" class="w-64 no-subscript hms-input">
          <mat-icon matPrefix class="text-slate-400 ml-2">search</mat-icon>
          <input matInput placeholder="Search Room, Guest, ID..." [formControl]="searchControl">
        </mat-form-field>

        <!-- Floor Filter -->
        <mat-form-field appearance="outline" class="w-40 no-subscript hms-select">
          <mat-select [formControl]="floorControl" multiple placeholder="All Floors">
            @for (floor of floors; track floor) {
              <mat-option [value]="floor">Floor {{floor}}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <!-- Room Type Filter -->
        <mat-form-field appearance="outline" class="w-48 no-subscript hms-select">
          <mat-select [formControl]="typeControl" multiple placeholder="All Room Types">
            @for (type of roomTypes; track type) {
              <mat-option [value]="type">{{type}}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <!-- View Options -->
        <div class="flex items-center bg-slate-100 p-1 rounded-xl">
          @for (option of viewOptions; track option.value) {
            <button 
              (click)="setView(option.value)"
              [class]="currentDays === option.value ? 'bg-white text-[#1B3A5C] shadow-sm' : 'text-slate-500 hover:text-slate-700'"
              class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              {{option.label}}
            </button>
          }
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button mat-stroked-button class="!border-slate-200 !text-slate-600 !font-bold">
          <mat-icon class="mr-1">print</mat-icon>
          Print
        </button>
        <button mat-stroked-button class="!border-slate-200 !text-slate-600 !font-bold">
          <mat-icon class="mr-1">file_download</mat-icon>
          Export
        </button>
        <button (click)="goToToday.emit()" mat-flat-button class="!bg-[#FF8C42] !text-white !font-bold">
          <mat-icon class="mr-1">today</mat-icon>
          Go to Today
        </button>
      </div>
    </div>
  `,
  styles: [`
    .no-subscript ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    ::ng-deep .hms-input .mat-mdc-form-field-flex { height: 40px !important; border-radius: 10px !important; }
    ::ng-deep .hms-select .mat-mdc-form-field-flex { height: 40px !important; border-radius: 10px !important; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomRackFilterToolbarComponent {
  @Input() floors: number[] = [1, 2, 3, 4, 5];
  @Input() roomTypes: RoomType[] = ['Single', 'Double', 'Suite', 'Deluxe Suite', 'Penthouse'];
  @Input() currentDays = 7;
  
  @Output() filtersChanged = new EventEmitter<Partial<RoomRackFilters>>();
  @Output() daysChanged = new EventEmitter<7 | 14 | 30>();
  @Output() goToToday = new EventEmitter<void>();

  searchControl = new FormControl('');
  floorControl = new FormControl<number[]>([]);
  typeControl = new FormControl<RoomType[]>([]);

  viewOptions = [
    { label: '7 Days', value: 7 as const },
    { label: '14 Days', value: 14 as const },
    { label: '30 Days', value: 30 as const }
  ];

  constructor() {
    this.searchControl.valueChanges.subscribe(() => this.emitFilters());
    this.floorControl.valueChanges.subscribe(() => this.emitFilters());
    this.typeControl.valueChanges.subscribe(() => this.emitFilters());
  }

  private emitFilters() {
    this.filtersChanged.emit({
      search: this.searchControl.value || '',
      floors: this.floorControl.value || [],
      roomTypes: this.typeControl.value || []
    });
  }

  setView(days: 7 | 14 | 30) {
    this.daysChanged.emit(days);
  }
}
