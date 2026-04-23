import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OccupancyTrendComponent } from './occupancy-trend/occupancy-trend.component';
import { RevenueBreakdownComponent } from './revenue-breakdown/revenue-breakdown.component';
import { BookingSourceComponent } from './booking-source/booking-source.component';
import { CheckinActivityComponent } from './checkin-activity/checkin-activity.component';
import { 
  OCCUPANCY_TREND_DATA, 
  REVENUE_BREAKDOWN_DATA, 
  BOOKING_SOURCE_DATA, 
  CHECKIN_ACTIVITY_DATA 
} from '../dashboard-mock-data';
import { DashboardService } from '../../../services/dashboard';

@Component({
  selector: 'app-dashboard-analytics',
  standalone: true,
  imports: [
    CommonModule,
    OccupancyTrendComponent,
    RevenueBreakdownComponent,
    BookingSourceComponent,
    CheckinActivityComponent
  ],
  templateUrl: './dashboard-analytics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardAnalyticsComponent {
  private dashboardService = inject(DashboardService);
  
  occupancyData = OCCUPANCY_TREND_DATA;
  revenueData = REVENUE_BREAKDOWN_DATA;
  bookingSourceData = BOOKING_SOURCE_DATA;
  checkinData = CHECKIN_ACTIVITY_DATA;

  constructor() {
    effect(() => {
      // Access the signal to trigger re-fetch logic if needed
      // In this mock setup, we just log the refresh
      if (this.dashboardService.refreshTrigger()) {
        console.log('Refreshing analytics data...');
        // In a real app, you would fetch fresh data here
        this.refreshData();
      }
    });
  }

  refreshData() {
    // Re-assigning to trigger change detection in child components
    this.occupancyData = { ...OCCUPANCY_TREND_DATA };
    this.revenueData = { ...REVENUE_BREAKDOWN_DATA };
    this.bookingSourceData = { ...BOOKING_SOURCE_DATA };
    this.checkinData = { ...CHECKIN_ACTIVITY_DATA };
  }
}
