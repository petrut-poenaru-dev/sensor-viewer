import { Component, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { combineLatest } from 'rxjs';
import ApexCharts from 'apexcharts';

import { MatCardModule } from '@angular/material/card';

import { DatasetStoreService } from '../../../core/services/dataset-store.service';
import { ParametersStoreService } from '../../../core/services/parameters-store.service';
import { ApexChartComponent } from '../../../shared/ui/apex-chart.component';
import { MatIconModule } from '@angular/material/icon';
@Component({
  standalone: true,
  selector: 'app-sensor-chart',
  imports: [MatCardModule, NgIf, ApexChartComponent , MatIconModule],
  template: `
    <mat-card class="chart-card">
      <mat-card-header>
        <div class="header-content">
          <div class="icon-badge">
            <mat-icon>show_chart</mat-icon>
          </div>
          <div>
            <mat-card-title>Grafic Interactiv</mat-card-title>
            <mat-card-subtitle *ngIf="subtitle()">{{ subtitle() }}</mat-card-subtitle>
          </div>
        </div>
      </mat-card-header>

      <mat-card-content>
        <app-apex-chart [options]="options()"></app-apex-chart>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .chart-card {
      animation: fadeInUp 0.6s ease;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
    }

    .icon-badge {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(0, 153, 255, 0.2) 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(0, 212, 255, 0.3);

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: #00d4ff;
      }
    }

    mat-card-title {
      margin-bottom: 4px !important;
    }

    mat-card-subtitle {
      font-size: 0.85rem !important;
      line-height: 1.4;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
})
export class SensorChartComponent {
  subtitle = signal('');

  options = signal<ApexCharts.ApexOptions>({
    chart: {
      type: 'line',
      height: 360,
      zoom: { enabled: true },
      toolbar: { show: true },
      animations: { enabled: true },
      background: 'transparent',
      foreColor: '#94a3b8',
    },
    series: [],
    xaxis: { 
      type: 'datetime',
      labels: {
        style: {
          colors: '#94a3b8',
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#94a3b8',
        },
        formatter: function(value: number) {
          return value.toFixed(4);
        }
      }
    },
    stroke: { width: 3, curve: 'smooth' },
    markers: { size: 0 },
    dataLabels: { enabled: false },
    tooltip: { 
      x: { format: 'dd MMM yyyy HH:mm' },
      y: {
        formatter: function(value: number) {
          return value.toFixed(4);
        }
      },
      theme: 'dark',
    },
    colors: ['#00d4ff'],
    grid: { 
      strokeDashArray: 3,
      borderColor: 'rgba(0, 212, 255, 0.1)',
    },
    legend: { 
      show: true,
      labels: {
        colors: '#94a3b8',
      }
    },
    noData: { text: 'Nu există date pentru selecția curentă' },
  });

  constructor(
    private readonly store: DatasetStoreService,
    private readonly params: ParametersStoreService
  ) {
    combineLatest([this.store.filteredRows$, this.store.selectedColumn$, this.params.params$])
      .subscribe(([rows, col, p]) => {
        if (!col) {
          this.subtitle.set('');
          this.options.update(prev => ({ ...prev, series: [] }));
          return;
        }

        // v2 = v * pA + pB (înlocuiește aici cu formula din Excel)
        const data = rows
          .map(r => {
            const v = r.values[col];
            if (v == null) return null;
            const v2 = v * p.pA + p.pB;
            return [r.timestamp.getTime(), v2] as [number, number];
          })
          .filter(Boolean) as [number, number][];

        const min = data.length ? Math.min(...data.map(d => d[1])) : null;
        const max = data.length ? Math.max(...data.map(d => d[1])) : null;

        this.subtitle.set(
          `Coloană: ${col} • A=${p.pA}, B=${p.pB} • Puncte: ${data.length}` +
          (min != null && max != null ? ` • Min=${min.toFixed(4)} • Max=${max.toFixed(4)}` : '')
        );

        this.options.update(prev => ({
          ...prev,
          series: [
            {
              name: `${col} (A=${p.pA}, B=${p.pB})`,
              data,
            },
          ],
        }));
      });
  }
}
