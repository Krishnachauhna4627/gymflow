import { Component, inject } from '@angular/core';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal';
import { AuthDialogs } from '../../auth/auth-dialogs';

@Component({
  selector: 'app-cta',
  imports: [Icon, Reveal],
  templateUrl: './cta.html',
  styleUrl: './cta.scss',
})
export class Cta {
  protected readonly dialogs = inject(AuthDialogs);
}
