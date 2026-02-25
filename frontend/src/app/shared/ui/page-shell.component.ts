import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-page-shell',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterLinkActive, AsyncPipe, NgIf],
  template: `
    <div class="nav-wrapper">
      <mat-toolbar class="toolbar">
        <div class="brand" routerLink="/">
          <img src="assets/img/logo-graphein.jpeg" alt="Graphein Logo" class="company-logo">
          <span class="brand-text">Sensor<span class="accent">Viewer</span></span>
        </div>
        <span class="spacer"></span>

        <nav class="nav-links">
          <a mat-button routerLink="/import" routerLinkActive="active" class="nav-link">
            <mat-icon>cloud_upload</mat-icon>
            <span>Import</span>
          </a>
          <a mat-button routerLink="/sensors" routerLinkActive="active" class="nav-link">
            <mat-icon>analytics</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-button routerLink="/multi-sensor" routerLinkActive="active" class="nav-link">
            <mat-icon>grid_on</mat-icon>
            <span>6 Senzori</span>
          </a>
          
          <div class="user-section" *ngIf="authService.currentUser$ | async as user">
            <span class="username">{{ user.username }}</span>
            <button mat-icon-button (click)="logout()" class="logout-btn" title="Logout">
              <mat-icon>logout</mat-icon>
            </button>
          </div>
        </nav>
      </mat-toolbar>
    </div>

    <main class="page">
      <ng-content/>
    </main>
  `,
  styles: [`
    .nav-wrapper {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #FFFFFF;
      border-bottom: 2px solid #149238;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }

    .toolbar {
      background: transparent !important;
      color: #020202;
      padding: 0 32px;
      height: 72px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 8px 12px;
      border-radius: 12px;

      &:hover {
        background: rgba(20, 146, 56, 0.05);
      }
    }

    .company-logo {
      height: 48px;
      width: auto;
      object-fit: contain;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 16px rgba(20, 146, 56, 0.3);
        transform: scale(1.05);
      }
    }

    .brand-text {
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #020202;
    }

    .accent {
      color: #149238;
    }

    .spacer {
      flex: 1;
    }

    .nav-links {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: 20px;
      padding-left: 20px;
      border-left: 2px solid rgba(20, 146, 56, 0.2);
    }

    .username {
      color: #149238;
      font-weight: 600;
      font-size: 0.95rem;
      padding: 6px 12px;
      background: rgba(20, 146, 56, 0.1);
      border-radius: 8px;
    }

    .logout-btn {
      color: #4a4a4a !important;
      transition: all 0.3s ease;

      &:hover {
        color: #DB0A18 !important;
        background: rgba(219, 10, 24, 0.1) !important;
        transform: rotate(10deg);
      }
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 24px !important;
      border-radius: 12px !important;
      color: #4a4a4a !important;
      transition: all 0.3s ease !important;
      position: relative;
      font-weight: 500;
      border: 2px solid transparent;

      mat-icon {
        color: inherit;
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      span {
        font-weight: 600;
        font-size: 0.95rem;
      }

      &:hover {
        color: #149238 !important;
        background: rgba(20, 146, 56, 0.08) !important;
        border-color: rgba(20, 146, 56, 0.2);
        transform: translateY(-2px);
      }

      &.active {
        color: #FFFFFF !important;
        background: linear-gradient(135deg, #149238 0%, #0f6b28 100%) !important;
        border-color: #149238;
        box-shadow: 0 4px 12px rgba(20, 146, 56, 0.3);

        mat-icon {
          color: #FFFFFF !important;
        }
      }
    }

    .page {
      padding: 32px 24px;
      max-width: 1400px;
      margin: 0 auto;
      min-height: calc(100vh - 72px);
    }

    @media (max-width: 768px) {
      .toolbar {
        padding: 0 16px;
        height: 64px;
      }

      .company-logo {
        height: 40px;
      }

      .brand-text {
        font-size: 1.3rem;
      }

      .nav-link span {
        display: none;
      }

      .nav-link {
        padding: 10px 14px !important;
      }

      .username {
        display: none;
      }
    }
  `],
})
export class PageShellComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}


