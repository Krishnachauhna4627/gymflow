import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, firstValueFrom, of, tap } from 'rxjs';

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  userId: string;
  role: string;
}

export interface SessionGym {
  id: number;
  name: string;
  logoUrl: string | null;
}

export interface Session {
  user: SessionUser;
  gym: SessionGym;
}

/**
 * The signed-in owner and their gym. The session itself lives in an httpOnly cookie
 * set by the API, so nothing secret is kept in JavaScript or browser storage.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly session = signal<Session | null>(null);
  readonly isLoggedIn = computed(() => this.session() !== null);

  /** Restores the session on app start. Never throws: no session (or no API) means logged out. */
  loadSession(): Promise<void> {
    return firstValueFrom(
      this.http.get<Session>('/api/auth/me').pipe(
        tap((session) => this.session.set(session)),
        catchError(() => {
          this.session.set(null);
          return of(null);
        }),
      ),
    ).then(() => undefined);
  }

  login(userId: string, password: string, remember: boolean): Observable<Session> {
    return this.http
      .post<Session>('/api/auth/login', { userId, password, remember })
      .pipe(tap((session) => this.session.set(session)));
  }

  logout(): Observable<unknown> {
    return this.http.post('/api/auth/logout', {}).pipe(
      catchError(() => of(null)),
      tap(() => this.session.set(null)),
    );
  }
}
