import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MultiSensorStoreService } from '../../../core/services/multi-sensor-store.service';
import { CalcResult } from '../../../core/models/multi-sensor.model';

@Component({
  standalone: true,
  selector: 'app-multi-sensor-results',
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule
  ],
  template: `
    <mat-card class="results-card">
      <mat-card-header>
        <div class="header-content">
          <div class="icon-badge">
            <mat-icon>table_chart</mat-icon>
          </div>
          <div class="header-text">
            <mat-card-title>Tabel CALC - Rezultate</mat-card-title>
            <mat-card-subtitle>
              Calcule deformații planseu (17 coloane)
            </mat-card-subtitle>
          </div>
          <div class="header-actions">
            @if ((results$ | async)?.length) {
              <button mat-stroked-button (click)="exportCSV()">
                <mat-icon>download</mat-icon>
                Export CSV
              </button>
            }
          </div>
        </div>
      </mat-card-header>

      <mat-card-content>
        @if (results$ | async; as results) {
          @if (results.length > 0) {
            <div class="table-container">
              <table mat-table [dataSource]="getPaginatedData(results)" class="calc-table">
                
                <!-- Timestamp -->
                <ng-container matColumnDef="timestamp">
                  <th mat-header-cell *matHeaderCellDef>Timestamp</th>
                  <td mat-cell *matCellDef="let row">
                    {{ row.timestamp | date:'dd-MMM-yyyy HH:mm:ss' }}
                  </td>
                </ng-container>

                <!-- Z1 Delta -->
                <ng-container matColumnDef="z1Delta">
                  <th mat-header-cell *matHeaderCellDef>Z1 Δ (mm)</th>
                  <td mat-cell *matCellDef="let row">{{ formatValue(row.z1Delta) }}</td>
                </ng-container>

                <!-- Z2 Delta -->
                <ng-container matColumnDef="z2Delta">
                  <th mat-header-cell *matHeaderCellDef>Z2 Δ (mm)</th>
                  <td mat-cell *matCellDef="let row">{{ formatValue(row.z2Delta) }}</td>
                </ng-container>

                <!-- Z3 Delta -->
                <ng-container matColumnDef="z3Delta">
                  <th mat-header-cell *matHeaderCellDef>Z3 Δ (mm)</th>
                  <td mat-cell *matCellDef="let row">{{ formatValue(row.z3Delta) }}</td>
                </ng-container>

                <!-- Z4 Delta -->
                <ng-container matColumnDef="z4Delta">
                  <th mat-header-cell *matHeaderCellDef>Z4 Δ (mm)</th>
                  <td mat-cell *matCellDef="let row">{{ formatValue(row.z4Delta) }}</td>
                </ng-container>

                <!-- X Delta -->
                <ng-container matColumnDef="xDelta">
                  <th mat-header-cell *matHeaderCellDef>X Δ (mm)</th>
                  <td mat-cell *matCellDef="let row">{{ formatValue(row.xDelta) }}</td>
                </ng-container>

                <!-- Y Delta -->
                <ng-container matColumnDef="yDelta">
                  <th mat-header-cell *matHeaderCellDef>Y Δ (mm)</th>
                  <td mat-cell *matCellDef="let row">{{ formatValue(row.yDelta) }}</td>
                </ng-container>

                <!-- Ondulație -->
                <ng-container matColumnDef="ondulatie">
                  <th mat-header-cell *matHeaderCellDef>Ondulație (mm)</th>
                  <td mat-cell *matCellDef="let row">{{ formatValue(row.ondulatie) }}</td>
                </ng-container>

                <!-- Înclinare L -->
                <ng-container matColumnDef="inclinareL">
                  <th mat-header-cell *matHeaderCellDef>Înclinare L (mm/m)</th>
                  <td mat-cell *matCellDef="let row">{{ formatValue(row.inclinareL) }}</td>
                </ng-container>

                <!-- Înclinare l -->
                <ng-container matColumnDef="inclinareLowerL">
                  <th mat-header-cell *matHeaderCellDef>Înclinare l (mm/m)</th>
                  <td mat-cell *matCellDef="let row">{{ formatValue(row.inclinareLowerL) }}</td>
                </ng-container>

                <!-- Twist -->
                <ng-container matColumnDef="twist">
                  <th mat-header-cell *matHeaderCellDef>Twist (mm)</th>
                  <td mat-cell *matCellDef="let row">{{ formatValue(row.twist) }}</td>
                </ng-container>

                <!-- Direcție mișcare -->
                <ng-container matColumnDef="directieMiscare">
                  <th mat-header-cell *matHeaderCellDef>Direcție mișcare</th>
                  <td mat-cell *matCellDef="let row" class="direction-cell">
                    {{ row.directieMiscare || '-' }}
                  </td>
                </ng-container>

                <!-- Temp Laser -->
                <ng-container matColumnDef="tempLaserMedie">
                  <th mat-header-cell *matHeaderCellDef>Temp Laser (°C)</th>
                  <td mat-cell *matCellDef="let row">{{ formatValue(row.tempLaserMedie, 1) }}</td>
                </ng-container>

                <!-- Temp Tilt -->
                <ng-container matColumnDef="tempTiltMedie">
                  <th mat-header-cell *matHeaderCellDef>Temp Tilt (°C)</th>
                  <td mat-cell *matCellDef="let row">{{ formatValue(row.tempTiltMedie, 1) }}</td>
                </ng-container>

                <!-- Semnal OK -->
                <ng-container matColumnDef="semnalOk">
                  <th mat-header-cell *matHeaderCellDef>Semnal OK?</th>
                  <td mat-cell *matCellDef="let row" [class.status-ok]="row.semnalOk === 'OK'" [class.status-nu]="row.semnalOk === 'NU'">
                    {{ row.semnalOk || '-' }}
                  </td>
                </ng-container>

                <!-- Std Tilt OK -->
                <ng-container matColumnDef="stdTiltOk">
                  <th mat-header-cell *matHeaderCellDef>Std Tilt OK?</th>
                  <td mat-cell *matCellDef="let row" [class.status-ok]="row.stdTiltOk === 'OK'" [class.status-nu]="row.stdTiltOk === 'NU'">
                    {{ row.stdTiltOk || '-' }}
                  </td>
                </ng-container>

                <!-- Note -->
                <ng-container matColumnDef="note">
                  <th mat-header-cell *matHeaderCellDef>Note</th>
                  <td mat-cell *matCellDef="let row">{{ row.note || '-' }}</td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>

            <mat-paginator
              [length]="results.length"
              [pageSize]="pageSize"
              [pageSizeOptions]="[25, 50, 100, 200]"
              (page)="onPageChange($event)"
              class="custom-paginator">
            </mat-paginator>

            <div class="results-summary">
              <mat-icon>info</mat-icon>
              <span>Total: <strong>{{ results.length }}</strong> înregistrări calculate</span>
            </div>
          } @else {
            <div class="empty-state">
              <mat-icon>info</mat-icon>
              <h3>Niciun rezultat disponibil</h3>
              <p>Încarcă cele 6 CSV-uri și selectează timestamp-ul referință (T0) pentru a genera rezultatele.</p>
            </div>
          }
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .results-card {
      animation: fadeInUp 0.6s ease 0.2s both;
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

    .header-text {
      flex: 1;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .table-container {
      overflow-x: auto;
      border-radius: 12px;
      border: 1px solid rgba(20, 146, 56, 0.15);
      max-height: 600px;
      overflow-y: auto;
    }

    .calc-table {
      width: 100%;
      background: rgba(255, 255, 255, 0.3);
      min-width: 2000px;
    }

    th {
      background: rgba(20, 146, 56, 0.1) !important;
      color: #149238 !important;
      font-weight: 600 !important;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 0.75rem !important;
      padding: 12px 8px !important;
      white-space: nowrap;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    td {
      color: #020202 !important;
      padding: 10px 8px !important;
      white-space: nowrap;
      border-bottom: 1px solid rgba(20, 146, 56, 0.1) !important;
      font-size: 0.85rem;
      font-family: 'Courier New', monospace;
    }

    tr:hover td {
      background: rgba(20, 146, 56, 0.05) !important;
    }

    .direction-cell {
      max-width: 200px;
      white-space: normal;
      font-family: inherit;
    }

    .status-ok {
      color: #1ab547 !important;
      font-weight: 600;
    }

    .status-nu {
      color: #ef4444 !important;
      font-weight: 600;
    }

    .custom-paginator {
      background: rgba(255, 255, 255, 0.3);
      border-top: 1px solid rgba(20, 146, 56, 0.2);
    }

    .results-summary {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: rgba(20, 146, 56, 0.05);
      border-radius: 8px;
      margin-top: 16px;
      color: #4a4a4a;

      mat-icon {
        color: #149238;
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 32px;
      text-align: center;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #808080;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 1.5rem;
        color: #020202;
        margin: 0 0 8px 0;
      }

      p {
        color: #4a4a4a;
        max-width: 500px;
        margin: 0;
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
  `]
})
export class MultiSensorResultsComponent {
  displayedColumns = [
    'timestamp',
    'z1Delta', 'z2Delta', 'z3Delta', 'z4Delta',
    'xDelta', 'yDelta',
    'ondulatie', 'inclinareL', 'inclinareLowerL', 'twist',
    'directieMiscare',
    'tempLaserMedie', 'tempTiltMedie',
    'semnalOk', 'stdTiltOk',
    'note'
  ];

  results$;
  pageIndex = 0;
  pageSize = 50;

  constructor(private store: MultiSensorStoreService) {
    this.results$ = this.store.calcResults$;
  }

  formatValue(value: number | null, decimals: number = 4): string {
    if (value === null || value === undefined) return '-';
    return value.toFixed(decimals);
  }

  getPaginatedData(results: CalcResult[]): CalcResult[] {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    return results.slice(start, end);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  exportCSV(): void {
    this.results$.subscribe(results => {
      if (results.length === 0) return;

      // Header CSV
      const headers = [
        'Timestamp',
        'Z1 delta (mm)', 'Z2 delta (mm)', 'Z3 delta (mm)', 'Z4 delta (mm)',
        'X delta (mm)', 'Y delta (mm)',
        'Ondulatie (mm)', 'Inclinare pe L (mm/m)', 'Inclinare pe l (mm/m)', 'Twist (mm)',
        'Directie miscare',
        'Temp Laser medie (°C)', 'Temp Tilt medie (°C)',
        'Semnal OK?', 'Std tilt OK?',
        'Note'
      ];

      // Rows CSV
      const rows = results.map(r => [
        r.timestamp.toISOString(),
        this.formatValue(r.z1Delta),
        this.formatValue(r.z2Delta),
        this.formatValue(r.z3Delta),
        this.formatValue(r.z4Delta),
        this.formatValue(r.xDelta),
        this.formatValue(r.yDelta),
        this.formatValue(r.ondulatie),
        this.formatValue(r.inclinareL),
        this.formatValue(r.inclinareLowerL),
        this.formatValue(r.twist),
        r.directieMiscare,
        this.formatValue(r.tempLaserMedie, 1),
        this.formatValue(r.tempTiltMedie, 1),
        r.semnalOk,
        r.stdTiltOk,
        r.note
      ]);

      // Generează CSV
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `CALC_Results_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
    });
  }
}


