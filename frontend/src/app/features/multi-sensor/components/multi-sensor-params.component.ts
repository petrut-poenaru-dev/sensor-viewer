import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime } from 'rxjs';
import { MultiSensorStoreService } from '../../../core/services/multi-sensor-store.service';

@Component({
  standalone: true,
  selector: 'app-multi-sensor-params',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <mat-card class="params-card">
      <mat-card-header>
        <div class="header-content">
          <div class="icon-badge">
            <mat-icon>tune</mat-icon>
          </div>
          <div>
            <mat-card-title>Parametri Calcul</mat-card-title>
            <mat-card-subtitle>Configurează parametrii pentru calculele CALC</mat-card-subtitle>
          </div>
        </div>
      </mat-card-header>

      <mat-card-content>
        <form [formGroup]="paramsForm">
          <!-- Unitate și Dimensiuni -->
          <div class="section">
            <h3 class="section-title">
              <mat-icon>straighten</mat-icon>
              Unitate și Dimensiuni
            </h3>
            <div class="params-row">
              <mat-form-field appearance="outline">
                <mat-label>Unitate măsură</mat-label>
                <mat-select formControlName="unit">
                  <mat-option value="m">metri (m)</mat-option>
                  <mat-option value="mm">milimetri (mm)</mat-option>
                </mat-select>
                <mat-hint>Unitatea din CSV-uri</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>L (dimensiune pe X)</mat-label>
                <input matInput type="number" formControlName="L" step="0.1">
                <span matSuffix>m</span>
                <mat-hint>Lungime placă</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>l (dimensiune pe Y)</mat-label>
                <input matInput type="number" formControlName="l" step="0.1">
                <span matSuffix>m</span>
                <mat-hint>Lățime placă</mat-hint>
              </mat-form-field>
            </div>
          </div>

          <!-- Direcții -->
          <div class="section">
            <h3 class="section-title">
              <mat-icon>explore</mat-icon>
              Direcții Axe
            </h3>
            <div class="params-row">
              <mat-form-field appearance="outline">
                <mat-label>Direcție X</mat-label>
                <mat-select formControlName="directionX">
                  <mat-option value="FATA">+X = FATA</mat-option>
                  <mat-option value="SPATE">+X = SPATE</mat-option>
                </mat-select>
                <mat-hint>Sens pozitiv axa X</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Direcție Y</mat-label>
                <mat-select formControlName="directionY">
                  <mat-option value="STANGA">+Y = STANGA</mat-option>
                  <mat-option value="DREAPTA">+Y = DREAPTA</mat-option>
                </mat-select>
                <mat-hint>Sens pozitiv axa Y</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Direcție Z</mat-label>
                <mat-select formControlName="directionZ">
                  <mat-option value="IN JOS">+Z = IN SUS (ridicare)</mat-option>
                  <mat-option value="IN SUS">-Z = IN JOS (tasare)</mat-option>
                </mat-select>
                <mat-hint>Sens pozitiv axa Z</mat-hint>
              </mat-form-field>
            </div>
          </div>

          <!-- Praguri -->
          <div class="section">
            <h3 class="section-title">
              <mat-icon>rule</mat-icon>
              Praguri Validare
            </h3>
            <div class="params-row">
              <mat-form-field appearance="outline">
                <mat-label>Prag semnal OK (min)</mat-label>
                <input matInput type="number" formControlName="signalThreshold" step="1">
                <mat-hint>Semnal minim acceptabil</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Prag Std tilt OK (max)</mat-label>
                <input matInput type="number" formControlName="stdTiltThreshold" step="0.1">
                <mat-hint>Std tilt maxim acceptabil</mat-hint>
              </mat-form-field>
            </div>
          </div>

          <!-- Timestamp Referință -->
          <div class="section">
            <h3 class="section-title">
              <mat-icon>schedule</mat-icon>
              Timestamp Referință (T0)
            </h3>
            <div class="params-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Selectează timestamp referință</mat-label>
                <mat-select formControlName="referenceTimestamp">
                  <mat-option [value]="null">-- Selectează T0 --</mat-option>
                  @for (ts of availableTimestamps$ | async; track ts.getTime()) {
                    <mat-option [value]="ts">
                      {{ ts | date:'dd-MMM-yyyy HH:mm:ss' }}
                    </mat-option>
                  }
                </mat-select>
                <mat-hint>Punctul de referință pentru calcul delta</mat-hint>
              </mat-form-field>
            </div>

            @if (!paramsForm.get('referenceTimestamp')?.value) {
              <div class="warning-message">
                <mat-icon>warning</mat-icon>
                <span>Selectează un timestamp referință (T0) pentru a calcula rezultatele</span>
              </div>
            }
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .params-card {
      margin-bottom: 24px;
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

    .section {
      margin-bottom: 32px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      color: #020202;
      margin: 0 0 16px 0;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(20, 146, 56, 0.2);

      mat-icon {
        color: #149238;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    .params-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    .warning-message {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(251, 191, 36, 0.1);
      border: 1px solid rgba(251, 191, 36, 0.3);
      border-radius: 8px;
      color: #fbbf24;
      font-size: 0.9rem;
      margin-top: 16px;

      mat-icon {
        color: #fbbf24;
        font-size: 20px;
        width: 20px;
        height: 20px;
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

    @media (max-width: 768px) {
      .params-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MultiSensorParamsComponent implements OnInit {
  paramsForm = new FormGroup({
    unit: new FormControl<'m' | 'mm'>('m'),
    L: new FormControl<number>(2),
    l: new FormControl<number>(4),
    directionX: new FormControl<'FATA' | 'SPATE'>('FATA'),
    directionY: new FormControl<'STANGA' | 'DREAPTA'>('DREAPTA'),
    directionZ: new FormControl<'IN SUS' | 'IN JOS'>('IN JOS'),
    signalThreshold: new FormControl<number>(70),
    stdTiltThreshold: new FormControl<number>(0.5),
    referenceTimestamp: new FormControl<Date | null>(null)
  });

  availableTimestamps$;

  constructor(private store: MultiSensorStoreService) {
    this.availableTimestamps$ = this.store.availableTimestamps$;
  }

  ngOnInit(): void {
    // Sincronizează cu store
    this.paramsForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(values => {
        this.store.updateParameters({
          unit: values.unit!,
          L: values.L!,
          l: values.l!,
          directionX: values.directionX!,
          directionY: values.directionY!,
          directionZ: values.directionZ!,
          signalThreshold: values.signalThreshold!,
          stdTiltThreshold: values.stdTiltThreshold!,
          referenceTimestamp: values.referenceTimestamp
        });
      });
  }
}


