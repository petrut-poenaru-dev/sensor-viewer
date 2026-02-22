import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { MultiSensorStoreService } from '../../../core/services/multi-sensor-store.service';
import { CalcResult } from '../../../core/models/multi-sensor.model';
import Plotly from 'plotly.js-dist-min';

type ViewMode = 'BRUT' | 'DETRENT';

@Component({
  standalone: true,
  selector: 'app-multi-sensor-3d-chart',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  template: `
    <mat-card class="chart-card">
      <mat-card-header>
        <div class="header-content">
          <div class="icon-badge">
            <mat-icon>view_in_ar</mat-icon>
          </div>
          <div class="header-text">
            <mat-card-title>Simulare Placă 3D - 4 Senzori Z</mat-card-title>
            <mat-card-subtitle>Interpolare biliniară a deformațiilor</mat-card-subtitle>
          </div>
          <div class="controls">
            <mat-form-field appearance="outline" class="mode-select">
              <mat-label>Mod vizualizare</mat-label>
              <mat-select [formControl]="viewModeControl">
                <mat-option value="BRUT">BRUT (date originale)</mat-option>
                <mat-option value="DETRENT">DETRENT (fără trend)</mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="timestamp-select">
              <mat-label>Timestamp</mat-label>
              <mat-select [formControl]="timestampControl">
                @for (result of results; track result.timestamp.getTime()) {
                  <mat-option [value]="result.timestamp">
                    {{ result.timestamp | date:'dd-MMM-yyyy HH:mm' }}
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>
        </div>
      </mat-card-header>

      <mat-card-content>
        @if (results.length === 0) {
          <div class="empty-state">
            <mat-icon>info</mat-icon>
            <p>Încarcă CSV-urile și selectează un timestamp de referință pentru a vizualiza graficul 3D</p>
          </div>
        } @else {
          <div #plotContainer class="plot-container"></div>
          
          <div class="info-panel">
            <div class="corner-values">
              <div class="corner-item">
                <span class="label">Z1 (Față-Stânga):</span>
                <span class="value">{{ currentZ1 | number:'1.3-3' }} mm</span>
              </div>
              <div class="corner-item">
                <span class="label">Z2 (Față-Dreapta):</span>
                <span class="value">{{ currentZ2 | number:'1.3-3' }} mm</span>
              </div>
              <div class="corner-item">
                <span class="label">Z3 (Spate-Stânga):</span>
                <span class="value">{{ currentZ3 | number:'1.3-3' }} mm</span>
              </div>
              <div class="corner-item">
                <span class="label">Z4 (Spate-Dreapta):</span>
                <span class="value">{{ currentZ4 | number:'1.3-3' }} mm</span>
              </div>
            </div>
            
            <div class="stats">
              <div class="stat-item">
                <span class="label">Ondulație dZ:</span>
                <span class="value">{{ currentOndulatie | number:'1.3-3' }} mm</span>
              </div>
              <div class="stat-item">
                <span class="label">P2P colțuri:</span>
                <span class="value">{{ currentP2P | number:'1.3-3' }} mm</span>
              </div>
            </div>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .chart-card {
      margin-bottom: 24px;
      animation: fadeInUp 0.6s ease 0.2s both;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
      flex-wrap: wrap;
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

    .header-text {
      flex: 1;
      min-width: 200px;
    }

    .controls {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .mode-select,
    .timestamp-select {
      min-width: 200px;
    }

    .plot-container {
      width: 100%;
      height: 600px;
      background: rgba(15, 23, 42, 0.3);
      border-radius: 12px;
      border: 1px solid rgba(0, 212, 255, 0.2);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: #94a3b8;
      text-align: center;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: rgba(0, 212, 255, 0.3);
        margin-bottom: 16px;
      }

      p {
        margin: 0;
        font-size: 1rem;
      }
    }

    .info-panel {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
      margin-top: 24px;
      padding: 20px;
      background: rgba(0, 212, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(0, 212, 255, 0.2);
    }

    .corner-values {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .corner-item,
    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: rgba(15, 23, 42, 0.5);
      border-radius: 8px;
      border: 1px solid rgba(0, 212, 255, 0.15);

      .label {
        color: #94a3b8;
        font-size: 0.9rem;
      }

      .value {
        color: #00d4ff;
        font-weight: 600;
        font-family: monospace;
      }
    }

    .stats {
      display: flex;
      flex-direction: column;
      gap: 12px;
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

    @media (max-width: 1024px) {
      .header-content {
        flex-direction: column;
        align-items: stretch;
      }

      .controls {
        flex-direction: column;
        width: 100%;
      }

      .mode-select,
      .timestamp-select {
        width: 100%;
      }

      .info-panel {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MultiSensor3DChartComponent implements OnInit, OnDestroy {
  @ViewChild('plotContainer', { static: false }) plotContainer!: ElementRef;

  private destroy$ = new Subject<void>();
  
  results: CalcResult[] = [];
  viewModeControl = new FormControl<ViewMode>('BRUT');
  timestampControl = new FormControl<Date | null>(null);

  currentZ1 = 0;
  currentZ2 = 0;
  currentZ3 = 0;
  currentZ4 = 0;
  currentOndulatie = 0;
  currentP2P = 0;

  private L = 2; // dimensiune X
  private l = 4; // dimensiune Y

  constructor(private store: MultiSensorStoreService) {}

  ngOnInit(): void {
    // Ascultă la rezultate și parametri
    combineLatest([
      this.store.calcResults$,
      this.store.parameters$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([results, params]) => {
        this.results = results;
        this.L = params.L;
        this.l = params.l;

        // Selectează primul timestamp dacă nu e selectat nimic
        if (results.length > 0 && !this.timestampControl.value) {
          this.timestampControl.setValue(results[0].timestamp);
        }

        this.updateChart();
      });

    // Ascultă la schimbări de mod sau timestamp
    this.viewModeControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateChart());

    this.timestampControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateChart());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateChart(): void {
    if (!this.plotContainer || this.results.length === 0) return;

    const selectedTimestamp = this.timestampControl.value;
    if (!selectedTimestamp) return;

    const result = this.results.find(r => 
      r.timestamp.getTime() === selectedTimestamp.getTime()
    );

    if (!result) return;

    // Extrage valorile Z
    let z1 = result.z1Delta || 0;
    let z2 = result.z2Delta || 0;
    let z3 = result.z3Delta || 0;
    let z4 = result.z4Delta || 0;

    // Aplică detrending dacă e cazul
    if (this.viewModeControl.value === 'DETRENT') {
      const mean = (z1 + z2 + z3 + z4) / 4;
      z1 -= mean;
      z2 -= mean;
      z3 -= mean;
      z4 -= mean;
    }

    this.currentZ1 = z1;
    this.currentZ2 = z2;
    this.currentZ3 = z3;
    this.currentZ4 = z4;
    this.currentOndulatie = result.ondulatie || 0;
    this.currentP2P = Math.max(z1, z2, z3, z4) - Math.min(z1, z2, z3, z4);

    // Generează grid pentru interpolare biliniară
    const gridSize = 20;
    const xGrid: number[] = [];
    const yGrid: number[] = [];
    const zGrid: number[][] = [];

    for (let i = 0; i <= gridSize; i++) {
      const x = (i / gridSize) * this.L;
      xGrid.push(x);
    }

    for (let j = 0; j <= gridSize; j++) {
      const y = (j / gridSize) * this.l;
      yGrid.push(y);
    }

    // Interpolare biliniară
    for (let j = 0; j <= gridSize; j++) {
      const row: number[] = [];
      const y = yGrid[j];
      
      for (let i = 0; i <= gridSize; i++) {
        const x = xGrid[i];
        
        // Interpolare biliniară între cele 4 colțuri
        const tx = x / this.L;
        const ty = y / this.l;
        
        const z = (1 - tx) * (1 - ty) * z1 +  // Z1: (0, 0)
                  tx * (1 - ty) * z2 +          // Z2: (L, 0)
                  (1 - tx) * ty * z3 +          // Z3: (0, l)
                  tx * ty * z4;                 // Z4: (L, l)
        
        row.push(z);
      }
      zGrid.push(row);
    }

    // Creează graficul 3D
    const data: any[] = [
      // Suprafața principală
      {
        type: 'surface',
        x: xGrid,
        y: yGrid,
        z: zGrid,
        colorscale: [
          [0, '#1e3a8a'],      // albastru închis (jos)
          [0.2, '#3b82f6'],    // albastru
          [0.4, '#06b6d4'],    // cyan
          [0.5, '#10b981'],    // verde
          [0.6, '#fbbf24'],    // galben
          [0.8, '#f97316'],    // portocaliu
          [1, '#dc2626']       // roșu (sus)
        ],
        colorbar: {
          title: { text: 'dZ (mm)' },
          titleside: 'right',
          tickfont: { color: '#e0e6ed' },
          titlefont: { color: '#e0e6ed' }
        },
        contours: {
          z: {
            show: true,
            usecolormap: true,
            highlightcolor: '#00d4ff',
            project: { z: true }
          }
        }
      },
      // Markere pentru colțuri
      {
        type: 'scatter3d',
        mode: 'markers+text',
        x: [0, this.L, 0, this.L],
        y: [0, 0, this.l, this.l],
        z: [z1, z2, z3, z4],
        text: ['Z1', 'Z2', 'Z3', 'Z4'],
        textposition: 'top center',
        textfont: {
          color: '#00d4ff',
          size: 14,
          family: 'Arial Black, sans-serif'
        },
        marker: {
          size: 10,
          color: '#00d4ff',
          symbol: 'diamond',
          line: {
            color: '#ffffff',
            width: 2
          }
        },
        hovertemplate: '<b>%{text}</b><br>X: %{x:.2f} m<br>Y: %{y:.2f} m<br>dZ: %{z:.3f} mm<extra></extra>',
        showlegend: false
      }
    ];

    const layout: any = {
      title: {
        text: `Suprafața (dZ) - ${this.viewModeControl.value}`,
        font: { color: '#e0e6ed', size: 18 }
      },
      scene: {
        xaxis: {
          title: { text: 'X (m)' },
          titlefont: { color: '#e0e6ed' },
          tickfont: { color: '#94a3b8' },
          gridcolor: 'rgba(0, 212, 255, 0.2)',
          zerolinecolor: 'rgba(0, 212, 255, 0.4)'
        },
        yaxis: {
          title: { text: 'Y (m)' },
          titlefont: { color: '#e0e6ed' },
          tickfont: { color: '#94a3b8' },
          gridcolor: 'rgba(0, 212, 255, 0.2)',
          zerolinecolor: 'rgba(0, 212, 255, 0.4)'
        },
        zaxis: {
          title: { text: 'dZ (mm)' },
          titlefont: { color: '#e0e6ed' },
          tickfont: { color: '#94a3b8' },
          gridcolor: 'rgba(0, 212, 255, 0.2)',
          zerolinecolor: 'rgba(0, 212, 255, 0.4)'
        },
        camera: {
          eye: { x: 1.5, y: 1.5, z: 1.3 }
        },
        bgcolor: 'rgba(15, 23, 42, 0.5)',
        annotations: [
          {
            x: 0,
            y: 0,
            z: z1,
            text: `Z1<br>${z1.toFixed(2)} mm`,
            showarrow: true,
            arrowhead: 2,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#00d4ff',
            ax: -50,
            ay: -50,
            font: {
              color: '#00d4ff',
              size: 12,
              family: 'Arial, sans-serif'
            },
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            bordercolor: '#00d4ff',
            borderwidth: 1,
            borderpad: 4
          },
          {
            x: this.L,
            y: 0,
            z: z2,
            text: `Z2<br>${z2.toFixed(2)} mm`,
            showarrow: true,
            arrowhead: 2,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#00d4ff',
            ax: 50,
            ay: -50,
            font: {
              color: '#00d4ff',
              size: 12,
              family: 'Arial, sans-serif'
            },
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            bordercolor: '#00d4ff',
            borderwidth: 1,
            borderpad: 4
          },
          {
            x: 0,
            y: this.l,
            z: z3,
            text: `Z3<br>${z3.toFixed(2)} mm`,
            showarrow: true,
            arrowhead: 2,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#00d4ff',
            ax: -50,
            ay: 50,
            font: {
              color: '#00d4ff',
              size: 12,
              family: 'Arial, sans-serif'
            },
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            bordercolor: '#00d4ff',
            borderwidth: 1,
            borderpad: 4
          },
          {
            x: this.L,
            y: this.l,
            z: z4,
            text: `Z4<br>${z4.toFixed(2)} mm`,
            showarrow: true,
            arrowhead: 2,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#00d4ff',
            ax: 50,
            ay: 50,
            font: {
              color: '#00d4ff',
              size: 12,
              family: 'Arial, sans-serif'
            },
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            bordercolor: '#00d4ff',
            borderwidth: 1,
            borderpad: 4
          }
        ]
      },
      paper_bgcolor: 'rgba(0, 0, 0, 0)',
      plot_bgcolor: 'rgba(0, 0, 0, 0)',
      margin: { l: 0, r: 0, t: 40, b: 0 }
    };

    const config: any = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['toImage']
    };

    Plotly.newPlot(this.plotContainer.nativeElement, data, layout, config);
  }
}
