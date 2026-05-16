import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RegisterPayload {
  username: string;
  password: string;
  password2: string;
  bio?: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ACCESS_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register/`, payload);
  }

  login(username: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${environment.apiUrl}/auth/token/`,
      { username, password }
    ).pipe(
      tap(tokens => this.saveTokens(tokens))
    );
  }

  refresh(): Observable<TokenResponse> {
    const refresh = this.getRefreshToken();
    return this.http.post<TokenResponse>(
      `${environment.apiUrl}/auth/token/refresh/`,
      { refresh }
    ).pipe(
      tap(tokens => this.saveTokens(tokens))
    );
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  private saveTokens(tokens: TokenResponse): void {
    localStorage.setItem(this.ACCESS_KEY, tokens.access);
    localStorage.setItem(this.REFRESH_KEY, tokens.refresh);
    this.isAuthenticatedSubject.next(true);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.ACCESS_KEY);
  }
}