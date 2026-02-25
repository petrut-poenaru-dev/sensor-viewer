import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MultiSensorImportComponent } from './components/multi-sensor-import.component';
import { MultiSensorParamsComponent } from './components/multi-sensor-params.component';
import { MultiSensorResultsComponent } from './components/multi-sensor-results.component';
import { MultiSensor3DChartComponent } from './components/multi-sensor-3d-chart.component';
import { MultiSensorStoreService } from '../../core/services/multi-sensor-store.service';

@Component({
  standalone: true,
  selector: 'app-multi-sensor-page',
  imports: [
    CommonModule,
    MatIconModule,
    MultiSensorImportComponent,
    MultiSensorParamsComponent,
    MultiSensor3DChartComponent,
    MultiSensorResultsComponent
  ],
  template: `
    <div class="multi-sensor-page">
      <div class="page-header">
        <div class="header-content">
          <div class="icon-wrapper">
            <mat-icon>grid_on</mat-icon>
          </div>
          <div>
            <h1>Calcul Planseu 6 Senzori</h1>
            <p class="subtitle">Import CSV-uri și calcul deformații</p>
          </div>
        </div>
      </div>

      <!-- Import 6 CSV-uri -->
      <app-multi-sensor-import></app-multi-sensor-import>

      <!-- Parametri configurabili -->
      <app-multi-sensor-params></app-multi-sensor-params>

      <!-- Grafic 3D Placă -->
      <app-multi-sensor-3d-chart></app-multi-sensor-3d-chart>

      <!-- Tabel rezultate CALC -->
      <app-multi-sensor-results></app-multi-sensor-results>
    </div>
  `,
  styles: [`
    .multi-sensor-page {
      max-width: 1600px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
      animation: fadeInDown 0.6s ease;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .icon-wrapper {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4),
                  0 0 0 1px rgba(20, 146, 56, 0.2);
      animation: float 3s ease-in-out infinite;
      padding: 16px;
      border: 2px solid rgba(20, 146, 56, 0.3);

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #149238;
      }
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 4px 0;
      color:#149238;
    }

    .subtitle {
      font-size: 1rem;
      color: #4a4a4a;
      margin: 0;
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }
  `]
})
export class MultiSensorPage {
  constructor(public store: MultiSensorStoreService) {}
}


