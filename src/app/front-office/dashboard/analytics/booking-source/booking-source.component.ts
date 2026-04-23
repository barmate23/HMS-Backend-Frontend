import { Component, Input, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexLegend,
  ApexTooltip,
  ApexFill,
  ApexPlotOptions,
  NgxApexchartsModule
} from 'ngx-apexcharts';

export interface ChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  tooltip: ApexTooltip;
  fill: ApexFill;
  plotOptions: ApexPlotOptions;
  colors: string[];
}

@Component({
  selector: 'app-booking-source',
  standalone: true,
  imports: [CommonModule, NgxApexchartsModule],
  templateUrl: './booking-source.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingSourceComponent {
  @ViewChild('chart') chart!: ChartComponent;
  @Input() set data(value: { series: number[], labels: string[], counts: number[] }) {
    if (value) {
      this.chartOptions.series = value.series;
      this.chartOptions.labels = value.labels;
      this.chartOptions.plotOptions = {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Bookings',
                formatter: () => value.counts.reduce((a, b) => a + b, 0).toString()
              }
            }
          }
        }
      };
    }
  }

  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [],
      chart: {
        height: 220,
        type: 'donut',
        toolbar: { show: false },
        animations: {
          enabled: true,
          speed: 600
        },
        background: 'transparent',
        fontFamily: 'Inter'
      },
      colors: ['#2E86AB', '#E63946', '#F4A261', '#2D9E6B', '#718096'],
      dataLabels: { enabled: false },
      legend: {
        position: 'right',
        fontSize: '10px',
        formatter: (seriesName, opts) => {
          return seriesName + ': ' + opts.w.globals.series[opts.seriesIndex] + '%';
        }
      },
      tooltip: {
        y: {
          formatter: (val) => {
            return val + '%';
          }
        }
      }
    };
  }
}
