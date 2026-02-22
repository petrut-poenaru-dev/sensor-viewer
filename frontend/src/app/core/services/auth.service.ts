import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@env';

export interface User {
  id: string;
  username: string;
  lastLogin?: Date;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'sensorhub_token';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuth();
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, { username, password })
      .pipe(
        tap(response => {
          if (response.success && response.token && response.user) {
            localStorage.setItem(this.TOKEN_KEY, response.token);
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private checkAuth(): void {
    const token = this.getToken();
    if (token) {
      this.http.get<{ success: boolean; user: User }>(`${this.API_URL}/verify`)
        .subscribe({
          next: (response) => {
            if (response.success && response.user) {
              this.currentUserSubject.next(response.user);
            } else {
              this.logout();
            }
          },
          error: () => {
            this.logout();
          }
        });
    }
  }
}
