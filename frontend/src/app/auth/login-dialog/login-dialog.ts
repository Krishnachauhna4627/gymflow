import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Icon } from '../../shared/icon';
import { AuthDialogs } from '../auth-dialogs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-dialog',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './login-dialog.html',
  styleUrl: './login-dialog.scss',
})
export class LoginDialog {
  private readonly dialogs = inject(AuthDialogs);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly userIdInput = viewChild.required<ElementRef<HTMLInputElement>>('userIdInput');
  private readonly passwordInput = viewChild.required<ElementRef<HTMLInputElement>>('passwordInput');

  protected readonly form = new FormGroup({
    userId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    remember: new FormControl(true, { nonNullable: true }),
  });

  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly formError = signal<string | null>(null);

  private pointerDownTarget: EventTarget | null = null;

  constructor() {
    effect(() => {
      const el = this.dialog().nativeElement;
      const open = this.dialogs.active() === 'login';
      if (open && !el.open) {
        const prefill = this.dialogs.loginPrefill();
        if (prefill) this.form.controls.userId.setValue(prefill);
        el.showModal();
        queueMicrotask(() => (prefill ? this.passwordInput() : this.userIdInput()).nativeElement.focus());
      } else if (!open && el.open) {
        el.close();
      }
    });
  }

  protected showError(name: 'userId' | 'password'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);
    this.formError.set(null);
    if (this.form.invalid || this.submitting()) {
      this.dialog().nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    const { userId, password, remember } = this.form.getRawValue();
    this.submitting.set(true);
    this.auth.login(userId.trim(), password, remember).subscribe({
      next: () => {
        this.submitting.set(false);
        this.dialogs.close('login');
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        // Clear the password for the retry; the alert explains why, so no field error is needed.
        this.form.controls.password.reset();
        this.submitted.set(false);
        this.formError.set(
          err.status === 0
            ? "We couldn't reach the server. Please check your connection and try again."
            : (err.error?.message ?? 'Something went wrong. Please try again.'),
        );
        queueMicrotask(() => this.passwordInput().nativeElement.focus());
      },
    });
  }

  protected switchToRegister(): void {
    this.dialogs.openRegister();
  }

  protected requestClose(): void {
    this.dialogs.close('login');
  }

  /** Native close (Esc, or switching popups): sync state and clear the form. */
  protected onClosed(): void {
    this.dialogs.close('login');
    this.form.reset();
    this.submitted.set(false);
    this.showPassword.set(false);
    this.formError.set(null);
  }

  protected onPointerDown(event: PointerEvent): void {
    this.pointerDownTarget = event.target;
  }

  protected onDialogClick(event: MouseEvent): void {
    const el = this.dialog().nativeElement;
    if (event.target === el && this.pointerDownTarget === el && !this.submitting()) {
      this.requestClose();
    }
  }
}
