import { Component, ElementRef, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Icon, IconName } from '../shared/icon';

interface NavItem {
  label: string;
  icon: IconName;
  /** Route for built pages; items without one are shown as "Soon". */
  link?: string;
}

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeMenus()',
  },
})
export class DashboardLayout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly session = this.auth.session;
  protected readonly userMenuOpen = signal(false);
  protected readonly sidebarOpen = signal(false);
  protected readonly loggingOut = signal(false);
  protected readonly logoFailed = signal(false);

  protected readonly initials = computed(() => initialsOf(this.session()?.user.name ?? ''));
  protected readonly gymInitials = computed(() => initialsOf(this.session()?.gym.name ?? ''));

  protected readonly nav: NavItem[] = [
    { label: 'Dashboard', icon: 'grid', link: '/dashboard' },
    { label: 'Members', icon: 'users' },
    { label: 'Membership Plans', icon: 'file' },
    { label: 'Payments', icon: 'card' },
    { label: 'Attendance', icon: 'calendar' },
    { label: 'Reports', icon: 'chart' },
    { label: 'Settings', icon: 'sliders' },
  ];

  protected toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.userMenuOpen.update((open) => !open);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.host.querySelector('.user-menu')?.contains(event.target as Node)) {
      this.userMenuOpen.set(false);
    }
  }

  protected closeMenus(): void {
    this.userMenuOpen.set(false);
    this.sidebarOpen.set(false);
  }

  protected logout(): void {
    this.loggingOut.set(true);
    this.auth.logout().subscribe(() => this.router.navigate(['/']));
  }
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}
