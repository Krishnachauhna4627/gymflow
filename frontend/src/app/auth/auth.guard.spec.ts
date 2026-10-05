import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CanMatchFn, UrlTree, provideRouter } from '@angular/router';
import { AuthDialogs } from './auth-dialogs';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  const run = () =>
    TestBed.runInInjectionContext(() => authGuard(...([{}, [], {}] as unknown as Parameters<CanMatchFn>)));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('redirects guests to the landing page and opens the login popup', () => {
    const result = run();

    expect(result).toBeInstanceOf(UrlTree);
    expect(String(result)).toBe('/');
    expect(TestBed.inject(AuthDialogs).active()).toBe('login');
  });

  it('lets signed-in owners through', () => {
    TestBed.inject(AuthService).session.set({
      user: { id: 1, name: 'Ravi', email: 'r@example.com', userId: 'ravi', role: 'owner' },
      gym: { id: 1, name: 'Iron Gym', logoUrl: null },
    });

    expect(run()).toBe(true);
  });
});
