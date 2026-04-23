import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InHouseComponent } from '../../front-office/in-house/in-house.component';

@Component({
  selector: 'app-in-house-page',
  standalone: true,
  imports: [CommonModule, InHouseComponent],
  template: `
    <app-in-house></app-in-house>
  `
})
export class InHousePage {}
