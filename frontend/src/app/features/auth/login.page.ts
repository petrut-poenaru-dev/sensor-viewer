import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <div class="login-background"></div>

      <div class="login-content">
        <div class="login-card">
          <div class="logo-section">
            <img src="src/assets/logo-graphein.jpeg" alt="Graphein Logo" class="logo">
            <h1 class="brand-title">Sensor<span class="accent">Viewer</span></h1>
            <p class="brand-subtitle">Sistem de monitorizare senzori</p>
          </div>

          <mat-card class="form-card">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="form-header">
                <div class="icon-wrapper">
                  <mat-icon>lock</mat-icon>
                </div>
                <h2>Autentificare</h2>
                <p>Introdu credențialele pentru a continua</p>
              </div>

              <div class="form-fields">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Username</mat-label>
                  <input
                    matInput
                    formControlName="username"
                    autocomplete="username"
                    [disabled]="loading">
                  <mat-icon matPrefix>person</mat-icon>
                  <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                    Username este obligatoriu
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Parolă</mat-label>
                  <input
                    matInput
                    [type]="hidePassword ? 'password' : 'text'"
                    formControlName="password"
                    autocomplete="current-password"
                    [disabled]="loading">
                  <mat-icon matPrefix>key</mat-icon>
                  <button
                    mat-icon-button
                    matSuffix
                    type="button"
                    (click)="hidePassword = !hidePassword"
                    [disabled]="loading">
                    <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                  <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                    Parola este obligatorie
                  </mat-error>
                </mat-form-field>

                <div class="error-message" *ngIf="errorMessage">
                  <mat-icon>error</mat-icon>
                  <span>{{ errorMessage }}</span>
                </div>

                <button
                  mat-raised-button
                  color="primary"
                  type="submit"
                  class="login-button"
                  [disabled]="loading || loginForm.invalid">
                  <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
                  <span *ngIf="!loading">
                    <mat-icon>login</mat-icon>
                    Autentificare
                  </span>
                </button>
              </div>
            </form>
          </mat-card>

          <div class="powered-by">
            <span>Powered by</span>
            <strong>Graphein</strong>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .login-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1729 100%);

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background:
          radial-gradient(circle at 30% 40%, rgba(0, 212, 255, 0.1) 0%, transparent 25%),
          radial-gradient(circle at 70% 60%, rgba(0, 153, 255, 0.08) 0%, transparent 25%);
        animation: rotate 30s linear infinite;
      }
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .login-content {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 480px;
      padding: 24px;
      animation: fadeInUp 0.6s ease;
    }

    .login-card {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .logo-section {
      text-align: center;
      animation: fadeInDown 0.6s ease;
    }

    .logo {
      width: 120px;
      height: 120px;
      object-fit: contain;
      border-radius: 20px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4),
                  0 0 0 2px rgba(0, 212, 255, 0.3);
      animation: float 3s ease-in-out infinite;
      margin-bottom: 24px;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .brand-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 8px 0;
      background: linear-gradient(135deg, #ffffff 0%, #00d4ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: glow 2s ease-in-out infinite;
    }

    @keyframes glow {
      0%, 100% { text-shadow: 0 0 10px rgba(0, 212, 255, 0.3); }
      50% { text-shadow: 0 0 20px rgba(0, 212, 255, 0.6); }
    }

    .accent {
      color: #00d4ff;
      -webkit-text-fill-color: #00d4ff;
    }

    .brand-subtitle {
      font-size: 1rem;
      color: #94a3b8;
      margin: 0;
    }

    .form-card {
      background: rgba(20, 30, 60, 0.6) !important;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 212, 255, 0.2);
      animation: fadeInUp 0.6s ease 0.2s both;
      padding: 40px 32px !important;
    }

    mat-card-content {
      padding: 0 !important;
    }

    .form-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .icon-wrapper {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px;
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(0, 153, 255, 0.2) 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(0, 212, 255, 0.3);

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: #00d4ff;
      }
    }

    .form-header h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #e0e6ed;
      margin: 0 0 8px 0;
    }

    .form-header p {
      font-size: 0.9rem;
      color: #94a3b8;
      margin: 0;
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      color: #fca5a5;
      font-size: 0.9rem;
      animation: shake 0.4s ease;

      mat-icon {
        color: #ef4444;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    .login-button {
      height: 56px;
      font-size: 1rem !important;
      font-weight: 600 !important;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s ease;

      mat-spinner {
        display: inline-block;
      }

      span {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }

      &:disabled {
        cursor: not-allowed !important;
        background: rgba(100, 116, 139, 0.3) !important;
        color: rgba(148, 163, 184, 0.5) !important;
        box-shadow: none !important;
        opacity: 0.6;
      }

      &:not(:disabled):hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 212, 255, 0.6) !important;
      }
    }

    .powered-by {
      text-align: center;
      font-size: 0.9rem;
      color: #94a3b8;
      animation: fadeIn 0.6s ease 0.4s both;

      strong {
        color: #00d4ff;
        font-weight: 600;
        margin-left: 4px;
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

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @media (max-width: 768px) {
      .login-content {
        max-width: 100%;
        padding: 16px;
      }

      .logo {
        width: 100px;
        height: 100px;
      }

      .brand-title {
        font-size: 2rem;
      }

      .form-card {
        padding: 32px 24px !important;
      }
    }
  `]
})
export class LoginPage {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  hidePassword = true;
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/import']);
        } else {
          this.errorMessage = response.message || 'Eroare la autentificare';
          this.loading = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Eroare de conexiune la server';
        this.loading = false;
      }
    });
  }
}
