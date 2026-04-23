import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HotelService, Reservation, Room, RoomPlan, GuestType, PaymentMode } from '../../services/hotel';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header with View Toggle -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-surface-900">Reservations</h2>
          <p class="text-sm text-surface-500 font-medium">Gatekeeper of hotel inventory</p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="bg-surface-100 p-1 rounded-xl flex items-center">
            <button 
              (click)="viewMode.set('list')"
              [class]="viewMode() === 'list' ? 'bg-white shadow-sm text-brand-600' : 'text-surface-500 hover:text-surface-700'"
              class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center"
            >
              <mat-icon class="text-sm mr-2">list</mat-icon>
              List
            </button>
            <button 
              (click)="viewMode.set('timeline')"
              [class]="viewMode() === 'timeline' ? 'bg-white shadow-sm text-brand-600' : 'text-surface-500 hover:text-surface-700'"
              class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center"
            >
              <mat-icon class="text-sm mr-2">calendar_view_month</mat-icon>
              Stay
            </button>
            <button 
              (click)="viewMode.set('map')"
              [class]="viewMode() === 'map' ? 'bg-white shadow-sm text-brand-600' : 'text-surface-500 hover:text-surface-700'"
              class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center"
            >
              <mat-icon class="text-sm mr-2">map</mat-icon>
              Map
            </button>
          </div>
          <button 
            (click)="openBookingModal()"
            class="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center"
          >
            <mat-icon class="mr-2">add</mat-icon>
            New Booking
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-2xl border border-surface-200 shadow-sm flex flex-wrap items-center gap-4">
        <div class="relative flex-1 min-w-[200px]">
          <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm">search</mat-icon>
          <input 
            type="text" 
            placeholder="Search guest, email or room..." 
            class="w-full pl-10 pr-4 py-2 bg-surface-50 border border-surface-100 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition-colors"
          >
        </div>
        <select class="bg-surface-50 border border-surface-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-500" aria-label="Filter by status">
          <option>All Status</option>
          <option>Confirmed</option>
          <option>Checked In</option>
          <option>Checked Out</option>
        </select>
        <div class="flex items-center space-x-2 text-sm text-surface-500 font-medium">
          <mat-icon class="text-sm">date_range</mat-icon>
          <span>{{timelineDays[0] | date:'MMM d'}} - {{timelineDays[14] | date:'MMM d, yyyy'}}</span>
        </div>
      </div>

      <!-- List View -->
      @if (viewMode() === 'list') {
        <div class="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-surface-50">
                  <th class="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase tracking-widest">Guest Details</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase tracking-widest">Room & Plan</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase tracking-widest">Stay Period</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase tracking-widest">Status</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase tracking-widest text-right">Billing</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-100">
                @for (res of hotelService.reservations(); track res.id) {
                  <tr class="hover:bg-surface-50 transition-colors group">
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="h-10 w-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-xs font-bold mr-3">
                          {{res.guestName.charAt(0)}}
                        </div>
                        <div>
                          <div class="flex items-center gap-2">
                            <p class="text-sm font-bold text-surface-900">{{res.guestName}}</p>
                            <span class="text-[8px] px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 font-bold uppercase">{{res.guestType}}</span>
                          </div>
                          <p class="text-[10px] text-surface-400 font-medium">{{res.guestEmail}} • {{res.guestPhone}}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex flex-col">
                        <span class="text-sm font-bold text-surface-900">Room {{getRoomNumber(res.roomId)}}</span>
                        <div class="flex items-center gap-1.5">
                          <span class="text-[10px] text-surface-400 font-medium uppercase">{{res.roomType}}</span>
                          <span class="text-[10px] text-brand-500 font-bold">{{res.plan}}</span>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex flex-col">
                        <div class="text-xs font-medium text-surface-600">
                          {{res.checkIn | date:'MMM d'}} - {{res.checkOut | date:'MMM d'}}
                        </div>
                        <div class="flex items-center gap-1 mt-0.5">
                          <span class="text-[9px] text-surface-400 font-bold uppercase tracking-tighter">
                            {{getNights(res.checkIn, res.checkOut)}} nights
                          </span>
                          <span class="text-[9px] text-surface-300">•</span>
                          <span class="text-[9px] text-surface-400 font-bold uppercase tracking-tighter">
                            {{res.adults}}A, {{res.children}}C
                          </span>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span [class]="getStatusClass(res.status)" class="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
                        {{res.status}}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex flex-col items-end">
                        <p class="text-sm font-bold text-surface-900"><span class="text-surface-400 font-normal mr-0.5">$</span>{{res.totalAmount}}</p>
                        @if (res.advance > 0) {
                          <p class="text-[9px] text-emerald-600 font-bold uppercase">Paid: $ {{res.advance}}</p>
                        }
                      </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="p-2 text-surface-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" aria-label="View details">
                          <mat-icon class="text-sm">visibility</mat-icon>
                        </button>
                        <button class="p-2 text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" aria-label="Cancel reservation">
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
        <div class="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div class="flex border-b border-surface-100">
            <div class="w-48 flex-shrink-0 p-4 border-r border-surface-100 bg-surface-50 font-bold text-[10px] uppercase text-surface-400 tracking-widest flex items-center">
              <mat-icon class="text-xs mr-2">hotel</mat-icon>
              Room Inventory
            </div>
            <div class="flex-1 flex overflow-x-auto no-scrollbar">
              @for (day of timelineDays; track day) {
                <div class="w-24 flex-shrink-0 p-4 text-center border-r border-surface-100" [class.bg-brand-50]="isToday(day)">
                  <p class="text-[10px] font-bold text-surface-400 uppercase">{{day | date:'EEE'}}</p>
                  <p class="text-sm font-bold text-surface-900">{{day | date:'d'}}</p>
                </div>
              }
            </div>
          </div>
          <div class="flex-1 overflow-y-auto overflow-x-auto no-scrollbar">
            @for (room of hotelService.rooms(); track room.id) {
              <div class="flex border-b border-surface-100 group min-w-max">
                <div class="w-48 flex-shrink-0 p-4 border-r border-surface-100 bg-surface-50/50 group-hover:bg-brand-50/30 transition-colors flex flex-col justify-center">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-bold text-surface-900">Room {{room.number}}</p>
                    <div [class]="getRoomStatusColor(room.status)" class="w-2 h-2 rounded-full" [title]="room.status"></div>
                  </div>
                  <div class="flex items-center justify-between mt-0.5">
                    <p class="text-[10px] text-surface-400 font-medium uppercase">{{room.type}}</p>
                    <p class="text-[9px] text-surface-300 font-bold">FL {{room.floor}}</p>
                  </div>
                </div>
                <div class="flex-1 flex relative h-16">
                  @for (day of timelineDays; track day) {
                    <div class="w-24 flex-shrink-0 border-r border-surface-50 h-full"></div>
                  }
                  <!-- Occupancy Bars -->
                  @for (res of getReservationsForRoom(room.id); track res.id) {
                    <div 
                      [style.left.px]="getTimelineOffset(res.checkIn)"
                      [style.width.px]="getTimelineWidth(res.checkIn, res.checkOut)"
                      [class]="getTimelineStatusClass(res.status)"
                      class="absolute top-2 h-12 rounded-xl flex items-center px-3 shadow-sm cursor-pointer hover:scale-[1.01] transition-transform z-10 border overflow-hidden"
                      [attr.aria-label]="'Reservation for ' + res.guestName"
                    >
                      <div class="flex flex-col min-w-0">
                        <span class="text-[10px] font-bold truncate leading-tight">{{res.guestName}}</span>
                        <div class="flex items-center gap-1">
                          <span class="text-[8px] opacity-70 font-bold uppercase tracking-tighter">{{res.status}}</span>
                          <span class="text-[8px] opacity-50 font-bold">•</span>
                          <span class="text-[8px] opacity-70 font-bold">{{res.plan}}</span>
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
        <div class="space-y-8">
          @for (floor of floors(); track floor) {
            <div class="space-y-4">
              <div class="flex items-center gap-3 px-2">
                <div class="h-8 w-8 rounded-lg bg-surface-900 text-white flex items-center justify-center font-bold text-sm">
                  {{floor}}
                </div>
                <div>
                  <h3 class="text-sm font-bold text-surface-900">Floor {{floor}}</h3>
                  <p class="text-[10px] text-surface-400 font-bold uppercase tracking-widest">Inventory Distribution</p>
                </div>
                <div class="h-px flex-1 bg-surface-100 ml-4"></div>
              </div>
              
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                @for (room of getRoomsByFloor(floor); track room.id) {
                  <div 
                    class="bg-white p-4 rounded-2xl border border-surface-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                    [class.opacity-60]="room.status === 'Maintenance'"
                  >
                    <div class="flex justify-between items-start mb-4">
                      <span class="text-lg font-bold text-surface-900">#{{room.number}}</span>
                      <div [class]="getRoomStatusColor(room.status)" class="w-2.5 h-2.5 rounded-full shadow-sm"></div>
                    </div>
                    
                    <div class="space-y-1">
                      <p class="text-[10px] font-bold text-surface-400 uppercase tracking-tighter">{{room.type}}</p>
                      <p class="text-xs font-bold text-surface-600">$ {{room.price}}</p>
                    </div>

                    <div class="mt-4 pt-3 border-t border-surface-50 flex items-center justify-between">
                      <span class="text-[9px] font-bold uppercase tracking-widest" [class]="getRoomStatusTextColor(room.status)">
                        {{room.status}}
                      </span>
                      @if (room.status === 'Available') {
                        <button 
                          (click)="quickBook(room)"
                          class="p-1.5 bg-brand-50 text-brand-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-600 hover:text-white"
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
          <div class="flex items-center justify-center gap-6 py-6 border-t border-surface-100">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span class="text-[10px] font-bold text-surface-500 uppercase tracking-widest">Available</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-amber-500"></div>
              <span class="text-[10px] font-bold text-surface-500 uppercase tracking-widest">Occupied</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-red-400"></div>
              <span class="text-[10px] font-bold text-surface-500 uppercase tracking-widest">Dirty</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-surface-400"></div>
              <span class="text-[10px] font-bold text-surface-500 uppercase tracking-widest">Maintenance</span>
            </div>
          </div>
        </div>
      }
    </div>

    <!-- New Booking Modal (Split-Pane Interface) -->
    @if (showBookingModal()) {
      <div class="fixed inset-0 bg-surface-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-6xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col">
          <!-- Modal Header -->
          <div class="p-6 border-b border-surface-100 flex items-center justify-between bg-surface-50">
            <div>
              <h3 class="text-xl font-bold text-surface-900">New Reservation</h3>
              <p class="text-xs text-surface-500 font-medium">Capture guest intent and block inventory</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Reservation ID</p>
                <p class="text-sm font-mono font-bold text-brand-600">{{generatedResId}}</p>
              </div>
              <button (click)="closeBookingModal()" class="p-2 hover:bg-surface-200 rounded-full transition-colors" aria-label="Close modal">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>
          
          <!-- Split Pane Content -->
          <div class="flex-1 flex overflow-hidden" [formGroup]="bookingForm">
            <!-- Left Pane: Metadata & Parameters -->
            <div class="w-1/2 p-8 overflow-y-auto border-r border-surface-100 space-y-8">
              <!-- Guest Information -->
              <section class="space-y-4">
                <div class="flex items-center gap-2 pb-2 border-b border-surface-100">
                  <mat-icon class="text-brand-600 text-sm">person</mat-icon>
                  <h4 class="text-xs font-bold text-surface-900 uppercase tracking-widest">Guest Information</h4>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label for="guestName" class="text-[10px] font-bold text-surface-500 uppercase">Guest Name</label>
                    <input id="guestName" formControlName="guestName" type="text" placeholder="Full Name" class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 text-sm">
                  </div>
                  <div class="space-y-1.5">
                    <label for="guestPhone" class="text-[10px] font-bold text-surface-500 uppercase">Contact Number</label>
                    <input id="guestPhone" formControlName="guestPhone" type="text" placeholder="+1 (555) 000-0000" class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 text-sm">
                  </div>
                  <div class="space-y-1.5">
                    <label for="guestEmail" class="text-[10px] font-bold text-surface-500 uppercase">Email ID</label>
                    <input id="guestEmail" formControlName="guestEmail" type="email" placeholder="email@example.com" class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 text-sm">
                  </div>
                  <div class="space-y-1.5">
                    <label for="guestType" class="text-[10px] font-bold text-surface-500 uppercase">Guest Type</label>
                    <select id="guestType" formControlName="guestType" class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 text-sm">
                      <option value="New">New Guest</option>
                      <option value="Repeat">Repeat Guest</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                  <div class="col-span-2 space-y-1.5">
                    <label for="companyName" class="text-[10px] font-bold text-surface-500 uppercase">Company/Agency Name (Optional)</label>
                    <input id="companyName" formControlName="companyName" type="text" placeholder="Corporate Tie-up / Agent" class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 text-sm">
                  </div>
                </div>
              </section>

              <!-- Stay Information -->
              <section class="space-y-4">
                <div class="flex items-center gap-2 pb-2 border-b border-surface-100">
                  <mat-icon class="text-brand-600 text-sm">event</mat-icon>
                  <h4 class="text-xs font-bold text-surface-900 uppercase tracking-widest">Stay Parameters</h4>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label for="checkIn" class="text-[10px] font-bold text-surface-500 uppercase">Arrival Date</label>
                    <input id="checkIn" formControlName="checkIn" type="date" class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 text-sm">
                  </div>
                  <div class="space-y-1.5">
                    <label for="checkOut" class="text-[10px] font-bold text-surface-500 uppercase">Departure Date</label>
                    <input id="checkOut" formControlName="checkOut" type="date" class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 text-sm">
                  </div>
                  <div class="space-y-1.5">
                    <label for="adults" class="text-[10px] font-bold text-surface-500 uppercase">Adults</label>
                    <input id="adults" formControlName="adults" type="number" min="1" class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 text-sm">
                  </div>
                  <div class="space-y-1.5">
                    <label for="children" class="text-[10px] font-bold text-surface-500 uppercase">Children</label>
                    <input id="children" formControlName="children" type="number" min="0" class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 text-sm">
                  </div>
                </div>
              </section>

              <!-- Billing & Plan -->
              <section class="space-y-4">
                <div class="flex items-center gap-2 pb-2 border-b border-surface-100">
                  <mat-icon class="text-brand-600 text-sm">payments</mat-icon>
                  <h4 class="text-xs font-bold text-surface-900 uppercase tracking-widest">Billing & Plan Selection</h4>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label for="plan" class="text-[10px] font-bold text-surface-500 uppercase">Room Plan</label>
                    <select id="plan" formControlName="plan" class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 text-sm">
                      <option value="EP">EP (Room Only)</option>
                      <option value="CP">CP (Room + Breakfast)</option>
                      <option value="MAP">MAP (Room + 2 Meals)</option>
                      <option value="AP">AP (All Meals)</option>
                    </select>
                  </div>
                  <div class="space-y-1.5">
                    <label for="paymentMode" class="text-[10px] font-bold text-surface-500 uppercase">Payment Mode</label>
                    <select id="paymentMode" formControlName="paymentMode" class="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 text-sm">
                      <option value="Cash">Cash</option>
                      <option value="Card">Credit/Debit Card</option>
                      <option value="UPI">UPI / Digital</option>
                      <option value="BTC">Bill to Company</option>
                    </select>
                  </div>
                  <div class="space-y-1.5">
                    <label for="advance" class="text-[10px] font-bold text-surface-500 uppercase">Advance Amount</label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-sm">$</span>
                      <input id="advance" formControlName="advance" type="number" class="w-full pl-8 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 text-sm">
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Right Pane: Available Rooms & Summary -->
            <div class="w-1/2 bg-surface-50 p-6 flex flex-col space-y-4 overflow-hidden">
              <div class="flex items-center justify-between flex-shrink-0">
                <h4 class="text-[10px] font-bold text-surface-900 uppercase tracking-widest">Available Inventory</h4>
                <span class="text-[9px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                  {{availableRooms().length}} Rooms Found
                </span>
              </div>

              <!-- Room Selection Grid -->
              <div class="grid grid-cols-2 gap-4 flex-1 overflow-y-auto pr-2">
                @for (room of availableRooms(); track room.id) {
                  <button 
                    type="button"
                    (click)="selectedRoomId.set(room.id)"
                    [class]="selectedRoomId() === room.id ? 'border-brand-600 bg-brand-50/30 shadow-md ring-2 ring-brand-500/20' : 'border-surface-200 bg-white hover:border-brand-400 hover:shadow-md hover:-translate-y-0.5'"
                    class="p-4 rounded-2xl border transition-all cursor-pointer group relative text-left h-fit"
                  >
                    <div class="flex justify-between items-start mb-2">
                      <div class="flex flex-col">
                        <span class="text-lg font-bold text-surface-900 leading-none">#{{room.number}}</span>
                        <span class="text-[9px] font-bold text-surface-400 uppercase tracking-widest mt-1">{{room.type}}</span>
                      </div>
                      @if (selectedRoomId() === room.id) {
                        <div class="bg-brand-600 text-white p-1 rounded-full shadow-sm">
                          <mat-icon class="text-[12px] w-3 h-3 flex items-center justify-center">check</mat-icon>
                        </div>
                      }
                    </div>
                    
                    <div class="flex items-center justify-between pt-3 border-t border-surface-100">
                      <div class="flex flex-col">
                        <span class="text-[8px] text-surface-400 font-bold uppercase leading-none mb-1">Rate</span>
                        <span class="text-xs font-bold text-surface-900">$ {{room.price}}</span>
                      </div>
                      <div class="flex flex-col text-right">
                        <span class="text-[8px] text-surface-400 font-bold uppercase leading-none mb-1">Floor</span>
                        <span class="text-xs font-bold text-surface-600">{{room.floor}}</span>
                      </div>
                    </div>
                  </button>
                }
                @if (availableRooms().length === 0) {
                  <div class="col-span-2 py-12 text-center space-y-2">
                    <mat-icon class="text-surface-300 text-4xl">event_busy</mat-icon>
                    <p class="text-sm font-bold text-surface-500">No rooms available for these dates</p>
                  </div>
                }
              </div>

              <!-- Billing Summary -->
              <div class="bg-white p-4 rounded-2xl border border-surface-200 shadow-sm space-y-2.5 flex-shrink-0">
                <h5 class="text-[9px] font-bold text-surface-900 uppercase tracking-widest border-b border-surface-100 pb-2">Billing Summary</h5>
                <div class="space-y-1">
                  <div class="flex justify-between text-[11px]">
                    <span class="text-surface-500">Room Tariff ({{nightsCount()}} nights)</span>
                    <span class="font-bold text-surface-900">$ {{baseTariff()}}</span>
                  </div>
                  <div class="flex justify-between text-[11px]">
                    <span class="text-surface-500">Meal Plan ({{bookingForm.get('plan')?.value}})</span>
                    <span class="font-bold text-surface-900">$ {{planCharge()}}</span>
                  </div>
                  <div class="flex justify-between text-[11px]">
                    <span class="text-surface-500">Tax / GST (18%)</span>
                    <span class="font-bold text-surface-900">$ {{taxAmount()}}</span>
                  </div>
                  <div class="pt-2 border-t border-surface-100 flex justify-between items-center">
                    <p class="text-[9px] font-bold text-surface-900 uppercase tracking-widest">Grand Total</p>
                    <p class="text-lg font-bold text-brand-600">$ {{grandTotal()}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-6 bg-white border-t border-surface-100 flex justify-end space-x-4">
            <button (click)="closeBookingModal()" class="px-6 py-2.5 rounded-xl font-bold text-sm text-surface-600 hover:bg-surface-200 transition-all">
              Cancel
            </button>
            <button 
              (click)="confirmBooking()"
              [disabled]="!bookingForm.valid || !selectedRoomId()"
              class="bg-brand-600 text-white px-10 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm & Block Inventory
            </button>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Reservations {
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
      case 'Available': return 'text-emerald-600';
      case 'Occupied': return 'text-amber-600';
      case 'Dirty': return 'text-red-500';
      case 'Maintenance': return 'text-surface-500';
      default: return 'text-surface-400';
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
      
      // Mock automated email confirmation
      console.log(`Automated booking voucher sent to ${newRes.guestEmail} for Reservation ID: ${newRes.id}`);
      
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
      case 'CheckedIn': return 'bg-emerald-100 text-emerald-700';
      case 'Confirmed': return 'bg-blue-100 text-blue-700';
      case 'CheckedOut': return 'bg-surface-100 text-surface-600';
      default: return 'bg-red-100 text-red-700';
    }
  }

  getRoomStatusColor(status: string) {
    switch (status) {
      case 'Available': return 'bg-emerald-500';
      case 'Occupied': return 'bg-amber-500';
      case 'Dirty': return 'bg-red-400';
      case 'Maintenance': return 'bg-surface-400';
      default: return 'bg-surface-300';
    }
  }

  getReservationsForRoom(roomId: string) {
    return this.hotelService.reservations().filter(r => r.roomId === roomId && r.status !== 'Cancelled');
  }

  getTimelineOffset(checkIn: Date): number {
    const start = new Date('2026-03-20');
    const diff = checkIn.getTime() - start.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days * 96;
  }

  getTimelineWidth(checkIn: Date, checkOut: Date): number {
    const nights = this.getNights(checkIn, checkOut);
    return nights * 96;
  }

  getTimelineStatusClass(status: string) {
    switch (status) {
      case 'CheckedIn': return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
      case 'Confirmed': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'CheckedOut': return 'bg-surface-500/10 text-surface-700 border-surface-200';
      default: return 'bg-red-500/10 text-red-700 border-red-200';
    }
  }

  isToday(date: Date): boolean {
    const today = new Date('2026-03-25');
    return date.toDateString() === today.toDateString();
  }
}
