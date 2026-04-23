import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrivalsComponent } from '../../front-office/arrivals/arrivals.component';

@Component({
  selector: 'app-arrivals-page',
  standalone: true,
  imports: [CommonModule, ArrivalsComponent],
  template: `<app-arrivals></app-arrivals>`
})
export class ArrivalsPage {}
