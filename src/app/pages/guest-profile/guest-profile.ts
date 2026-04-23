import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestProfilesComponent } from '../../front-office/guest-profiles/guest-profiles.component';

@Component({
  selector: 'app-guests-page',
  standalone: true,
  imports: [CommonModule, GuestProfilesComponent],
  template: `
    <app-guest-profiles></app-guest-profiles>
  `
})
export class GuestsPage {}
