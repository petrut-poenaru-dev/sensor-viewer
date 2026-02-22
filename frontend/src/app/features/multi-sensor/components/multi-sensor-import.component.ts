import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MultiSensorStoreService } from '../../../core/services/multi-sensor-store.service';
import { MultiSensorImportService } from '../../../core/services/multi-sensor-import.service';

interface SensorUpload {
  key: 'z1' | 'z2' | 'z3' | 'z4' | 'x' | 'y';
  label: string;
  description: string;
  file: File | null;
  loaded: boolean;
  error: string | null;
}

@Component({
  standalone: true,
  selector: 'app-multi-sensor-import',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <mat-card class="import-card">
      <mat-card-header>
        <div class="header-content">
          <div class="icon-badge">
            <mat-icon>cloud_upload</mat-icon>
          </div>
          <div>
            <mat-card-title>Import CSV-uri (6 Senzori)</mat-card-title>
            <mat-card-subtitle>
              Încarcă fișierele CSV pentru fiecare senzor
            </mat-card-subtitle>
          </div>
        </div>
      </mat-card-header>

      <mat-card-content>
        <div class="sensors-grid">
          @for (sensor of sensors; track sensor.key) {
            <div class="sensor-upload" [class.loaded]="sensor.loaded" [class.error]="sensor.error">
              <div class="sensor-info">
                <mat-icon>{{ sensor.loaded ? 'check_circle' : 'sensors' }}</mat-icon>
                <div class="sensor-details">
                  <strong>{{ sensor.label }}</strong>
                  <span class="description">{{ sensor.description }}</span>
                  @if (sensor.file) {
                    <span class="filename">{{ sensor.file.name }}</span>
                  }
                  @if (sensor.error) {
                    <span class="error-text">{{ sensor.error }}</span>
                  }
                </div>
              </div>
              
              <input 
                type="file" 
                accept=".csv,text/csv" 
                (change)="onFileSelected($event, sensor)"
                #fileInput
                hidden>
              
              <button 
                mat-stroked-button 
                (click)="fileInput.click()"
                [color]="sensor.loaded ? 'accent' : 'primary'">
                <mat-icon>{{ sensor.loaded ? 'refresh' : 'upload_file' }}</mat-icon>
                {{ sensor.loaded ? 'Schimbă' : 'Alege CSV' }}
              </button>
            </div>
          }
        </div>

        <div class="status-bar">
          <div class="status-info">
            <mat-icon [class.complete]="loadedCount === 6">
              {{ loadedCount === 6 ? 'check_circle' : 'info' }}
            </mat-icon>
            <span>
              <strong>{{ loadedCount }}/6</strong> senzori încărcați
            </span>
          </div>

          @if (loadedCount > 0) {
            <button mat-button color="warn" (click)="clearAll()">
              <mat-icon>delete</mat-icon>
              Șterge tot
            </button>
          }
        </div>

        @if (loadedCount === 6) {
          <div class="success-message">
            <mat-icon>celebration</mat-icon>
            <span>Toate CSV-urile sunt încărcate! Configurează parametrii mai jos.</span>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .import-card {
      margin-bottom: 24px;
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

    .sensors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .sensor-upload {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: rgba(15, 23, 42, 0.5);
      border-radius: 12px;
      border: 1px solid rgba(0, 212, 255, 0.15);
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(0, 212, 255, 0.4);
        transform: translateY(-2px);
      }

      &.loaded {
        border-color: rgba(0, 255, 136, 0.4);
        background: rgba(0, 255, 136, 0.05);
      }

      &.error {
        border-color: rgba(239, 68, 68, 0.4);
        background: rgba(239, 68, 68, 0.05);
      }
    }

    .sensor-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: #00d4ff;
      }

      .loaded & mat-icon {
        color: #00ff88;
      }

      .error & mat-icon {
        color: #ef4444;
      }
    }

    .sensor-details {
      display: flex;
      flex-direction: column;
      gap: 4px;

      strong {
        color: #e0e6ed;
        font-size: 0.95rem;
      }

      .description {
        color: #94a3b8;
        font-size: 0.85rem;
      }

      .filename {
        color: #00d4ff;
        font-size: 0.8rem;
        font-family: monospace;
      }

      .error-text {
        color: #ef4444;
        font-size: 0.8rem;
      }
    }

    .status-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: rgba(0, 212, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(0, 212, 255, 0.2);
      margin-bottom: 16px;
    }

    .status-info {
      display: flex;
      align-items: center;
      gap: 12px;

      mat-icon {
        color: #00d4ff;
        
        &.complete {
          color: #00ff88;
        }
      }

      span {
        color: #e0e6ed;
        font-size: 0.95rem;
      }
    }

    .success-message {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: rgba(0, 255, 136, 0.1);
      border: 1px solid rgba(0, 255, 136, 0.3);
      border-radius: 12px;
      color: #86efac;
      animation: slideIn 0.4s ease;

      mat-icon {
        color: #00ff88;
        font-size: 24px;
        width: 24px;
        height: 24px;
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

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @media (max-width: 768px) {
      .sensors-grid {
        grid-template-columns: 1fr;
      }

      .sensor-upload {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;

        button {
          width: 100%;
        }
      }
    }
  `]
})
export class MultiSensorImportComponent {
  sensors: SensorUpload[] = [
    { key: 'z1', label: 'Z1', description: 'Colț Față-Stânga', file: null, loaded: false, error: null },
    { key: 'z2', label: 'Z2', description: 'Colț Față-Dreapta', file: null, loaded: false, error: null },
    { key: 'z3', label: 'Z3', description: 'Colț Spate-Stânga', file: null, loaded: false, error: null },
    { key: 'z4', label: 'Z4', description: 'Colț Spate-Dreapta', file: null, loaded: false, error: null },
    { key: 'x', label: 'X', description: 'Fața-Spate', file: null, loaded: false, error: null },
    { key: 'y', label: 'Y', description: 'Stânga-Dreapta', file: null, loaded: false, error: null }
  ];

  loadedCount = 0;

  constructor(
    private store: MultiSensorStoreService,
    private importService: MultiSensorImportService
  ) {
    // Sincronizează starea cu store-ul
    this.store.loadedCount$.subscribe(count => {
      this.loadedCount = count;
    });

    // Sincronizează starea loaded pentru fiecare senzor
    this.store.multiSensorData$.subscribe(data => {
      this.sensors[0].loaded = data.z1 !== null;
      this.sensors[1].loaded = data.z2 !== null;
      this.sensors[2].loaded = data.z3 !== null;
      this.sensors[3].loaded = data.z4 !== null;
      this.sensors[4].loaded = data.x !== null;
      this.sensors[5].loaded = data.y !== null;
    });
  }

  async onFileSelected(event: Event, sensor: SensorUpload): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;

    sensor.file = file;
    sensor.error = null;

    try {
      const text = await file.text();
      const dataset = this.importService.parseSensorCSV(text, sensor.label);
      
      // Setează în store
      switch (sensor.key) {
        case 'z1': this.store.setZ1(dataset); break;
        case 'z2': this.store.setZ2(dataset); break;
        case 'z3': this.store.setZ3(dataset); break;
        case 'z4': this.store.setZ4(dataset); break;
        case 'x': this.store.setX(dataset); break;
        case 'y': this.store.setY(dataset); break;
      }

      sensor.loaded = true;
    } catch (error: any) {
      sensor.error = error.message || 'Eroare la parsare CSV';
      sensor.loaded = false;
    } finally {
      input.value = '';
    }
  }

  clearAll(): void {
    if (confirm('Sigur vrei să ștergi toate CSV-urile încărcate?')) {
      this.store.clearAll();
      this.sensors.forEach(s => {
        s.file = null;
        s.loaded = false;
        s.error = null;
      });
    }
  }
}
