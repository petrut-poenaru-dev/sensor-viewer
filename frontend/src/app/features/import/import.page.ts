import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CsvImportService } from '../../core/services/csv-import.service';
import { DatasetStoreService } from '../../core/services/dataset-store.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {CommonModule} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-import-page',
  imports: [MatCardModule, MatButtonModule, CommonModule , MatIconModule],
  template: `
    <div class="import-container">
      <div class="hero-section">
        <div class="hero-icon">
          <img src="assets/img/logo-graphein.jpeg" alt="Graphein Logo" class="hero-logo">
        </div>
        <h1 class="hero-title">Import Date Senzori</h1>
        <p class="hero-subtitle">Încarcă fișiere CSV pentru analiza datelor în timp real</p>
      </div>

      <mat-card class="import-card">
        <mat-card-content>
          <div class="upload-zone" [class.has-data]="hasDataset" (click)="fileInput.click()">
            <div class="upload-icon">
              <mat-icon>{{ hasDataset ? 'check_circle' : 'upload_file' }}</mat-icon>
            </div>
            <h3>{{ hasDataset ? 'Fișier încărcat cu succes' : 'Selectează fișier CSV' }}</h3>
            <p>Detectare automată a header-ului <strong>Date-and-time</strong></p>
            <p class="file-info">Format acceptat: .csv</p>
          </div>

          <input #fileInput type="file" accept=".csv,text/csv" (change)="onFile($event)" hidden />

          <div class="actions">
            <button mat-raised-button color="primary" (click)="fileInput.click()" class="upload-btn">
              <mat-icon>{{ hasDataset ? 'refresh' : 'upload' }}</mat-icon>
              {{ hasDataset ? 'Încarcă alt fișier' : 'Alege fișier CSV' }}
            </button>

            <button mat-stroked-button (click)="goSensors()" [disabled]="!hasDataset" class="nav-btn">
              <span>Vizualizează datele</span>
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </div>

          <div class="status-message" *ngIf="error || hasDataset">
            <div class="message error" *ngIf="error">
              <mat-icon>error</mat-icon>
              <span>{{ error }}</span>
            </div>
            <div class="message success" *ngIf="hasDataset && !error">
              <mat-icon>check_circle</mat-icon>
              <span>Datele au fost încărcate cu succes. Poți trece la dashboard.</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="info-cards">
        <div class="info-card">
          <mat-icon>speed</mat-icon>
          <h4>Procesare rapidă</h4>
          <p>Analiză instantanee a datelor</p>
        </div>
        <div class="info-card">
          <mat-icon>security</mat-icon>
          <h4>Securitate</h4>
          <p>Datele rămân în browser</p>
        </div>
        <div class="info-card">
          <mat-icon>insights</mat-icon>
          <h4>Vizualizare avansată</h4>
          <p>Grafice interactive și tabele</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .import-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .hero-section {
      text-align: center;
      margin-bottom: 40px;
      animation: fadeInDown 0.6s ease;
    }

    .hero-icon {
      width: 120px;
      height: 120px;
      margin: 0 auto 20px;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(10px);
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4),
                  0 0 0 1px rgba(20, 146, 56, 0.2);
      animation: float 3s ease-in-out infinite;
      padding: 20px;
      border: 2px solid rgba(20, 146, 56, 0.3);

      .hero-logo {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 12px;
      }

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #149238;
      }
    }

    .hero-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 12px 0;
      background: linear-gradient(135deg, #ffffff 0%, #149238 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: glow 2s ease-in-out infinite;
    }

    .hero-subtitle {
      font-size: 1.1rem;
      color: #4a4a4a;
      margin: 0;
    }

    .import-card {
      margin-bottom: 32px;
      animation: fadeInUp 0.6s ease 0.2s both;
    }

    .upload-zone {
      border: 2px dashed rgba(20, 146, 56, 0.3);
      border-radius: 16px;
      padding: 48px 32px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.3);
      margin-bottom: 24px;

      &:hover {
        border-color: rgba(20, 146, 56, 0.6);
        background: rgba(255, 255, 255, 0.5);
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(20, 146, 56, 0.2);
      }

      &.has-data {
        border-color: rgba(26, 181, 71, 0.5);
        background: rgba(26, 181, 71, 0.05);

        .upload-icon mat-icon {
          color: #1ab547;
        }
      }
    }

    .upload-icon {
      margin-bottom: 16px;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #149238;
        transition: all 0.3s ease;
      }
    }

    .upload-zone h3 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #020202;
      margin: 0 0 8px 0;
    }

    .upload-zone p {
      color: #4a4a4a;
      margin: 4px 0;
      font-size: 0.95rem;
    }

    .file-info {
      font-size: 0.85rem !important;
      color: #808080 !important;
      margin-top: 12px !important;
    }

    .actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .upload-btn, .nav-btn {
      min-width: 200px;
      height: 48px;
      font-size: 1rem !important;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-message {
      margin-top: 24px;
    }

    .message {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-radius: 12px;
      font-size: 0.95rem;
      animation: slideIn 0.4s ease;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      &.error {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #fca5a5;

        mat-icon {
          color: #ef4444;
        }
      }

      &.success {
        background: rgba(26, 181, 71, 0.1);
        border: 1px solid rgba(26, 181, 71, 0.3);
        color: #86efac;

        mat-icon {
          color: #1ab547;
        }
      }
    }

    .info-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 32px;
    }

    .info-card {
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(20, 146, 56, 0.15);
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      transition: all 0.3s ease;
      animation: fadeInUp 0.6s ease both;

      &:nth-child(1) { animation-delay: 0.3s; }
      &:nth-child(2) { animation-delay: 0.4s; }
      &:nth-child(3) { animation-delay: 0.5s; }

      &:hover {
        border-color: rgba(20, 146, 56, 0.4);
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(20, 146, 56, 0.2);
      }

      mat-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        color: #149238;
        margin-bottom: 12px;
      }

      h4 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #020202;
        margin: 0 0 8px 0;
      }

      p {
        font-size: 0.9rem;
        color: #4a4a4a;
        margin: 0;
      }
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

    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    @keyframes glow {
      0%, 100% {
        text-shadow: 0 0 10px rgba(20, 146, 56, 0.3);
      }
      50% {
        text-shadow: 0 0 20px rgba(20, 146, 56, 0.6);
      }
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }

      .upload-zone {
        padding: 32px 20px;
      }

      .actions {
        flex-direction: column;
      }

      .upload-btn, .nav-btn {
        width: 100%;
      }
    }
  `],
})
export class ImportPage {
  error: string | null = null;
  hasDataset = false;

  constructor(
    private readonly csv: CsvImportService,
    private readonly store: DatasetStoreService,
    private readonly router: Router
  ) {
    this.store.dataset$.subscribe(ds => (this.hasDataset = !!ds));
  }

  async onFile(ev: Event) {
    this.error = null;
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const dataset = this.csv.parse(text);
      this.store.setDataset(dataset);
    } catch (e: any) {
      this.error = e?.message ?? 'Eroare la import.';
      this.store.clear();
    } finally {
      input.value = '';
    }
  }

  goSensors() {
    this.router.navigateByUrl('/sensors');
  }
}


