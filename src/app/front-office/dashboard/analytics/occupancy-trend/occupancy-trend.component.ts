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
  ApexAnnotations,
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
  annotations: ApexAnnotations;
  colors: string[];
}

@Component({
  selector: 'app-occupancy-trend',
  standalone: true,
  imports: [CommonModule, NgxApexchartsModule],
  templateUrl: './occupancy-trend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OccupancyTrendComponent {
  @ViewChild('chart') chart!: ChartComponent;
  @Input() set data(value: { occupied: number[], target: number[], categories: string[] }) {
    if (value) {
      this.chartOptions.series = [
        {
          name: 'Occupied %',
          data: value.occupied
        },
        {
          name: 'Target %',
          data: value.target
        }
      ];
      this.chartOptions.xaxis = {
        ...this.chartOptions.xaxis,
        categories: value.categories
      };
      this.chartOptions.annotations = {
        xaxis: [
          {
            x: value.categories[value.categories.length - 1],
            borderColor: '#2E86AB',
            label: {
              borderColor: '#2E86AB',
              style: {
                color: '#fff',
                background: '#2E86AB'
              },
              text: 'Today'
            }
          }
        ]
      };
    }
  }

  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [],
      chart: {
        height: 220,
        type: 'area',
        toolbar: { show: false },
        animations: {
          enabled: true,
          speed: 600
        },
        background: 'transparent',
        fontFamily: 'Inter'
      },
      colors: ['#2E86AB', '#F4A261'],
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: [3, 2],
        dashArray: [0, 5]
      },
      fill: {
        type: 'solid',
        opacity: [0.2, 0]
      },
      xaxis: {
        categories: [],
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 4,
        labels: {
          formatter: (val) => val + '%'
        }
      },
      tooltip: {
        shared: true,
        y: {
          formatter: (val) => val + '%'
        }
      },
      legend: { show: false }
    };
  }
}
