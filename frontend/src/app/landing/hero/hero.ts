import { Component } from '@angular/core';
import { Icon } from '../../shared/icon';
import { DashboardPreview } from '../dashboard-preview/dashboard-preview';

@Component({
  selector: 'app-hero',
  imports: [Icon, DashboardPreview],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly highlights = ['Easy to use', 'No credit card required', 'Built for gym owners'];
}
