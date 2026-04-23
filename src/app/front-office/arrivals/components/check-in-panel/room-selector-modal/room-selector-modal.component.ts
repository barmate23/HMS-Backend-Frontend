import { Component, OnInit, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { Room, RoomType } from '../../../models/arrival.model';
import { ArrivalsService } from '../../../services/arrivals.service';

@Component({
  selector: 'app-room-selector-modal',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule,
    MatSelectModule, 
    MatChipsModule
  ],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold text-hms-text-primary">Select Room — {{data.roomType}}</h2>
          <p class="text-xs text-hms-text-muted">Choose an available room for the guest</p>
        </div>
        <button mat-icon-button (click)="dialogRef.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="flex items-center gap-4 mb-6">
        <mat-form-field appearance="outline" class="w-[200px] no-subscript">
          <mat-select [value]="data.roomType" (selectionChange)="onTypeChange($event.value)">
            <mat-option value="Standard">Standard</mat-option>
            <mat-option value="Deluxe">Deluxe</mat-option>
            <mat-option value="Junior Suite">Junior Suite</mat-option>
            <mat-option value="Suite">Suite</mat-option>
            <mat-option value="Presidential">Presidential</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="flex gap-2">
          <mat-chip-listbox multiple>
            <mat-chip-option>Sea View</mat-chip-option>
            <mat-chip-option>Garden View</mat-chip-option>
            <mat-chip-option>Smoking</mat-chip-option>
            <mat-chip-option>Non-Smoking</mat-chip-option>
          </mat-chip-listbox>
        </div>
      </div>

      <div class="grid grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2">
        @for (room of rooms(); track room.id) {
          <button 
            type="button"
            (click)="selectRoom(room)"
            [class.selected]="selectedRoom()?.id === room.id"
            [class.disabled]="room.status === 'Occupied' || room.status === 'OOO'"
            class="room-card p-3 rounded-lg border-2 cursor-pointer transition-all text-left w-full"
            [ngClass]="getRoomStatusClass(room.status)"
          >
            <div class="flex justify-between items-start mb-2">
              <span class="text-[10px] font-bold uppercase">{{room.floor}}</span>
              <mat-icon class="text-xs w-3 h-3">{{getViewIcon(room.view)}}</mat-icon>
            </div>
            <div class="text-center py-2">
              <h4 class="text-xl font-bold">{{room.number}}</h4>
            </div>
            <div class="text-[9px] font-bold text-center uppercase mt-1">
              {{room.status}}
            </div>
          </button>
        }
      </div>

      <div class="mt-8 pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
        <div class="text-sm">
          @if (selectedRoom()) {
            <span class="font-bold text-hms-text-primary">
              Room {{selectedRoom()?.number}} — {{selectedRoom()?.type}} — {{selectedRoom()?.floor}} — {{selectedRoom()?.view}} View
            </span>
          } @else {
            <span class="text-hms-text-muted italic">No room selected</span>
          }
        </div>
        <div class="flex gap-3">
          <button mat-button (click)="dialogRef.close()">Cancel</button>
          <button mat-flat-button color="primary" [disabled]="!selectedRoom()" (click)="confirm()">
            Confirm Room Selection
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .no-subscript ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    .room-card { height: 100px; display: flex; flex-direction: column; justify-content: space-between; }
    .room-card.selected { border-color: #1A3C5E !important; background-color: #F0F4FF; }
    .room-card.disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
    
    .status-clean { border-color: #2D9E6B; color: #155724; }
    .status-dirty { border-color: #F4A261; color: #856404; }
    .status-occupied { border-color: #94A3B8; color: #475569; background-color: #F1F5F9; }
    .status-ooo { border-color: #E63946; color: #721C24; text-decoration: line-through; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomSelectorModalComponent implements OnInit {
  rooms = signal<Room[]>([]);
  selectedRoom = signal<Room | null>(null);

  public dialogRef = inject(MatDialogRef<RoomSelectorModalComponent>);
  public data = inject<{ roomType: RoomType }>(MAT_DIALOG_DATA);
  private arrivalsService = inject(ArrivalsService);

  ngOnInit() {
    this.loadRooms(this.data.roomType);
  }

  loadRooms(type: RoomType) {
    this.arrivalsService.getAvailableRooms(type, new Date(), new Date()).subscribe((rooms: Room[]) => {
      this.rooms.set(rooms);
    });
  }

  onTypeChange(type: RoomType) {
    this.loadRooms(type);
  }

  selectRoom(room: Room) {
    if (room.status === 'Occupied' || room.status === 'OOO') return;
    this.selectedRoom.set(room);
  }

  getRoomStatusClass(status: string) {
    switch (status) {
      case 'Vacant Clean': return 'status-clean';
      case 'Vacant Dirty': return 'status-dirty';
      case 'Occupied': return 'status-occupied';
      case 'OOO': return 'status-ooo';
      default: return '';
    }
  }

  getViewIcon(view: string) {
    switch (view) {
      case 'Sea': return 'waves';
      case 'Garden': return 'park';
      case 'City': return 'apartment';
      default: return 'visibility';
    }
  }

  confirm() {
    if (this.selectedRoom()) {
      this.dialogRef.close(this.selectedRoom());
    }
  }
}
