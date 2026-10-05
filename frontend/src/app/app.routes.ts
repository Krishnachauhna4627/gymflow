import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./landing/landing-page').then((m) => m.LandingPage) },
  {
    path: 'dashboard',
    canMatch: [authGuard],
    loadComponent: () => import('./dashboard/dashboard-layout').then((m) => m.DashboardLayout),
    children: [
      { path: '', loadComponent: () => import('./dashboard/dashboard-home').then((m) => m.DashboardHome) },
    ],
  },
  { path: '**', redirectTo: '' },
];
