import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ParametersStoreService } from '../../../core/services/parameters-store.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
@Component({
  standalone: true,
  selector: 'app-calc-params',
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule, AsyncPipe],
  template: `
    <mat-card class="params-card">
      <mat-card-header>
        <div class="header-content">
          <div class="icon-badge">
            <mat-icon>tune</mat-icon>
          </div>
          <div>
            <mat-card-title>Parametri Calcul</mat-card-title>
            <mat-card-subtitle>Formula: v2 = v × A + B</mat-card-subtitle>
          </div>
        </div>
      </mat-card-header>

      <mat-card-content>
        <div class="params-row">
          <mat-form-field appearance="outline" class="param-field">
            <mat-label>Parametrul A (multiplicator)</mat-label>
            <input matInput type="number" [formControl]="pA" />
            <mat-hint>Valoare implicită: 2</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline" class="param-field">
            <mat-label>Parametrul B (offset)</mat-label>
            <input matInput type="number" [formControl]="pB" />
            <mat-hint>Valoare implicită: 4</mat-hint>
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

    .params-row {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .param-field {
      flex: 1;
      min-width: 250px;
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
  `],
})
export class CalcParamsComponent {
  pA = new FormControl<number>(2, { nonNullable: true });
  pB = new FormControl<number>(4, { nonNullable: true });

  constructor(private readonly params: ParametersStoreService) {
    // Inițializează valorile din serviciu
    const currentParams = this.params.params$.subscribe(p => {
      this.pA.setValue(p.pA, { emitEvent: false });
      this.pB.setValue(p.pB, { emitEvent: false });
    });

    // Ascultă schimbările și le propagă la serviciu
    this.pA.valueChanges.pipe(debounceTime(150), distinctUntilChanged())
      .subscribe(v => {
        console.log('pA changed to:', v);
        this.params.setParam('pA', v);
      });

    this.pB.valueChanges.pipe(debounceTime(150), distinctUntilChanged())
      .subscribe(v => {
        console.log('pB changed to:', v);
        this.params.setParam('pB', v);
      });
  }
}


