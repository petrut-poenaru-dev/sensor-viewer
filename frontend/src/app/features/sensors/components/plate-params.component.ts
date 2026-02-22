import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { PlateParamsStoreService } from '../../../core/services/plate-params-store.service';

@Component({
  standalone: true,
  selector: 'app-plate-params',
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule],
  template: `
    <mat-card class="params-card">
      <mat-card-header>
        <div class="header-content">
          <div class="icon-badge">
            <mat-icon>aspect_ratio</mat-icon>
          </div>
          <div>
            <mat-card-title>Dimensiuni Placă</mat-card-title>
            <mat-card-subtitle>Configurează parametrii geometrici ai plăcii</mat-card-subtitle>
          </div>
        </div>
      </mat-card-header>

      <mat-card-content>
        <div class="params-row">
          <mat-form-field appearance="outline" class="param-field">
            <mat-label>L (lungime X)</mat-label>
            <input matInput type="number" [formControl]="L" step="0.1" />
            <mat-hint>Dimensiune pe axa X</mat-hint>
            <span matSuffix class="suffix">mm</span>
          </mat-form-field>

          <mat-form-field appearance="outline" class="param-field">
            <mat-label>l (lățime Y)</mat-label>
            <input matInput type="number" [formControl]="l" step="0.1" />
            <mat-hint>Dimensiune pe axa Y</mat-hint>
            <span matSuffix class="suffix">mm</span>
          </mat-form-field>

          <mat-form-field appearance="outline" class="param-field">
            <mat-label>nx (rezoluție X)</mat-label>
            <input matInput type="number" [formControl]="nx" step="1" />
            <mat-hint>Puncte pe axa X (2-301)</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline" class="param-field">
            <mat-label>ny (rezoluție Y)</mat-label>
            <input matInput type="number" [formControl]="ny" step="1" />
            <mat-hint>Puncte pe axa Y (2-301)</mat-hint>
          </mat-form-field>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .params-card {
      margin-bottom: 24px;
      animation: fadeInDown 0.6s ease;
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

    .params-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
    }

    .param-field {
      width: 100%;
    }

    .suffix {
      color: #94a3b8;
      font-size: 0.9rem;
      margin-right: 8px;
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

    @media (max-width: 768px) {
      .params-row {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class PlateParamsComponent {
  L  = new FormControl<number>(2,  { nonNullable: true });
  l  = new FormControl<number>(4,  { nonNullable: true });
  nx = new FormControl<number>(21, { nonNullable: true });
  ny = new FormControl<number>(21, { nonNullable: true });

  constructor(private readonly params: PlateParamsStoreService) {
    // Inițializează valorile din serviciu
    const currentParams = this.params.params$.subscribe(p => {
      this.L.setValue(p.L, { emitEvent: false });
      this.l.setValue(p.l, { emitEvent: false });
      this.nx.setValue(p.nx, { emitEvent: false });
      this.ny.setValue(p.ny, { emitEvent: false });
    });

    // Ascultă schimbările și le propagă la serviciu
    this.L.valueChanges.pipe(debounceTime(150), distinctUntilChanged())
      .subscribe(v => {
        console.log('L changed to:', v);
        this.params.set('L', this.safe(v, 0.0001));
      });

    this.l.valueChanges.pipe(debounceTime(150), distinctUntilChanged())
      .subscribe(v => {
        console.log('l changed to:', v);
        this.params.set('l', this.safe(v, 0.0001));
      });

    this.nx.valueChanges.pipe(debounceTime(150), distinctUntilChanged())
      .subscribe(v => {
        console.log('nx changed to:', v);
        this.params.set('nx', this.safeInt(v, 2, 301));
      });

    this.ny.valueChanges.pipe(debounceTime(150), distinctUntilChanged())
      .subscribe(v => {
        console.log('ny changed to:', v);
        this.params.set('ny', this.safeInt(v, 2, 301));
      });
  }

  private safe(v: number, min: number): number {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(min, n) : min;
  }
  private safeInt(v: number, min: number, max: number): number {
    const n = Math.round(Number(v));
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }
}
