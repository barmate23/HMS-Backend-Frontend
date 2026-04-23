import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { GuestProfilesService } from '../../services/guest-profiles.service';
import { OverviewTabComponent } from '../tabs/overview-tab.component';
import { StayHistoryTabComponent } from '../tabs/stay-history-tab.component';
import { PreferencesTabComponent } from '../tabs/preferences-tab.component';
import { DocumentsTabComponent } from '../tabs/documents-tab.component';
import { BillingTabComponent } from '../tabs/billing-tab.component';
import { NotesTabComponent } from '../tabs/notes-tab.component';

@Component({
  selector: 'app-guest-detail-panel',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTabsModule,
    OverviewTabComponent,
    StayHistoryTabComponent,
    PreferencesTabComponent,
    DocumentsTabComponent,
    BillingTabComponent,
    NotesTabComponent
  ],
  template: `
    <div class="h-full bg-slate-50 flex flex-col overflow-hidden">
      @if (guest(); as g) {
        <!-- Header Card -->
        <div class="p-8 pb-0 shrink-0">
          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div class="flex items-start justify-between">
              <div class="flex gap-6 items-center">
                <div class="relative">
                  <img [src]="g.avatarUrl" class="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-white" alt="Guest profile">
                  @if (g.type.includes('VIP')) {
                    <div class="absolute -bottom-2 -right-2 bg-amber-400 text-white rounded-lg p-1 shadow-lg border-2 border-white">
                      <mat-icon class="!text-sm !w-4 !h-4">star</mat-icon>
                    </div>
                  }
                </div>
                <div>
                  <div class="flex items-center gap-3 mb-1">
                    <h1 class="text-2xl font-black text-[#1B3A5C] tracking-tight">{{g.firstName}} {{g.lastName}}</h1>
                    <img [src]="g.flagUrl" class="w-4 h-3 rounded-sm shadow-sm" alt="Nationality flag">
                    @if (g.type.includes('VIP')) {
                      <span class="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest border border-amber-100">VIP GUEST</span>
                    }
                  </div>
                  <div class="flex items-center gap-6">
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Stays</span>
                      <span class="text-xs font-black text-[#1B3A5C]">{{g.stayCount}}</span>
                    </div>
                    <div class="flex items-center gap-2">
                       <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nights</span>
                       <span class="text-xs font-black text-[#1B3A5C]">{{g.loyalty.totalNights}}</span>
                    </div>
                    <div class="flex items-center gap-2">
                       <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Stay</span>
                       <span class="text-xs font-black text-[#1B3A5C]">{{g.stayHistory[0]?.checkOut | date:'dd MMM yyyy'}}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="flex gap-2">
                <button mat-flat-button class="!bg-[#1B3A5C] !text-white !font-bold !rounded-xl">
                  <mat-icon class="mr-1">add</mat-icon>
                  New Reservation
                </button>
                <div class="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button mat-icon-button class="!text-slate-500 hover:!bg-white hover:!text-[#FF8C42] rounded-lg transition-all" title="Edit Profile">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button class="!text-slate-500 hover:!bg-white hover:!text-[#FF8C42] rounded-lg transition-all" title="Send Message">
                    <mat-icon>chat_bubble</mat-icon>
                  </button>
                  <button mat-icon-button class="!text-slate-500 hover:!bg-white hover:!text-[#FF8C42] rounded-lg transition-all" title="Add Note">
                    <mat-icon>rate_review</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <mat-tab-group class="flex-1 overflow-hidden hms-tabs">
          <mat-tab label="Overview">
            <div class="p-8 h-full overflow-y-auto custom-scrollbar">
              <app-overview-tab [guest]="g"></app-overview-tab>
            </div>
          </mat-tab>
          <mat-tab label="Stay History">
            <div class="p-8 h-full overflow-y-auto custom-scrollbar">
              <app-stay-history-tab [guest]="g"></app-stay-history-tab>
            </div>
          </mat-tab>
          <mat-tab label="Preferences">
            <div class="p-8 h-full overflow-y-auto custom-scrollbar">
              <app-preferences-tab [guest]="g"></app-preferences-tab>
            </div>
          </mat-tab>
          <mat-tab label="Documents">
            <div class="p-8 h-full overflow-y-auto custom-scrollbar">
              <app-documents-tab [guest]="g"></app-documents-tab>
            </div>
          </mat-tab>
          <mat-tab label="Billing">
            <div class="p-8 h-full overflow-y-auto custom-scrollbar">
              <app-billing-tab [guest]="g"></app-billing-tab>
            </div>
          </mat-tab>
          <mat-tab label="Notes">
            <div class="p-8 h-full overflow-y-auto custom-scrollbar">
              <app-notes-tab [guest]="g"></app-notes-tab>
            </div>
          </mat-tab>
        </mat-tab-group>
      } @else {
        <div class="flex-1 flex flex-col items-center justify-center p-20 text-center animate-in fade-in duration-500">
          <div class="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6 relative group overflow-hidden">
             <div class="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50 transition-colors"></div>
             <mat-icon class="text-5xl text-slate-200 group-hover:text-blue-200 transition-colors z-10">person_search</mat-icon>
          </div>
          <h2 class="text-xl font-black text-[#1B3A5C] mb-2 tracking-tight">No Guest Selected</h2>
          <p class="text-sm font-bold text-slate-400 max-w-[280px] uppercase tracking-widest leading-relaxed">
            Please select a guest from the left panel to view their complete profile
          </p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    ::ng-deep .hms-tabs { height: 100%; display: flex; flex-direction: column; }
    ::ng-deep .hms-tabs .mat-mdc-tab-header { border-bottom: none !important; margin: 0 32px !important; }
    ::ng-deep .hms-tabs .mat-mdc-tab-labels { gap: 12px; }
    ::ng-deep .hms-tabs .mdc-tab { height: 48px !important; min-width: 80px !important; padding: 0 16px !important; }
    ::ng-deep .hms-tabs .mdc-tab__text-label { font-size: 11px !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: 0.1em !important; color: #94A3B8 !important; }
    ::ng-deep .hms-tabs .mdc-tab--active .mdc-tab__text-label { color: #1B3A5C !important; }
    ::ng-deep .hms-tabs .mat-mdc-tab-indicator .mdc-tab-indicator__content--underline { border-width: 3px !important; border-top-left-radius: 4px; border-top-right-radius: 4px; border-color: #FF8C42 !important; }
    ::ng-deep .hms-tabs .mat-mdc-tab-body-wrapper { flex: 1; min-height: 0; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 4px; }
  `]
})
export class GuestDetailPanelComponent {
  private service = inject(GuestProfilesService);
  guest = this.service.selectedGuest;
}
