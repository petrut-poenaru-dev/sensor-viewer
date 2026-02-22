import { Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DatasetStoreService } from '../../core/services/dataset-store.service';

import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SensorChartComponent } from './components/sensor-chart.component';
import { SensorTableComponent } from './components/sensor-table.component';
import {CalcParamsComponent} from './components/calc-params.component';
import { PlateParamsComponent } from './components/plate-params.component';
import { PlateKpiComponent } from './components/plate-kpi.component';
@Component({
  standalone: true,
  selector: 'app-sensors-page',
  imports: [
    AsyncPipe, NgIf, RouterLink,
    MatCardModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatIconModule,
    SensorChartComponent, SensorTableComponent , CalcParamsComponent ,
    PlateParamsComponent,
    PlateKpiComponent,
  ],
  template: `
    <app-calc-params></app-calc-params>
    <app-plate-params></app-plate-params>
    <app-plate-kpi></app-plate-kpi>
    <ng-container *ngIf="(store.dataset$ | async) as ds; else noData">
      <div class="dashboard-header">
        <div class="header-content">
          <div class="title-section">
            <div class="icon-wrapper">
              <img src="assets/img/logo-graphein.jpeg" alt="Graphein Logo" class="dashboard-logo">
            </div>
            <div>
              <h1>Dashboard Senzori</h1>
              <p class="subtitle">Analiză în timp real a datelor colectate</p>
            </div>
          </div>
        </div>
      </div>

      <mat-card class="info-card">
        <mat-card-content>
          <div class="meta-grid">
            <div class="meta-item">
              <mat-icon>router</mat-icon>
              <div class="meta-content">
                <span class="meta-label">Node ID</span>
                <span class="meta-value">{{ cleanValue(ds.meta.nodeId) }}</span>
              </div>
            </div>
            <div class="meta-item">
              <mat-icon>memory</mat-icon>
              <div class="meta-content">
                <span class="meta-label">Model</span>
                <span class="meta-value">{{ cleanValue(ds.meta.model) }}</span>
              </div>
            </div>
            <div class="meta-item">
              <mat-icon>schedule</mat-icon>
              <div class="meta-content">
                <span class="meta-label">Timezone</span>
                <span class="meta-value">{{ cleanValue(ds.meta.timezone) }}</span>
              </div>
            </div>
          </div>

          <div class="controls">
            <mat-form-field appearance="outline" class="column-select">
              <mat-label>Selectează seria de date</mat-label>
              <mat-select [value]="(store.selectedColumn$ | async)" (valueChange)="store.setSelectedColumn($event)">
                @for (c of ds.columns; track c) {
                  <mat-option [value]="c">{{ c }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <button mat-stroked-button (click)="resetRange()" class="reset-btn">
              <mat-icon>refresh</mat-icon>
              <span>Resetează intervalul</span>
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="grid">
        <app-sensor-chart />
        <app-sensor-table />
      </div>
    </ng-container>

    <ng-template #noData>
      <div class="empty-state">
        <div class="empty-icon">
          <mat-icon>cloud_off</mat-icon>
        </div>
        <h2>Nicio dată încărcată</h2>
        <p>Pentru a vizualiza datele, trebuie să încarci mai întâi un fișier CSV.</p>
        <button mat-raised-button color="primary" routerLink="/import">
          <mat-icon>upload</mat-icon>
          <span>Mergi la Import</span>
        </button>
      </div>
    </ng-template>
  `,
  styles: [`
    .dashboard-header {
      margin-bottom: 24px;
      animation: fadeInDown 0.6s ease;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .icon-wrapper {
      width: 80px;
      height: 80px;
      background: rgba(20, 30, 60, 0.6);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4),
                  0 0 0 1px rgba(0, 212, 255, 0.2);
      animation: float 3s ease-in-out infinite;
      padding: 16px;
      border: 2px solid rgba(0, 212, 255, 0.3);

      .dashboard-logo {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 8px;
      }

      mat-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
        color: #00d4ff;
      }
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 4px 0;
      background: linear-gradient(135deg, #ffffff 0%, #00d4ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 1rem;
      color: #94a3b8;
      margin: 0;
    }

    .info-card {
      margin-bottom: 24px;
      animation: fadeInUp 0.6s ease 0.1s both;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(0, 212, 255, 0.2);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: rgba(15, 23, 42, 0.5);
      border-radius: 12px;
      border: 1px solid rgba(0, 212, 255, 0.15);
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(0, 212, 255, 0.4);
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 212, 255, 0.2);
      }

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: #00d4ff;
      }
    }

    .meta-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .meta-label {
      font-size: 0.8rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }

    .meta-value {
      font-size: 1.1rem;
      color: #e0e6ed;
      font-weight: 600;
      word-break: break-word;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 200px;
    }

    .controls {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      align-items: flex-start;
    }

    .column-select {
      flex: 1;
      min-width: 280px;
    }

    .reset-btn {
      height: 56px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 24px !important;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      animation: fadeInUp 0.6s ease 0.2s both;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
      animation: fadeIn 0.6s ease;
    }

    .empty-icon {
      width: 120px;
      height: 120px;
      background: rgba(20, 30, 60, 0.6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      border: 2px solid rgba(0, 212, 255, 0.2);

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #64748b;
      }
    }

    .empty-state h2 {
      font-size: 1.8rem;
      font-weight: 600;
      color: #e0e6ed;
      margin: 0 0 12px 0;
    }

    .empty-state p {
      font-size: 1.1rem;
      color: #94a3b8;
      margin: 0 0 32px 0;
      max-width: 500px;
    }

    .empty-state button {
      min-width: 200px;
      height: 48px;
      font-size: 1rem !important;
      display: flex;
      align-items: center;
      gap: 8px;
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

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
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

    @media (max-width: 768px) {
      .title-section {
        flex-direction: column;
        align-items: flex-start;
      }

      h1 {
        font-size: 1.5rem;
      }

      .meta-grid {
        grid-template-columns: 1fr;
      }

      .controls {
        flex-direction: column;
        width: 100%;
      }

      .column-select {
        width: 100%;
      }

      .reset-btn {
        width: 100%;
      }
    }
  `],
})
export class SensorsPage {
  constructor(public readonly store: DatasetStoreService) {}

  // Helper pentru a curăța valorile de virgule multiple
  cleanValue(value: string | null | undefined): string {
    if (!value) return 'N/A';
    // Înlocuiește virgulele multiple cu nimic
    return value.replace(/,+/g, '').trim() || 'N/A';
  }

  resetRange() {
    const ds = (this.store as any).datasetSubject?.value as any; // simplu pt starter
    if (!ds?.rows?.length) return;
    this.store.setDateRange({
      from: ds.rows[0].timestamp,
      to: ds.rows[ds.rows.length - 1].timestamp,
    });
  }
}
