import { Component } from '@angular/core';
import { Reveal } from '../../shared/reveal';

@Component({
  selector: 'app-plans',
  imports: [Reveal],
  templateUrl: './plans.html',
  styleUrl: './plans.scss',
})
export class Plans {
  protected readonly plans = [
    { name: '3 + 1', detail: '3 Months + 1 Month', duration: '4 Months', price: '₹3,000' },
    { name: '4 + 1', detail: '4 Months + 1 Month', duration: '5 Months', price: '₹4,000' },
    { name: '5 + 1', detail: '5 Months + 1 Month', duration: '6 Months', price: '₹5,000' },
    { name: '6 + 2', detail: '6 Months + 2 Months', duration: '8 Months', price: '₹6,000' },
    { name: 'Custom Plan', detail: 'Create any plan', duration: 'you want', price: 'Any Price' },
  ];
}
