import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { LandingPage } from './landing/landing-page';

describe('App', () => {
  it('should create the app', async () => {
    await TestBed.configureTestingModule({ imports: [App], providers: [provideRouter([])] }).compileComponents();
    expect(TestBed.createComponent(App).componentInstance).toBeTruthy();
  });

  it('should render the landing headline', async () => {
    await TestBed.configureTestingModule({ imports: [LandingPage], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(LandingPage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Manage Your Gym');
  });
});
