import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon';
import { AuthDialogs } from '../../auth/auth-dialogs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, Icon],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  private readonly dialogs = inject(AuthDialogs);
  protected readonly auth = inject(AuthService);

  protected readonly menuOpen = signal(false);

  protected readonly links = [
    { label: 'Home', fragment: 'top' },
    { label: 'Features', fragment: 'features' },
    { label: 'How It Works', fragment: 'how-it-works' },
    { label: 'Pricing', fragment: 'pricing' },
    { label: 'About', fragment: 'about' },
    { label: 'Contact', fragment: 'contact' },
  ];

  protected openRegister(): void {
    this.menuOpen.set(false);
    this.dialogs.openRegister();
  }

  protected openLogin(): void {
    this.menuOpen.set(false);
    this.dialogs.openLogin();
  }
}
