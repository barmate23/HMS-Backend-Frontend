import { Component, Input, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexTooltip,
  ApexFill,
  ApexPlotOptions,
  NgxApexchartsModule
} from 'ngx-apexcharts';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
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
  selector: 'app-checkin-activity',
  standalone: true,
  imports: [CommonModule, NgxApexchartsModule],
  templateUrl: './checkin-activity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckinActivityComponent {
  @ViewChild('chart') chart!: ChartComponent;
  @Input() set data(value: { hours: string[], data: number[] }) {
    if (value) {
      this.chartOptions.series = [{
        name: 'Check-ins',
        data: value.data
      }];
      this.chartOptions.xaxis = {
        ...this.chartOptions.xaxis,
        categories: value.hours
      };
      
      const currentHour = new Date().getHours();
      this.chartOptions.colors = value.hours.map(h => {
        const hour = parseInt(h.split(':')[0]);
        return hour === currentHour ? '#F4A261' : '#2E86AB';
      });
    }
  }

  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [],
      chart: {
        height: 220,
        type: 'bar',
        toolbar: { show: false },
        animations: {
          enabled: true,
          speed: 600
        },
        background: 'transparent',
        fontFamily: 'Inter'
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '60%'
        }
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: [],
        tickAmount: 8,
        labels: {
          style: { fontSize: '10px' }
        }
      },
      yaxis: {
        min: 0,
        max: 10,
        tickAmount: 5,
        labels: {
          style: { fontSize: '10px' }
        }
      },
      tooltip: {
        y: {
          formatter: (val, opts) => {
            const hour = opts.w.globals.labels[opts.dataPointIndex];
            return val + ' check-ins expected at ' + hour;
          }
        }
      },
      legend: { show: false }
    };
  }
}
