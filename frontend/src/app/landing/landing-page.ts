import { Component } from '@angular/core';
import { SiteHeader } from './site-header/site-header';
import { Hero } from './hero/hero';
import { Features } from './features/features';
import { Plans } from './plans/plans';
import { Cta } from './cta/cta';
import { SiteFooter } from './site-footer/site-footer';
import { RegisterGymDialog } from '../gym-registration/register-gym-dialog';

@Component({
  selector: 'app-landing-page',
  imports: [SiteHeader, Hero, Features, Plans, Cta, SiteFooter, RegisterGymDialog],
  template: `
    <app-site-header />
    <main>
      <app-hero />
      <app-features />
      <app-plans />
      <app-cta />
    </main>
    <app-site-footer />
    <app-register-gym-dialog />
  `,
})
export class LandingPage {}
