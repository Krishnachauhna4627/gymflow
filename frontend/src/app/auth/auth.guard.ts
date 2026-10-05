import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthDialogs } from './auth-dialogs';
import { AuthService } from './auth.service';

/** Lets signed-in owners through; everyone else goes to the landing page with the login popup open. */
export const authGuard: CanMatchFn = () => {
  if (inject(AuthService).isLoggedIn()) {
    return true;
  }
  inject(AuthDialogs).openLogin();
  return inject(Router).parseUrl('/');
};
