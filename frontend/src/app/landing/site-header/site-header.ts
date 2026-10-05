import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, Icon],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  protected readonly menuOpen = signal(false);

  protected readonly links = [
    { label: 'Home', fragment: 'top' },
    { label: 'Features', fragment: 'features' },
    { label: 'How It Works', fragment: 'how-it-works' },
    { label: 'Pricing', fragment: 'pricing' },
    { label: 'About', fragment: 'about' },
    { label: 'Contact', fragment: 'contact' },
  ];
}
