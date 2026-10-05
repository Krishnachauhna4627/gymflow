import { Component } from '@angular/core';
import { Icon, IconName } from '../../shared/icon';
import { Reveal } from '../../shared/reveal';

@Component({
  selector: 'app-features',
  imports: [Icon, Reveal],
  templateUrl: './features.html',
  styleUrl: './features.scss',
})
export class Features {
  protected readonly features: { title: string; text: string; icon: IconName }[] = [
    { title: 'Member Management', text: 'Add and manage members easily with complete details.', icon: 'users' },
    { title: 'Custom Membership Plans', text: 'Create 3+1, 4+1, 5+1 or any custom plan with months or days.', icon: 'file' },
    { title: 'Payment Tracking', text: 'Track paid and remaining fees with payment history.', icon: 'card' },
    { title: 'Attendance System', text: 'Mark daily attendance manually or with QR code.', icon: 'calendar' },
    { title: 'Reports & Dashboard', text: 'See members, collections, due fees and more at a glance.', icon: 'chart' },
    { title: 'Simple & Easy to Use', text: 'Clean and simple interface built for gym owners.', icon: 'sliders' },
  ];
}
