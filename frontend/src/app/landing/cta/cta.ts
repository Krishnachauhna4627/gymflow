import { Component } from '@angular/core';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal';

@Component({
  selector: 'app-cta',
  imports: [Icon, Reveal],
  templateUrl: './cta.html',
  styleUrl: './cta.scss',
})
export class Cta {}
