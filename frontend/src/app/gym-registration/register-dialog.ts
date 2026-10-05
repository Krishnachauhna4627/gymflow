import { Injectable, signal } from '@angular/core';

/** Opens and closes the "Create Your Gym" dialog from anywhere on the page. */
@Injectable({ providedIn: 'root' })
export class RegisterDialog {
  readonly isOpen = signal(false);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
