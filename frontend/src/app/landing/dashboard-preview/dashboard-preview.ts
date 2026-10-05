import { Component } from '@angular/core';
import { Icon, IconName } from '../../shared/icon';

/** Static, decorative replica of the GymFlow admin dashboard shown in the hero. */
@Component({
  selector: 'app-dashboard-preview',
  imports: [Icon],
  host: { 'aria-hidden': 'true' },
  templateUrl: './dashboard-preview.html',
  styleUrl: './dashboard-preview.scss',
})
export class DashboardPreview {
  protected readonly menu: { label: string; icon: IconName }[] = [
    { label: 'Dashboard', icon: 'grid' },
    { label: 'Members', icon: 'users' },
    { label: 'Membership Plans', icon: 'file' },
    { label: 'Payments', icon: 'card' },
    { label: 'Attendance', icon: 'calendar' },
    { label: 'Reports', icon: 'chart' },
    { label: 'Settings', icon: 'sliders' },
  ];

  protected readonly stats: { label: string; value: string; icon: IconName; tone: string }[] = [
    { label: 'Total Members', value: '350', icon: 'users', tone: 'navy' },
    { label: 'Today Present', value: '87', icon: 'user-check', tone: 'forest' },
    { label: 'Fee Due', value: '₹18,500', icon: 'rupee', tone: 'burgundy' },
    { label: 'Expiring Soon', value: '12', icon: 'calendar', tone: 'brass' },
  ];

  protected readonly pendingFees = [
    { member: 'Rahul', plan: '3 + 1', total: '₹3,000', paid: '₹2,000', due: '₹1,000' },
    { member: 'Aman', plan: '5 + 1', total: '₹5,000', paid: '₹3,000', due: '₹2,000' },
    { member: 'Vijay', plan: '4 + 1', total: '₹4,000', paid: '₹2,500', due: '₹1,500' },
    { member: 'Rohit', plan: '6 + 2', total: '₹6,000', paid: '₹5,000', due: '₹1,000' },
  ];

  protected readonly checkIns = [
    { name: 'Rahul', time: '06:42 AM' },
    { name: 'Aman', time: '07:10 AM' },
    { name: 'Raj', time: '07:18 AM' },
    { name: 'Suresh', time: '07:45 AM' },
  ];

  protected readonly present = 87;
  protected readonly absent = 263;
  /** Circumference of the attendance ring (r = 15.9 → ~100). */
  protected readonly ringOffset = 100 - (this.present / (this.present + this.absent)) * 100;
}
