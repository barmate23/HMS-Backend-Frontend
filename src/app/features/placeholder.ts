import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="flex flex-col items-center justify-center h-full text-surface-400 space-y-4">
      <mat-icon class="text-6xl h-16 w-16">construction</mat-icon>
      <div class="text-center">
        <h2 class="text-xl font-bold text-surface-900">Module Under Construction</h2>
        <p>We are currently building this part of the LuxeStay HMS.</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Placeholder {}

// Exporting as different names for the routes
export { Placeholder as Reservations };
export { Placeholder as FrontOffice };
export { Placeholder as Housekeeping };
export { Placeholder as Pos };
export { Placeholder as Inventory };
export { Placeholder as FbCosting };
export { Placeholder as Banquet };
export { Placeholder as Crm };
export { Placeholder as Accounting };
export { Placeholder as Settings };
