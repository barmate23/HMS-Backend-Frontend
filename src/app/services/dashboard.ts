import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  refreshTrigger = signal(false);

  triggerRefresh() {
    this.refreshTrigger.set(!this.refreshTrigger());
  }
}
