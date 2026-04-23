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
  selector: 'app-revenue-breakdown',
  standalone: true,
  imports: [CommonModule, NgxApexchartsModule],
  templateUrl: './revenue-breakdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RevenueBreakdownComponent {
  @ViewChild('chart') chart!: ChartComponent;
  @Input() set data(value: { categories: string[], data: number[] }) {
    if (value) {
      this.chartOptions.series = [{
        name: 'Revenue',
        data: value.data
      }];
      this.chartOptions.xaxis = {
        ...this.chartOptions.xaxis,
        categories: value.categories
      };
      // Highlight Room Rent (index 0)
      this.chartOptions.colors = value.categories.map((cat) => 
        cat === 'Room Rent' ? '#F4A261' : '#1A3C5E'
      );
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
          horizontal: true,
          borderRadius: 4,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => '₹' + (Number(val) / 1000).toFixed(0) + 'K',
        offsetX: 30,
        style: {
          fontSize: '10px',
          colors: ['#304758']
        }
      },
      fill: {
        opacity: 0.8
      },
      xaxis: {
        categories: [],
        labels: {
          formatter: (val) => '₹' + (Number(val) / 1000).toFixed(0) + 'K'
        }
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '10px'
          }
        }
      },
      tooltip: {
        y: {
          formatter: (val) => '₹' + val.toLocaleString()
        }
      },
      legend: { show: false }
    };
  }
}
