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
      background: rgba(10, 14, 39, 0.8);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(0, 212, 255, 0.2);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    }

    .toolbar {
      background: transparent !important;
      color: #e0e6ed;
      padding: 0 24px;
      height: 70px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    .company-logo {
      height: 45px;
      width: auto;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 6px 25px rgba(0, 212, 255, 0.4);
      }
    }

    .brand-text {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      background: linear-gradient(135deg, #ffffff 0%, #00d4ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .accent {
      color: #00d4ff;
      -webkit-text-fill-color: #00d4ff;
    }

    .spacer {
      flex: 1;
    }

    .nav-links {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: 16px;
      padding-left: 16px;
      border-left: 1px solid rgba(0, 212, 255, 0.2);
    }

    .username {
      color: #00d4ff;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .logout-btn {
      color: #94a3b8 !important;
      transition: all 0.3s ease;

      &:hover {
        color: #ef4444 !important;
        background: rgba(239, 68, 68, 0.1) !important;
      }
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px !important;
      border-radius: 10px !important;
      color: #94a3b8 !important;
      transition: all 0.3s ease !important;
      position: relative;
      overflow: hidden;

      mat-icon {
        color: inherit;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      span {
        font-weight: 500;
        font-size: 0.95rem;
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 153, 255, 0.1) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        color: #00d4ff !important;
        background: rgba(0, 212, 255, 0.05) !important;

        &::before {
          opacity: 1;
        }
      }

      &.active {
        color: #00d4ff !important;
        background: rgba(0, 212, 255, 0.15) !important;
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.2),
                    inset 0 0 20px rgba(0, 212, 255, 0.1);

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00d4ff, transparent);
          box-shadow: 0 0 10px #00d4ff;
        }
      }
    }

    .page {
      padding: 32px 24px;
      max-width: 1400px;
      margin: 0 auto;
      min-height: calc(100vh - 70px);
    }

    @media (max-width: 768px) {
      .toolbar {
        padding: 0 16px;
        height: 64px;
      }

      .company-logo {
        height: 36px;
      }

      .brand-text {
        font-size: 1.2rem;
      }

      .nav-link span {
        display: none;
      }

      .nav-link {
        padding: 8px 12px !important;
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
