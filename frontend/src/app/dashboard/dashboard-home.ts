import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Icon, IconName } from '../shared/icon';

@Component({
  selector: 'app-dashboard-home',
  imports: [Icon, DatePipe],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHome {
  protected readonly session = inject(AuthService).session;
  protected readonly firstName = computed(() => this.session()?.user.name.split(/\s+/)[0] ?? '');
  protected readonly today = new Date();

  // Live numbers arrive with the Members / Payments / Attendance modules.
  protected readonly stats: { label: string; value: string; icon: IconName; tone: string }[] = [
    { label: 'Total Members', value: '0', icon: 'users', tone: 'navy' },
    { label: 'Today Present', value: '0', icon: 'user-check', tone: 'forest' },
    { label: 'Fee Due', value: '₹0', icon: 'rupee', tone: 'burgundy' },
    { label: 'Expiring Soon', value: '0', icon: 'calendar', tone: 'brass' },
  ];

  protected readonly steps = [
    { title: 'Create your gym', text: 'Your gym and owner account are ready.', done: true },
    { title: 'Add membership plans', text: 'Set up 3+1, 4+1, 5+1 or custom plans.', done: false },
    { title: 'Add your members', text: 'Enter member details and assign a plan.', done: false },
    { title: 'Track fees & attendance', text: 'Collect payments and mark daily check-ins.', done: false },
  ];
}
