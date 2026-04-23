import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomRackComponent } from '../../front-office/room-rack/room-rack.component';

@Component({
  selector: 'app-room-rack-page',
  standalone: true,
  imports: [CommonModule, RoomRackComponent],
  template: `
    <app-room-rack></app-room-rack>
  `
})
export class RoomRackPage {}
