import { ChangeDetectionStrategy, Component, inject, ElementRef, ViewChild, AfterViewInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HotelService } from '../../services/hotel';
import * as d3 from 'd3';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-8 pb-12">
      <!-- Top Metrics Bar -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-brand-50 text-brand-600 rounded-lg">
              <mat-icon>analytics</mat-icon>
            </div>
            <span class="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wider">+12.5%</span>
          </div>
          <p class="text-xs text-surface-500 font-bold uppercase tracking-widest">Occupancy Rate</p>
          <div class="flex items-baseline space-x-2 mt-1">
            <h3 class="text-3xl font-bold text-surface-900">{{hotelService.stats().occupancyRate}}%</h3>
            <span class="text-xs text-surface-400 font-medium">vs last week</span>
          </div>
          <div class="mt-4 h-1.5 w-full bg-surface-100 rounded-full overflow-hidden">
            <div class="h-full bg-brand-500 rounded-full transition-all duration-1000" [style.width.%]="hotelService.stats().occupancyRate"></div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <mat-icon>monetization_on</mat-icon>
            </div>
            <span class="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wider">+8.2%</span>
          </div>
          <p class="text-xs text-surface-500 font-bold uppercase tracking-widest">Total Revenue</p>
          <div class="flex items-baseline space-x-2 mt-1">
            <h3 class="text-3xl font-bold text-surface-900"><span>$</span>{{hotelService.stats().totalRevenue | number}}</h3>
            <span class="text-xs text-surface-400 font-medium">MTD</span>
          </div>
          <p class="text-[10px] text-surface-400 mt-3 font-medium">Target: $45,000 (79%)</p>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <mat-icon>trending_up</mat-icon>
            </div>
          </div>
          <p class="text-xs text-surface-500 font-bold uppercase tracking-widest">Avg Daily Rate (ADR)</p>
          <div class="flex items-baseline space-x-2 mt-1">
            <h3 class="text-3xl font-bold text-surface-900"><span>$</span>{{hotelService.stats().avgDailyRate}}</h3>
            <span class="text-xs text-surface-400 font-medium">per room</span>
          </div>
          <p class="text-[10px] text-surface-400 mt-3 font-medium">Market Avg: $172</p>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <mat-icon>insights</mat-icon>
            </div>
          </div>
          <p class="text-xs text-surface-500 font-bold uppercase tracking-widest">RevPAR</p>
          <div class="flex items-baseline space-x-2 mt-1">
            <h3 class="text-3xl font-bold text-surface-900"><span>$</span>{{hotelService.stats().revPAR}}</h3>
            <span class="text-xs text-surface-400 font-medium">efficiency</span>
          </div>
          <p class="text-[10px] text-surface-400 mt-3 font-medium">Optimal: $150</p>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Revenue Trend Chart -->
        <div class="lg:col-span-2 bg-white p-8 rounded-2xl border border-surface-200 shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h3 class="text-lg font-bold text-surface-900">Revenue Performance</h3>
              <p class="text-xs text-surface-500">Daily revenue trends for the last 7 days</p>
            </div>
            <div class="flex items-center space-x-2">
              <div class="flex items-center space-x-1">
                <span class="w-3 h-3 bg-brand-500 rounded-full"></span>
                <span class="text-[10px] font-bold text-surface-400 uppercase">Actual</span>
              </div>
            </div>
          </div>
          <div class="h-[300px] w-full relative" #revenueChart>
            <!-- D3 Chart will be rendered here -->
          </div>
        </div>

        <!-- Occupancy Distribution -->
        <div class="bg-white p-8 rounded-2xl border border-surface-200 shadow-sm">
          <h3 class="text-lg font-bold text-surface-900 mb-2">Room Distribution</h3>
          <p class="text-xs text-surface-500 mb-8">Occupancy by room category</p>
          <div class="h-[300px] w-full relative" #occupancyChart>
            <!-- D3 Donut Chart will be rendered here -->
          </div>
          <div class="mt-6 grid grid-cols-2 gap-4">
            @for (item of hotelService.stats().roomTypeDistribution; track item.label) {
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 rounded-full" [style.background-color]="getRoomTypeColor(item.label)"></span>
                <span class="text-[10px] font-bold text-surface-600 uppercase">{{item.label}}</span>
                <span class="text-[10px] font-medium text-surface-400 ml-auto">{{item.value}}%</span>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Bottom Data Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Recent Reservations -->
        <div class="lg:col-span-2 bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-surface-100 flex items-center justify-between">
            <h3 class="font-bold text-surface-900">Recent Activity</h3>
            <button class="text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-widest">View Full Log</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-surface-50">
                  <th class="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase tracking-widest">Guest</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase tracking-widest">Room</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase tracking-widest">Check In</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase tracking-widest">Status</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-100">
                @for (res of hotelService.reservations(); track res.id) {
                  <tr class="hover:bg-surface-50 transition-colors group">
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="h-8 w-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-[10px] font-bold mr-3">
                          {{res.guestName.charAt(0)}}
                        </div>
                        <span class="text-sm font-bold text-surface-900">{{res.guestName}}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-xs font-medium text-surface-600 bg-surface-100 px-2 py-1 rounded-md">Room {{res.roomId}}</span>
                    </td>
                    <td class="px-6 py-4 text-xs text-surface-500 font-medium">{{res.checkIn | date:'MMM d, yyyy'}}</td>
                    <td class="px-6 py-4">
                      <span [class]="getStatusClass(res.status)" class="px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
                        {{res.status}}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm font-bold text-surface-900 text-right">
                      <span class="text-surface-400 font-normal mr-0.5">$</span>{{res.totalAmount}}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Quick Actions / Alerts -->
        <div class="space-y-6">
          <div class="bg-surface-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div class="relative z-10">
              <h4 class="text-sm font-bold uppercase tracking-widest text-brand-400 mb-2">Quick Actions</h4>
              <div class="grid grid-cols-2 gap-3 mt-4">
                <button class="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10 group">
                  <mat-icon class="text-brand-400 mb-2 group-hover:scale-110 transition-transform">add_circle</mat-icon>
                  <span class="text-[10px] font-bold uppercase tracking-tighter">New Booking</span>
                </button>
                <button class="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10 group">
                  <mat-icon class="text-brand-400 mb-2 group-hover:scale-110 transition-transform">cleaning_services</mat-icon>
                  <span class="text-[10px] font-bold uppercase tracking-tighter">Housekeeping</span>
                </button>
              </div>
            </div>
            <!-- Decorative circle -->
            <div class="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl"></div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
            <h4 class="text-xs font-bold uppercase tracking-widest text-surface-400 mb-4">System Alerts</h4>
            <div class="space-y-4">
              <div class="flex items-start space-x-3 p-3 bg-red-50 rounded-xl border border-red-100">
                <mat-icon class="text-red-500 text-sm">warning</mat-icon>
                <div>
                  <p class="text-xs font-bold text-red-900">Room 201 Maintenance</p>
                  <p class="text-[10px] text-red-700 mt-0.5">AC repair scheduled for 2:00 PM today.</p>
                </div>
              </div>
              <div class="flex items-start space-x-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                <mat-icon class="text-orange-500 text-sm">notification_important</mat-icon>
                <div>
                  <p class="text-xs font-bold text-orange-900">5 Rooms Need Cleaning</p>
                  <p class="text-[10px] text-orange-700 mt-0.5">High priority for upcoming check-ins.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements AfterViewInit, OnDestroy {
  hotelService = inject(HotelService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild('revenueChart') revenueChartContainer!: ElementRef;
  @ViewChild('occupancyChart') occupancyChartContainer!: ElementRef;

  private resizeObserver?: ResizeObserver;

  ngAfterViewInit() {
    if (!this.isBrowser) return;

    this.renderCharts();
    
    this.resizeObserver = new ResizeObserver(() => {
      this.renderCharts();
    });
    
    this.resizeObserver.observe(this.revenueChartContainer.nativeElement);
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  renderCharts() {
    this.renderRevenueChart();
    this.renderOccupancyChart();
  }

  renderRevenueChart() {
    const element = this.revenueChartContainer.nativeElement;
    d3.select(element).selectAll('*').remove();

    const data = this.hotelService.stats().revenueTrend;
    const width = element.clientWidth;
    const height = element.clientHeight;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, (d: {date: string}) => new Date(d.date)) as [Date, Date])
      .range([0, width - margin.left - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d: {value: number}) => d.value) as number * 1.1])
      .range([height - margin.top - margin.bottom, 0]);

    // Add grid lines
    svg.append('g')
      .attr('class', 'grid')
      .attr('stroke', '#f1f5f9')
      .attr('stroke-opacity', 0.5)
      .call(d3.axisLeft(y)
        .tickSize(-(width - margin.left - margin.right))
        .tickFormat(() => '')
      );

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(7).tickFormat((d: Date | d3.NumberValue) => d3.timeFormat('%b %d')(d as Date)))
      .attr('font-size', '10px')
      .attr('color', '#94a3b8')
      .call(g => g.select('.domain').remove());

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `$${d}`))
      .attr('font-size', '10px')
      .attr('color', '#94a3b8')
      .call(g => g.select('.domain').remove());

    // Add area
    const area = d3.area<{date: string, value: number}>()
      .x(d => x(new Date(d.date)))
      .y0(height - margin.top - margin.bottom)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', 'url(#revenue-gradient)')
      .attr('d', area);

    // Add gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'revenue-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#0ea5e9')
      .attr('stop-opacity', 0.2);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#0ea5e9')
      .attr('stop-opacity', 0);

    // Add line
    const line = d3.line<{date: string, value: number}>()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#0ea5e9')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Add dots
    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(new Date(d.date)))
      .attr('cy', d => y(d.value))
      .attr('r', 4)
      .attr('fill', '#fff')
      .attr('stroke', '#0ea5e9')
      .attr('stroke-width', 2);
  }

  renderOccupancyChart() {
    const element = this.occupancyChartContainer.nativeElement;
    d3.select(element).selectAll('*').remove();

    const data = this.hotelService.stats().roomTypeDistribution;
    const width = element.clientWidth;
    const height = element.clientHeight;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.label))
      .range(['#0ea5e9', '#10b981', '#f59e0b', '#ef4444']);

    const pie = d3.pie<{label: string, value: number}>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<{label: string, value: number}>>()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.9);

    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label));

    // Add center text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .attr('class', 'text-[10px] font-bold uppercase tracking-widest fill-surface-400')
      .text('Total');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.8em')
      .attr('class', 'text-2xl font-bold fill-surface-900')
      .text(this.hotelService.stats().total);
  }

  getRoomTypeColor(label: string) {
    switch (label) {
      case 'Single': return '#0ea5e9';
      case 'Double': return '#10b981';
      case 'Suite': return '#f59e0b';
      case 'Deluxe': return '#ef4444';
      default: return '#94a3b8';
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'CheckedIn': return 'bg-green-100 text-green-700';
      case 'Confirmed': return 'bg-blue-100 text-blue-700';
      case 'CheckedOut': return 'bg-surface-100 text-surface-600';
      default: return 'bg-red-100 text-red-700';
    }
  }

  getRoomStatusClass(status: string) {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700';
      case 'Occupied': return 'bg-blue-100 text-blue-700';
      case 'Dirty': return 'bg-orange-100 text-orange-700';
      case 'Maintenance': return 'bg-red-100 text-red-700';
      default: return 'bg-surface-100 text-surface-600';
    }
  }

  getRoomIcon(status: string) {
    switch (status) {
      case 'Available': return 'check_circle';
      case 'Occupied': return 'person';
      case 'Dirty': return 'cleaning_services';
      case 'Maintenance': return 'build';
      default: return 'help';
    }
  }

  getRoomIconBg(status: string) {
    switch (status) {
      case 'Available': return 'bg-green-50 text-green-600';
      case 'Occupied': return 'bg-blue-50 text-blue-600';
      case 'Dirty': return 'bg-orange-50 text-orange-600';
      case 'Maintenance': return 'bg-red-50 text-red-600';
      default: return 'bg-surface-50 text-surface-600';
    }
  }
}
