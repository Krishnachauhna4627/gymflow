import { Component, input } from '@angular/core';

export type IconName =
  | 'dumbbell'
  | 'arrow-right'
  | 'play'
  | 'check'
  | 'users'
  | 'user-check'
  | 'file'
  | 'card'
  | 'calendar'
  | 'chart'
  | 'sliders'
  | 'grid'
  | 'bell'
  | 'search'
  | 'rupee'
  | 'menu'
  | 'close'
  | 'facebook'
  | 'instagram'
  | 'youtube';

/** Stroke-based line icons drawn inline so they inherit `currentColor`. */
@Component({
  selector: 'app-icon',
  host: { class: 'icon', 'aria-hidden': 'true' },
  styles: `
    :host {
      display: inline-flex;
      width: var(--icon-size, 20px);
      height: var(--icon-size, 20px);
      flex-shrink: 0;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      @switch (name()) {
        @case ('dumbbell') {
          <path d="M6.5 6.5v11M3.5 9v6M17.5 6.5v11M20.5 9v6M6.5 12h11" />
        }
        @case ('arrow-right') {
          <path d="M5 12h14M13 6l6 6-6 6" />
        }
        @case ('play') {
          <circle cx="12" cy="12" r="10" />
          <path d="M10 8.5l5.5 3.5-5.5 3.5z" fill="currentColor" />
        }
        @case ('check') {
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12.5l2.5 2.5L16 9.5" />
        }
        @case ('users') {
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
          <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2.1.7 3.5 2.8 3.5 5.7" />
        }
        @case ('user-check') {
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 11l2 2 4-4" />
        }
        @case ('file') {
          <path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z" />
          <path d="M14 3v5h5M8.5 13h7M8.5 16.5h7" />
        }
        @case ('card') {
          <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
          <path d="M2.5 10h19M6 15h4" />
        }
        @case ('calendar') {
          <rect x="3" y="4.5" width="18" height="16.5" rx="1.5" />
          <path d="M3 9.5h18M8 2.5v4M16 2.5v4M7.5 13.5h2M11 13.5h2M14.5 13.5h2M7.5 17h2M11 17h2" />
        }
        @case ('chart') {
          <path d="M4 20h16M7 16v-5M12 16V6M17 16V9" />
        }
        @case ('sliders') {
          <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h10M18 18h2" />
          <circle cx="16" cy="6" r="2" />
          <circle cx="10" cy="12" r="2" />
          <circle cx="16" cy="18" r="2" />
        }
        @case ('grid') {
          <rect x="3" y="3" width="7.5" height="7.5" rx="1" />
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="1" />
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="1" />
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1" />
        }
        @case ('bell') {
          <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z" />
          <path d="M10 20.5a2 2 0 0 0 4 0" />
        }
        @case ('search') {
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        }
        @case ('rupee') {
          <path d="M7 4h10M7 8.5h10M7 4h3.5a4.5 4.5 0 0 1 0 9H7l7 7" />
        }
        @case ('menu') {
          <path d="M4 7h16M4 12h16M4 17h16" />
        }
        @case ('close') {
          <path d="M6 6l12 12M18 6L6 18" />
        }
        @case ('facebook') {
          <path d="M14 8h2.5V4.5H14A3.5 3.5 0 0 0 10.5 8v2.5H8V14h2.5v6.5H14V14h2.5l.5-3.5h-3V8.5a.5.5 0 0 1 .5-.5z" />
        }
        @case ('instagram') {
          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17" cy="7" r="0.6" fill="currentColor" />
        }
        @case ('youtube') {
          <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
          <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
        }
      }
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly strokeWidth = input(1.6);
}
