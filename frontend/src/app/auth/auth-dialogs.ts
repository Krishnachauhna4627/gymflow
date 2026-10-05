import { Injectable, signal } from '@angular/core';

export type AuthDialog = 'login' | 'register';

/** Controls which auth popup (if any) is open, from anywhere in the app. */
@Injectable({ providedIn: 'root' })
export class AuthDialogs {
  readonly active = signal<AuthDialog | null>(null);
  /** User ID to pre-fill in the login popup (e.g. right after registering). */
  readonly loginPrefill = signal('');

  openLogin(userId = ''): void {
    this.loginPrefill.set(userId);
    this.active.set('login');
  }

  openRegister(): void {
    this.active.set('register');
  }

  /** Closes `dialog` only if it is still the active one, so switching popups doesn't close the new one. */
  close(dialog: AuthDialog): void {
    if (this.active() === dialog) {
      this.active.set(null);
    }
  }
}
