import { Component } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { combineLatest, map, Observable } from 'rxjs';

import { DatasetStoreService } from '../../../core/services/dataset-store.service';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';

type TableRow = {
  timestamp: Date;
  value: number | null;
};

@Component({
  standalone: true,
  selector: 'app-sensor-table',
  imports: [
    NgIf,
    AsyncPipe,
    DatePipe,          // ✅ pentru pipe-ul | date
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule
  ],
  template: `
    <mat-card class="table-card">
      <mat-card-header>
        <div class="header-content">
          <div class="icon-badge">
            <mat-icon>table_chart</mat-icon>
          </div>
          <div>
            <mat-card-title>Tabel Date</mat-card-title>
            <mat-card-subtitle *ngIf="col$ | async as col">
              Coloană: <strong>{{ col }}</strong>
            </mat-card-subtitle>
          </div>
        </div>
      </mat-card-header>

      <mat-card-content>
        <div class="table-wrap" *ngIf="(rows$ | async) as rows">
          <table mat-table [dataSource]="rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)" class="data-table">

            <ng-container matColumnDef="timestamp">
              <th mat-header-cell *matHeaderCellDef>DateTime</th>
              <td mat-cell *matCellDef="let r">
                {{ r.timestamp | date:'yyyy-MM-dd HH:mm:ss' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="value">
              <th mat-header-cell *matHeaderCellDef>Valoare</th>
              <td mat-cell *matCellDef="let r">{{ formatValue(r.value) }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <mat-paginator
            [length]="rows.length"
            [pageSize]="pageSize"
            [pageSizeOptions]="[25, 50, 100, 200]"
            (page)="onPage($event)"
            class="custom-paginator"
          ></mat-paginator>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .table-card {
      animation: fadeInUp 0.6s ease 0.1s both;
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

    .table-wrap {
      overflow: auto;
      border-radius: 12px;
      border: 1px solid rgba(0, 212, 255, 0.15);
    }

    .data-table {
      width: 100%;
      background: rgba(15, 23, 42, 0.3);
    }

    th {
      background: rgba(0, 212, 255, 0.1) !important;
      color: #00d4ff !important;
      font-weight: 600 !important;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 0.85rem !important;
      padding: 16px !important;
      white-space: nowrap;
    }

    td {
      color: #e0e6ed !important;
      padding: 12px 16px !important;
      white-space: nowrap;
      border-bottom: 1px solid rgba(0, 212, 255, 0.1) !important;
    }

    tr:hover td {
      background: rgba(0, 212, 255, 0.05) !important;
    }

    .custom-paginator {
      background: rgba(15, 23, 42, 0.3);
      border-top: 1px solid rgba(0, 212, 255, 0.2);
      color: #94a3b8;
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
export class SensorTableComponent {
  displayedColumns: Array<'timestamp' | 'value'> = ['timestamp', 'value'];
  pageIndex = 0;
  pageSize = 50;

  // ✅ inițializez col$ și rows$ în constructor ca să nu mai ai TS2729
  col$: Observable<string | null>;
  rows$: Observable<TableRow[]>;

  constructor(private readonly store: DatasetStoreService) {
    this.col$ = this.store.selectedColumn$;

    this.rows$ = combineLatest([this.store.filteredRows$, this.store.selectedColumn$]).pipe(
      map(([rows, col]) =>
        rows.map(r => ({
          timestamp: r.timestamp,
          value: col ? (r.values[col] ?? null) : null,
        }))
      )
    );
  }

  formatValue(value: number | null): string {
    if (value === null || value === undefined) return '-';
    return value.toFixed(4);
  }

  onPage(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
  }
}
