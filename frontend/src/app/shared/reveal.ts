import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

/**
 * Fades an element up into place the first time it scrolls into view.
 * Styling lives in the global `.reveal` / `.is-visible` classes (styles.scss).
 */
@Directive({
  selector: '[appReveal]',
  host: {
    class: 'reveal',
    '[style.--reveal-delay]': 'delay() + "ms"',
  },
})
export class Reveal implements OnInit, OnDestroy {
  /** Stagger delay in milliseconds. */
  readonly delay = input(0, { alias: 'appReveal', transform: (v: number | string) => Number(v) || 0 });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.el.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.el.classList.add('is-visible');
          this.observer?.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    this.observer.observe(this.el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
