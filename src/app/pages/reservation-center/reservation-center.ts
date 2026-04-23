import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HotelService, Reservation, Room, RoomPlan, GuestType, PaymentMode } from '../../services/hotel';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reservation-center',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-8">
      <!-- Header with View Toggle -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 class="text-2xl font-bold text-hms-text-primary dark:text-dark-text-primary">Reservation Center</h1>
          <p class="text-xs text-hms-text-muted font-bold uppercase tracking-widest mt-1">Gatekeeper of hotel inventory</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="bg-hms-surface dark:bg-dark-surface p-1 rounded-xl border border-hms-border dark:border-dark-border flex items-center shadow-sm">
            <button 
              (click)="viewMode.set('list')"
              [class]="viewMode() === 'list' ? 'bg-hms-background dark:bg-dark-background shadow-sm text-primary' : 'text-hms-text-muted hover:text-hms-text-primary dark:hover:text-dark-text-primary'"
              class="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <mat-icon class="text-sm">list</mat-icon>
              List
            </button>
            <button 
              (click)="viewMode.set('timeline')"
              [class]="viewMode() === 'timeline' ? 'bg-hms-background dark:bg-dark-background shadow-sm text-primary' : 'text-hms-text-muted hover:text-hms-text-primary dark:hover:text-dark-text-primary'"
              class="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <mat-icon class="text-sm">calendar_view_month</mat-icon>
              Stay
            </button>
            <button 
              (click)="viewMode.set('map')"
              [class]="viewMode() === 'map' ? 'bg-hms-background dark:bg-dark-background shadow-sm text-primary' : 'text-hms-text-muted hover:text-hms-text-primary dark:hover:text-dark-text-primary'"
              class="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <mat-icon class="text-sm">map</mat-icon>
              Map
            </button>
          </div>
          <button 
            (click)="openBookingModal()"
            class="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <mat-icon>add</mat-icon>
            New Booking
          </button>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="bg-hms-surface dark:bg-dark-surface p-4 rounded-2xl border border-hms-border dark:border-dark-border shadow-sm flex flex-wrap items-center gap-6">
        <div class="relative flex-1 min-w-[300px] group">
          <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-hms-text-muted text-sm group-focus-within:text-primary transition-colors">search</mat-icon>
          <input 
            type="text" 
            placeholder="Search guest, email, reservation ID or room..." 
            class="w-full pl-10 pr-4 py-2.5 bg-hms-background dark:bg-dark-background border border-hms-border dark:border-dark-border rounded-xl text-xs focus:outline-none focus:border-primary transition-all dark:text-dark-text-primary"
          >
        </div>
        
        <div class="flex items-center gap-4">
          <select class="bg-hms-background dark:bg-dark-background border border-hms-border dark:border-dark-border rounded-xl px-4 py-2.5 text-xs font-bold text-hms-text-primary dark:text-dark-text-primary focus:outline-none focus:border-primary transition-all" aria-label="Filter by status">
            <option>All Status</option>
            <option>Confirmed</option>
            <option>Checked In</option>
            <option>Checked Out</option>
          </select>
          
          <div class="h-8 w-px bg-hms-border dark:bg-dark-border"></div>
          
          <div class="flex items-center gap-3 text-xs font-bold text-hms-text-muted">
            <mat-icon class="text-sm">date_range</mat-icon>
            <span class="tabular-nums">{{timelineDays[0] | date:'MMM d'}} - {{timelineDays[14] | date:'MMM d, yyyy'}}</span>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="min-h-[600px]">
        @if (viewMode() === 'list') {
          <div class="bg-hms-surface dark:bg-dark-surface rounded-2xl border border-hms-border dark:border-dark-border shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-hms-background dark:bg-dark-background">
                    <th class="px-6 py-4 text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Guest Details</th>
                    <th class="px-6 py-4 text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Room & Plan</th>
                    <th class="px-6 py-4 text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Stay Period</th>
                    <th class="px-6 py-4 text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Status</th>
                    <th class="px-6 py-4 text-[10px] font-bold text-hms-text-muted uppercase tracking-widest text-right">Billing</th>
                    <th class="px-6 py-4 text-[10px] font-bold text-hms-text-muted uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-hms-border dark:divide-dark-border">
                  @for (res of hotelService.reservations(); track res.id) {
                    <tr class="hover:bg-hms-background/50 dark:hover:bg-dark-background/50 transition-colors group">
                      <td class="px-6 py-4">
                        <div class="flex items-center">
                          <div class="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mr-4">
                            {{res.guestName.charAt(0)}}
                          </div>
                          <div>
                            <div class="flex items-center gap-2">
                              <p class="text-sm font-bold text-hms-text-primary dark:text-dark-text-primary">{{res.guestName}}</p>
                              <span class="text-[8px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-bold uppercase tracking-widest">{{res.guestType}}</span>
                            </div>
                            <p class="text-[10px] text-hms-text-muted font-bold">{{res.guestEmail}} • {{res.guestPhone}}</p>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex flex-col">
                          <span class="text-sm font-bold text-hms-text-primary dark:text-dark-text-primary tabular-nums">Room {{getRoomNumber(res.roomId)}}</span>
                          <div class="flex items-center gap-2">
                            <span class="text-[10px] text-hms-text-muted font-bold uppercase tracking-widest">{{res.roomType}}</span>
                            <span class="text-[10px] text-primary font-bold uppercase tracking-widest">{{res.plan}}</span>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex flex-col">
                          <div class="text-xs font-bold text-hms-text-primary dark:text-dark-text-primary tabular-nums">
                            {{res.checkIn | date:'MMM d'}} - {{res.checkOut | date:'MMM d'}}
                          </div>
                          <div class="flex items-center gap-2 mt-1">
                            <span class="text-[9px] text-hms-text-muted font-bold uppercase tracking-widest">
                              {{getNights(res.checkIn, res.checkOut)}} nights
                            </span>
                            <span class="text-[9px] text-hms-text-muted font-bold uppercase tracking-widest">
                              {{res.adults}}A, {{res.children}}C
                            </span>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span [class]="getStatusClass(res.status)" class="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                          {{res.status}}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-right">
                        <div class="flex flex-col items-end">
                          <p class="text-sm font-bold text-hms-text-primary dark:text-dark-text-primary tabular-nums">₹{{res.totalAmount | number}}</p>
                          @if (res.advance > 0) {
                            <p class="text-[9px] text-success font-bold uppercase tracking-widest">Paid: ₹{{res.advance | number}}</p>
                          }
                        </div>
                      </td>
                      <td class="px-6 py-4 text-right">
                        <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button class="p-2 text-hms-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View Details">
                            <mat-icon class="text-sm">visibility</mat-icon>
                          </button>
                          <button class="p-2 text-hms-text-muted hover:text-danger hover:bg-danger/5 rounded-lg transition-all" title="Cancel Reservation">
                            <mat-icon class="text-sm">cancel</mat-icon>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        } @else if (viewMode() === 'timeline') {
          <!-- Timeline View (Stay Overview) -->
          <div class="bg-hms-surface dark:bg-dark-surface rounded-2xl border border-hms-border dark:border-dark-border shadow-sm overflow-hidden flex flex-col h-[700px]">
            <div class="flex border-b border-hms-border dark:border-dark-border flex-shrink-0">
              <div class="w-56 flex-shrink-0 p-5 border-r border-hms-border dark:border-dark-border bg-hms-background dark:bg-dark-background font-bold text-[10px] uppercase text-hms-text-muted tracking-widest flex items-center gap-3">
                <mat-icon class="text-sm">hotel</mat-icon>
                Room Inventory
              </div>
              <div class="flex-1 flex overflow-x-auto no-scrollbar bg-hms-background dark:bg-dark-background">
                @for (day of timelineDays; track day) {
                  <div class="w-28 flex-shrink-0 p-4 text-center border-r border-hms-border dark:border-dark-border" [class.bg-primary/5]="isToday(day)">
                    <p class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">{{day | date:'EEE'}}</p>
                    <p class="text-sm font-bold text-hms-text-primary dark:text-dark-text-primary tabular-nums">{{day | date:'d'}}</p>
                  </div>
                }
              </div>
            </div>
            <div class="flex-1 overflow-y-auto overflow-x-auto no-scrollbar">
              @for (room of hotelService.rooms(); track room.id) {
                <div class="flex border-b border-hms-border dark:border-dark-border group min-w-max">
                  <div class="w-56 flex-shrink-0 p-5 border-r border-hms-border dark:border-dark-border bg-hms-surface dark:bg-dark-surface group-hover:bg-primary/5 transition-colors flex flex-col justify-center">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-bold text-hms-text-primary dark:text-dark-text-primary tabular-nums">Room {{room.number}}</p>
                      <div [class]="getRoomStatusColor(room.status)" class="w-2.5 h-2.5 rounded-full shadow-sm" [title]="room.status"></div>
                    </div>
                    <div class="flex items-center justify-between mt-1">
                      <p class="text-[10px] text-hms-text-muted font-bold uppercase tracking-widest">{{room.type}}</p>
                      <p class="text-[9px] text-hms-text-muted font-bold uppercase tracking-widest">FL {{room.floor}}</p>
                    </div>
                  </div>
                  <div class="flex-1 flex relative h-20">
                    @for (day of timelineDays; track day) {
                      <div class="w-28 flex-shrink-0 border-r border-hms-border/50 dark:border-dark-border/50 h-full"></div>
                    }
                    <!-- Occupancy Bars -->
                    @for (res of getReservationsForRoom(room.id); track res.id) {
                      <div 
                        [style.left.px]="getTimelineOffset(res.checkIn)"
                        [style.width.px]="getTimelineWidth(res.checkIn, res.checkOut)"
                        [class]="getTimelineStatusClass(res.status)"
                        class="absolute top-3 h-14 rounded-2xl flex items-center px-4 shadow-lg cursor-pointer hover:scale-[1.02] transition-all z-10 border-2 overflow-hidden group/bar"
                        [attr.aria-label]="'Reservation for ' + res.guestName"
                      >
                        <div class="flex flex-col min-w-0">
                          <span class="text-[11px] font-bold truncate leading-tight group-hover/bar:text-primary transition-colors">{{res.guestName}}</span>
                          <div class="flex items-center gap-2 mt-0.5">
                            <span class="text-[9px] font-bold uppercase tracking-widest opacity-80">{{res.status}}</span>
                            <span class="text-[9px] font-bold uppercase tracking-widest opacity-80">{{res.plan}}</span>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        } @else if (viewMode() === 'map') {
          <!-- Map View (Floor Plan) -->
          <div class="space-y-10">
            @for (floor of floors(); track floor) {
              <div class="space-y-6">
                <div class="flex items-center gap-4 px-2">
                  <div class="h-10 w-10 rounded-xl bg-hms-text-primary dark:bg-dark-text-primary text-hms-surface dark:text-dark-surface flex items-center justify-center font-bold text-sm shadow-lg">
                    {{floor}}
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-hms-text-primary dark:text-dark-text-primary">Floor {{floor}}</h3>
                    <p class="text-[10px] text-hms-text-muted font-bold uppercase tracking-widest">Inventory Distribution</p>
                  </div>
                  <div class="h-px flex-1 bg-hms-border dark:bg-dark-border ml-6"></div>
                </div>
                
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  @for (room of getRoomsByFloor(floor); track room.id) {
                    <div 
                      class="bg-hms-surface dark:bg-dark-surface p-5 rounded-2xl border border-hms-border dark:border-dark-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
                      [class.opacity-60]="room.status === 'Maintenance'"
                    >
                      <div class="flex justify-between items-start mb-5">
                        <span class="text-xl font-bold text-hms-text-primary dark:text-dark-text-primary tabular-nums">#{{room.number}}</span>
                        <div [class]="getRoomStatusColor(room.status)" class="w-3 h-3 rounded-full shadow-lg"></div>
                      </div>
                      
                      <div class="space-y-1.5">
                        <p class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">{{room.type}}</p>
                        <p class="text-sm font-bold text-hms-text-primary dark:text-dark-text-primary tabular-nums">₹{{room.price | number}}</p>
                      </div>

                      <div class="mt-5 pt-4 border-t border-hms-border dark:border-dark-border flex items-center justify-between">
                        <span class="text-[9px] font-bold uppercase tracking-widest" [class]="getRoomStatusTextColor(room.status)">
                          {{room.status}}
                        </span>
                        @if (room.status === 'Available') {
                          <button 
                            (click)="quickBook(room)"
                            class="p-2 bg-primary/10 text-primary rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white shadow-lg shadow-primary/10"
                            title="Quick Book"
                          >
                            <mat-icon class="text-sm block">add</mat-icon>
                          </button>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Legend -->
            <div class="flex items-center justify-center gap-10 py-8 border-t border-hms-border dark:border-dark-border">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-success shadow-lg shadow-success/20"></div>
                <span class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Available</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-warning shadow-lg shadow-warning/20"></div>
                <span class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Occupied</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-danger shadow-lg shadow-danger/20"></div>
                <span class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Dirty</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-hms-text-muted shadow-lg shadow-hms-text-muted/20"></div>
                <span class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Maintenance</span>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- New Booking Modal (Split-Pane Interface) -->
    @if (showBookingModal()) {
      <div class="fixed inset-0 bg-hms-text-primary/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div class="bg-hms-surface dark:bg-dark-surface w-full max-w-7xl h-[90vh] rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col border border-hms-border dark:border-dark-border">
          <!-- Modal Header -->
          <div class="p-8 border-b border-hms-border dark:border-dark-border flex items-center justify-between bg-hms-background dark:bg-dark-background">
            <div>
              <h3 class="text-2xl font-bold text-hms-text-primary dark:text-dark-text-primary">New Reservation</h3>
              <p class="text-xs text-hms-text-muted font-bold uppercase tracking-widest mt-1">Capture guest intent and block inventory</p>
            </div>
            <div class="flex items-center gap-8">
              <div class="text-right">
                <p class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Reservation ID</p>
                <p class="text-lg font-mono font-bold text-primary tracking-tighter">{{generatedResId}}</p>
              </div>
              <button (click)="closeBookingModal()" class="w-12 h-12 flex items-center justify-center hover:bg-hms-border dark:hover:bg-dark-border rounded-2xl transition-all" aria-label="Close modal">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>
          
          <!-- Split Pane Content -->
          <div class="flex-1 flex overflow-hidden" [formGroup]="bookingForm">
            <!-- Left Pane: Metadata & Parameters -->
            <div class="w-1/2 p-10 overflow-y-auto border-r border-hms-border dark:border-dark-border space-y-10 no-scrollbar">
              <!-- Guest Information -->
              <section class="space-y-6">
                <div class="flex items-center gap-3 pb-3 border-b border-hms-border dark:border-dark-border">
                  <mat-icon class="text-primary text-sm">person</mat-icon>
                  <h4 class="text-xs font-bold text-hms-text-primary dark:text-dark-text-primary uppercase tracking-widest">Guest Information</h4>
                </div>
                <div class="grid grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label for="guestName" class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Guest Name</label>
                    <input id="guestName" formControlName="guestName" type="text" placeholder="Full Name" class="w-full px-5 py-3 bg-hms-background dark:bg-dark-background border border-hms-border dark:border-dark-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm transition-all dark:text-dark-text-primary">
                  </div>
                  <div class="space-y-2">
                    <label for="guestPhone" class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Contact Number</label>
                    <input id="guestPhone" formControlName="guestPhone" type="text" placeholder="+91 00000 00000" class="w-full px-5 py-3 bg-hms-background dark:bg-dark-background border border-hms-border dark:border-dark-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm transition-all dark:text-dark-text-primary">
                  </div>
                  <div class="space-y-2">
                    <label for="guestEmail" class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Email ID</label>
                    <input id="guestEmail" formControlName="guestEmail" type="email" placeholder="email@example.com" class="w-full px-5 py-3 bg-hms-background dark:bg-dark-background border border-hms-border dark:border-dark-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm transition-all dark:text-dark-text-primary">
                  </div>
                  <div class="space-y-2">
                    <label for="guestType" class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Guest Type</label>
                    <select id="guestType" formControlName="guestType" class="w-full px-5 py-3 bg-hms-background dark:bg-dark-background border border-hms-border dark:border-dark-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm transition-all dark:text-dark-text-primary font-bold">
                      <option value="New">New Guest</option>
                      <option value="Repeat">Repeat Guest</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                  <div class="col-span-2 space-y-2">
                    <label for="companyName" class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Company/Agency Name (Optional)</label>
                    <input id="companyName" formControlName="companyName" type="text" placeholder="Corporate Tie-up / Agent" class="w-full px-5 py-3 bg-hms-background dark:bg-dark-background border border-hms-border dark:border-dark-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm transition-all dark:text-dark-text-primary">
                  </div>
                </div>
              </section>

              <!-- Stay Information -->
              <section class="space-y-6">
                <div class="flex items-center gap-3 pb-3 border-b border-hms-border dark:border-dark-border">
                  <mat-icon class="text-primary text-sm">event</mat-icon>
                  <h4 class="text-xs font-bold text-hms-text-primary dark:text-dark-text-primary uppercase tracking-widest">Stay Parameters</h4>
                </div>
                <div class="grid grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label for="checkIn" class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Arrival Date</label>
                    <input id="checkIn" formControlName="checkIn" type="date" class="w-full px-5 py-3 bg-hms-background dark:bg-dark-background border border-hms-border dark:border-dark-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm transition-all dark:text-dark-text-primary font-bold">
                  </div>
                  <div class="space-y-2">
                    <label for="checkOut" class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Departure Date</label>
                    <input id="checkOut" formControlName="checkOut" type="date" class="w-full px-5 py-3 bg-hms-background dark:bg-dark-background border border-hms-border dark:border-dark-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm transition-all dark:text-dark-text-primary font-bold">
                  </div>
                  <div class="space-y-2">
                    <label for="adults" class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Adults</label>
                    <input id="adults" formControlName="adults" type="number" min="1" class="w-full px-5 py-3 bg-hms-background dark:bg-dark-background border border-hms-border dark:border-dark-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm transition-all dark:text-dark-text-primary font-bold tabular-nums">
                  </div>
                  <div class="space-y-2">
                    <label for="children" class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Children</label>
                    <input id="children" formControlName="children" type="number" min="0" class="w-full px-5 py-3 bg-hms-background dark:bg-dark-background border border-hms-border dark:border-dark-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm transition-all dark:text-dark-text-primary font-bold tabular-nums">
                  </div>
                </div>
              </section>

              <!-- Billing & Plan -->
              <section class="space-y-6">
                <div class="flex items-center gap-3 pb-3 border-b border-hms-border dark:border-dark-border">
                  <mat-icon class="text-primary text-sm">payments</mat-icon>
                  <h4 class="text-xs font-bold text-hms-text-primary dark:text-dark-text-primary uppercase tracking-widest">Billing & Plan Selection</h4>
                </div>
                <div class="grid grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label for="plan" class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Room Plan</label>
                    <select id="plan" formControlName="plan" class="w-full px-5 py-3 bg-hms-background dark:bg-dark-background border border-hms-border dark:border-dark-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm transition-all dark:text-dark-text-primary font-bold">
                      <option value="EP">EP (Room Only)</option>
                      <option value="CP">CP (Room + Breakfast)</option>
                      <option value="MAP">MAP (Room + 2 Meals)</option>
                      <option value="AP">AP (All Meals)</option>
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label for="paymentMode" class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Payment Mode</label>
                    <select id="paymentMode" formControlName="paymentMode" class="w-full px-5 py-3 bg-hms-background dark:bg-dark-background border border-hms-border dark:border-dark-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm transition-all dark:text-dark-text-primary font-bold">
                      <option value="Cash">Cash</option>
                      <option value="Card">Credit/Debit Card</option>
                      <option value="UPI">UPI / Digital</option>
                      <option value="BTC">Bill to Company</option>
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label for="advance" class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest">Advance Amount</label>
                    <div class="relative">
                      <span class="absolute left-5 top-1/2 -translate-y-1/2 text-hms-text-muted text-sm font-bold">₹</span>
                      <input id="advance" formControlName="advance" type="number" class="w-full pl-10 pr-5 py-3 bg-hms-background dark:bg-dark-background border border-hms-border dark:border-dark-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm transition-all dark:text-dark-text-primary font-bold tabular-nums">
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Right Pane: Available Rooms & Summary -->
            <div class="w-1/2 bg-hms-background dark:bg-dark-background p-10 flex flex-col space-y-8 overflow-hidden">
              <div class="flex items-center justify-between flex-shrink-0">
                <h4 class="text-[10px] font-bold text-hms-text-primary dark:text-dark-text-primary uppercase tracking-widest">Available Inventory</h4>
                <span class="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                  {{availableRooms().length}} Rooms Found
                </span>
              </div>

              <!-- Room Selection Grid -->
              <div class="grid grid-cols-2 gap-6 flex-1 overflow-y-auto pr-4 no-scrollbar">
                @for (room of availableRooms(); track room.id) {
                  <button 
                    type="button"
                    (click)="selectedRoomId.set(room.id)"
                    [class]="selectedRoomId() === room.id ? 'border-primary bg-primary/5 shadow-xl ring-4 ring-primary/5' : 'border-hms-border dark:border-dark-border bg-hms-surface dark:bg-dark-surface hover:border-primary hover:shadow-lg hover:-translate-y-1'"
                    class="p-6 rounded-3xl border transition-all cursor-pointer group relative text-left h-fit"
                  >
                    <div class="flex justify-between items-start mb-4">
                      <div class="flex flex-col">
                        <span class="text-2xl font-bold text-hms-text-primary dark:text-dark-text-primary leading-none tabular-nums">#{{room.number}}</span>
                        <span class="text-[10px] font-bold text-hms-text-muted uppercase tracking-widest mt-2">{{room.type}}</span>
                      </div>
                      @if (selectedRoomId() === room.id) {
                        <div class="bg-primary text-white p-1.5 rounded-xl shadow-lg shadow-primary/20 animate-in zoom-in duration-200">
                          <mat-icon class="text-[14px] w-4 h-4 flex items-center justify-center">check</mat-icon>
                        </div>
                      }
                    </div>
                    
                    <div class="flex items-center justify-between pt-4 border-t border-hms-border dark:border-dark-border">
                      <div class="flex flex-col">
                        <span class="text-[9px] text-hms-text-muted font-bold uppercase leading-none mb-1.5 tracking-widest">Rate</span>
                        <span class="text-sm font-bold text-hms-text-primary dark:text-dark-text-primary tabular-nums">₹{{room.price | number}}</span>
                      </div>
                      <div class="flex flex-col text-right">
                        <span class="text-[9px] text-hms-text-muted font-bold uppercase leading-none mb-1.5 tracking-widest">Floor</span>
                        <span class="text-sm font-bold text-hms-text-muted tabular-nums">{{room.floor}}</span>
                      </div>
                    </div>
                  </button>
                }
                @if (availableRooms().length === 0) {
                  <div class="col-span-2 py-20 text-center space-y-4">
                    <div class="w-20 h-20 bg-hms-surface dark:bg-dark-surface rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                      <mat-icon class="text-hms-text-muted text-4xl">event_busy</mat-icon>
                    </div>
                    <p class="text-sm font-bold text-hms-text-muted uppercase tracking-widest">No rooms available for these dates</p>
                  </div>
                }
              </div>

              <!-- Billing Summary -->
              <div class="bg-hms-surface dark:bg-dark-surface p-8 rounded-[32px] border border-hms-border dark:border-dark-border shadow-xl space-y-6 flex-shrink-0">
                <h5 class="text-[10px] font-bold text-hms-text-primary dark:text-dark-text-primary uppercase tracking-widest border-b border-hms-border dark:border-dark-border pb-4">Billing Summary</h5>
                <div class="space-y-3">
                  <div class="flex justify-between text-xs font-medium">
                    <span class="text-hms-text-muted">Room Tariff ({{nightsCount()}} nights)</span>
                    <span class="font-bold text-hms-text-primary dark:text-dark-text-primary tabular-nums">₹{{baseTariff() | number}}</span>
                  </div>
                  <div class="flex justify-between text-xs font-medium">
                    <span class="text-hms-text-muted">Meal Plan ({{bookingForm.get('plan')?.value}})</span>
                    <span class="font-bold text-hms-text-primary dark:text-dark-text-primary tabular-nums">₹{{planCharge() | number}}</span>
                  </div>
                  <div class="flex justify-between text-xs font-medium">
                    <span class="text-hms-text-muted">Tax / GST (18%)</span>
                    <span class="font-bold text-hms-text-primary dark:text-dark-text-primary tabular-nums">₹{{taxAmount() | number}}</span>
                  </div>
                  <div class="pt-4 border-t border-hms-border dark:border-dark-border flex justify-between items-center">
                    <p class="text-[10px] font-bold text-hms-text-primary dark:text-dark-text-primary uppercase tracking-widest">Grand Total</p>
                    <p class="text-2xl font-bold text-primary tabular-nums">₹{{grandTotal() | number}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-8 bg-hms-surface dark:bg-dark-surface border-t border-hms-border dark:border-dark-border flex justify-end gap-4">
            <button (click)="closeBookingModal()" class="px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest text-hms-text-muted hover:bg-hms-background dark:hover:bg-dark-background transition-all">
              Cancel
            </button>
            <button 
              (click)="confirmBooking()"
              [disabled]="!bookingForm.valid || !selectedRoomId()"
              class="bg-primary text-white px-12 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm & Block Inventory
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    mat-icon { font-size: 20px; width: 20px; height: 20px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationCenter {
  hotelService = inject(HotelService);
  fb = inject(FormBuilder);
  
  viewMode = signal<'list' | 'timeline' | 'map'>('timeline');
  showBookingModal = signal(false);
  selectedRoomId = signal<string | null>(null);
  generatedResId = '';

  floors = computed(() => {
    const allRooms = this.hotelService.rooms();
    return [...new Set(allRooms.map(r => r.floor))].sort((a, b) => a - b);
  });

  getRoomsByFloor(floor: number) {
    return this.hotelService.rooms().filter(r => r.floor === floor);
  }

  getRoomStatusTextColor(status: string) {
    switch (status) {
      case 'Available': return 'text-success';
      case 'Occupied': return 'text-warning';
      case 'Dirty': return 'text-danger';
      case 'Maintenance': return 'text-hms-text-muted';
      default: return 'text-hms-text-muted';
    }
  }

  quickBook(room: Room) {
    this.openBookingModal();
    this.selectedRoomId.set(room.id);
  }

  bookingForm = this.fb.group({
    guestName: ['', Validators.required],
    guestPhone: ['', Validators.required],
    guestEmail: ['', [Validators.required, Validators.email]],
    guestType: ['New' as GuestType],
    companyName: [''],
    checkIn: [new Date().toISOString().split('T')[0], Validators.required],
    checkOut: [new Date(Date.now() + 86400000).toISOString().split('T')[0], Validators.required],
    adults: [1, [Validators.required, Validators.min(1)]],
    children: [0, Validators.min(0)],
    plan: ['EP' as RoomPlan, Validators.required],
    paymentMode: ['Cash' as PaymentMode, Validators.required],
    advance: [0, Validators.min(0)]
  });

  timelineDays = Array.from({ length: 15 }, (_, i) => {
    const d = new Date('2026-03-20');
    d.setDate(d.getDate() + i);
    return d;
  });

  availableRooms = computed(() => {
    const checkIn = new Date(this.bookingForm.get('checkIn')?.value || '');
    const checkOut = new Date(this.bookingForm.get('checkOut')?.value || '');
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return [];
    return this.hotelService.getAvailableRooms(checkIn, checkOut);
  });

  nightsCount = computed(() => {
    const checkIn = new Date(this.bookingForm.get('checkIn')?.value || '');
    const checkOut = new Date(this.bookingForm.get('checkOut')?.value || '');
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return 0;
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  });

  baseTariff = computed(() => {
    const roomId = this.selectedRoomId();
    if (!roomId) return 0;
    const room = this.hotelService.rooms().find(r => r.id === roomId);
    return (room?.price || 0) * this.nightsCount();
  });

  planCharge = computed(() => {
    const plan = this.bookingForm.get('plan')?.value;
    const nights = this.nightsCount();
    const adults = this.bookingForm.get('adults')?.value || 1;
    let perPersonPerNight = 0;
    switch (plan) {
      case 'CP': perPersonPerNight = 15; break;
      case 'MAP': perPersonPerNight = 40; break;
      case 'AP': perPersonPerNight = 65; break;
      default: perPersonPerNight = 0;
    }
    return perPersonPerNight * adults * nights;
  });

  taxAmount = computed(() => {
    return Math.round((this.baseTariff() + this.planCharge()) * 0.18);
  });

  grandTotal = computed(() => {
    return this.baseTariff() + this.planCharge() + this.taxAmount();
  });

  openBookingModal() {
    this.generatedResId = 'RES-' + Math.floor(100000 + Math.random() * 900000);
    this.selectedRoomId.set(null);
    this.showBookingModal.set(true);
  }

  closeBookingModal() {
    this.showBookingModal.set(false);
    this.bookingForm.reset({
      guestType: 'New',
      plan: 'EP',
      paymentMode: 'Cash',
      adults: 1,
      children: 0,
      advance: 0,
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0]
    });
  }

  confirmBooking() {
    if (this.bookingForm.valid && this.selectedRoomId()) {
      const formVal = this.bookingForm.value;
      const roomId = this.selectedRoomId()!;
      const room = this.hotelService.rooms().find(r => r.id === roomId)!;

      const newRes: Reservation = {
        id: this.generatedResId,
        guestName: formVal.guestName!,
        guestEmail: formVal.guestEmail!,
        guestPhone: formVal.guestPhone!,
        guestType: formVal.guestType!,
        companyName: formVal.companyName || undefined,
        roomId: roomId,
        roomType: room.type,
        checkIn: new Date(formVal.checkIn!),
        checkOut: new Date(formVal.checkOut!),
        adults: formVal.adults!,
        children: formVal.children!,
        status: 'Confirmed',
        plan: formVal.plan!,
        tariff: room.price,
        tax: this.taxAmount(),
        totalAmount: this.grandTotal(),
        advance: formVal.advance!,
        paymentMode: formVal.paymentMode!
      };

      this.hotelService.addReservation(newRes);
      this.closeBookingModal();
    }
  }

  getRoomNumber(roomId: string): string {
    return this.hotelService.rooms().find(r => r.id === roomId)?.number || 'N/A';
  }

  getNights(checkIn: Date, checkOut: Date): number {
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'CheckedIn': return 'bg-success/10 text-success';
      case 'Confirmed': return 'bg-primary/10 text-primary';
      case 'CheckedOut': return 'bg-hms-text-muted/10 text-hms-text-muted';
      default: return 'bg-danger/10 text-danger';
    }
  }

  getRoomStatusColor(status: string) {
    switch (status) {
      case 'Available': return 'bg-success';
      case 'Occupied': return 'bg-warning';
      case 'Dirty': return 'bg-danger';
      case 'Maintenance': return 'bg-hms-text-muted';
      default: return 'bg-hms-text-muted';
    }
  }

  getReservationsForRoom(roomId: string) {
    return this.hotelService.reservations().filter(r => r.roomId === roomId && r.status !== 'Cancelled');
  }

  getTimelineOffset(checkIn: Date): number {
    const start = new Date('2026-03-20');
    const diff = checkIn.getTime() - start.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days * 112; // 28 * 4
  }

  getTimelineWidth(checkIn: Date, checkOut: Date): number {
    const nights = this.getNights(checkIn, checkOut);
    return nights * 112;
  }

  getTimelineStatusClass(status: string) {
    switch (status) {
      case 'CheckedIn': return 'bg-success/5 text-success border-success/20';
      case 'Confirmed': return 'bg-primary/5 text-primary border-primary/20';
      case 'CheckedOut': return 'bg-hms-text-muted/5 text-hms-text-muted border-hms-text-muted/20';
      default: return 'bg-danger/5 text-danger border-danger/20';
    }
  }

  isToday(date: Date): boolean {
    const today = new Date('2026-03-25');
    return date.toDateString() === today.toDateString();
  }
}
