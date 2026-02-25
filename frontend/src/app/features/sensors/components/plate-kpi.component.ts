import { Component } from '@angular/core';
import { AsyncPipe, DecimalPipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PlateStoreService } from '../../../core/services/plate-store.service';

@Component({
  standalone: true,
  selector: 'app-plate-kpi',
  imports: [MatCardModule, AsyncPipe, NgIf, DecimalPipe, MatIconModule],
  template: `
    <mat-card class="kpi-card" *ngIf="(store.plateResult$ | async) as r; else empty">
      <mat-card-header>
        <div class="header-content">
          <div class="icon-badge">
            <mat-icon>straighten</mat-icon>
          </div>
          <div>
            <mat-card-title>Rezultate Placă (4Z)</mat-card-title>
            <mat-card-subtitle>Calcule bazate pe ultimele 4 puncte</mat-card-subtitle>
          </div>
        </div>
      </mat-card-header>

      <mat-card-content>
        <div class="kpis">
          <div class="kpi">
            <div class="kpi-icon">
              <mat-icon>height</mat-icon>
            </div>
            <div class="kpi-content">
              <div class="label">P2P</div>
              <div class="val">{{ r.p2p | number:'1.4-4' }} <span class="unit">mm</span></div>
            </div>
          </div>

          <div class="kpi">
            <div class="kpi-icon">
              <mat-icon>rotate_90_degrees_ccw</mat-icon>
            </div>
            <div class="kpi-content">
              <div class="label">Twist</div>
              <div class="val">{{ r.twist | number:'1.4-4' }} <span class="unit">mm</span></div>
            </div>
          </div>

          <div class="kpi">
            <div class="kpi-icon">
              <mat-icon>arrow_downward</mat-icon>
            </div>
            <div class="kpi-content">
              <div class="label">Min Z</div>
              <div class="val">{{ r.minZ | number:'1.4-4' }} <span class="unit">mm</span></div>
            </div>
          </div>

          <div class="kpi">
            <div class="kpi-icon">
              <mat-icon>arrow_upward</mat-icon>
            </div>
            <div class="kpi-content">
              <div class="label">Max Z</div>
              <div class="val">{{ r.maxZ | number:'1.4-4' }} <span class="unit">mm</span></div>
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>

    <ng-template #empty>
      <mat-card class="kpi-card empty">
        <mat-card-header>
          <div class="header-content">
            <div class="icon-badge">
              <mat-icon>straighten</mat-icon>
            </div>
            <div>
              <mat-card-title>Rezultate Placă (4Z)</mat-card-title>
              <mat-card-subtitle>
                Încarcă date și selectează o coloană pentru a vedea rezultatele
              </mat-card-subtitle>
            </div>
          </div>
        </mat-card-header>
      </mat-card>
    </ng-template>
  `,
  styles: [`
    .kpi-card {
      animation: fadeInUp 0.6s ease 0.3s both;
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
      background: linear-gradient(135deg, rgba(20, 146, 56, 0.2) 0%, rgba(15, 107, 40, 0.2) 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(20, 146, 56, 0.3);

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: #149238;
      }
    }

    mat-card-title {
      margin-bottom: 4px !important;
    }

    .kpis {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 8px;
    }

    .kpi {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 12px;
      border: 1px solid rgba(20, 146, 56, 0.15);
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(20, 146, 56, 0.4);
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(20, 146, 56, 0.2);
      }
    }

    .kpi-icon {
      width: 40px;
      height: 40px;
      background: rgba(20, 146, 56, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        color: #149238;
      }
    }

    .kpi-content {
      flex: 1;
    }

    .label {
      font-size: 0.75rem;
      color: #4a4a4a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .val {
      font-size: 1.5rem;
      font-weight: 700;
      color: #020202;
      line-height: 1;
    }

    .unit {
      font-size: 0.9rem;
      font-weight: 400;
      color: #4a4a4a;
      margin-left: 4px;
    }

    .empty {
      opacity: 0.7;
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

    @media (max-width: 768px) {
      .kpis {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class PlateKpiComponent {
  constructor(public readonly store: PlateStoreService) {}
}


