import { Component, inject } from '@angular/core';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal';
import { RegisterDialog } from '../../gym-registration/register-dialog';

@Component({
  selector: 'app-cta',
  imports: [Icon, Reveal],
  templateUrl: './cta.html',
  styleUrl: './cta.scss',
})
export class Cta {
  protected readonly registerDialog = inject(RegisterDialog);
}
