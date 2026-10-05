import { Component } from '@angular/core';
import { SiteHeader } from './site-header/site-header';
import { Hero } from './hero/hero';
import { Features } from './features/features';
import { Plans } from './plans/plans';
import { Cta } from './cta/cta';
import { SiteFooter } from './site-footer/site-footer';

@Component({
  selector: 'app-landing-page',
  imports: [SiteHeader, Hero, Features, Plans, Cta, SiteFooter],
  template: `
    <app-site-header />
    <main>
      <app-hero />
      <app-features />
      <app-plans />
      <app-cta />
    </main>
    <app-site-footer />
  `,
})
export class LandingPage {}
