import { Component } from '@angular/core';
import { Icon, IconName } from '../../shared/icon';

@Component({
  selector: 'app-site-footer',
  imports: [Icon],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  protected readonly year = new Date().getFullYear();
  protected readonly links = ['Privacy Policy', 'Terms of Service', 'Contact'];
  protected readonly socials: { label: string; icon: IconName }[] = [
    { label: 'Facebook', icon: 'facebook' },
    { label: 'Instagram', icon: 'instagram' },
    { label: 'YouTube', icon: 'youtube' },
  ];
}
