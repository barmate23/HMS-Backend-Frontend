import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeparturesComponent } from '../../front-office/departures/departures.component';

@Component({
  selector: 'app-departures-page',
  standalone: true,
  imports: [CommonModule, DeparturesComponent],
  template: `
    <app-departures></app-departures>
  `
})
export class DeparturesPage {}
