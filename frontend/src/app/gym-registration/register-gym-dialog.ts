import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Icon } from '../shared/icon';
import { ApiFieldErrors, GymApi, GymRegistration, GymRegistrationResult } from './gym-api';
import { RegisterDialog } from './register-dialog';

type FieldName = keyof GymRegistration;

/** Indian mobile number; tolerates spaces, dashes and a leading +91. */
function mobileValidator(control: AbstractControl<string>): ValidationErrors | null {
  const digits = (control.value ?? '').replace(/[\s-]/g, '').replace(/^(\+?91)(?=\d{10}$)/, '');
  return !digits || /^[6-9]\d{9}$/.test(digits) ? null : { mobile: true };
}

export const LOGO_MAX_BYTES = 2 * 1024 * 1024;
const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

const MESSAGES: Record<FieldName, Record<string, string>> = {
  gymName: { required: 'Enter your gym name.', minlength: 'Gym name is too short.', maxlength: 'Gym name is too long.' },
  ownerName: { required: "Enter the owner's name.", minlength: 'Name is too short.', maxlength: 'Name is too long.' },
  mobile: { required: 'Enter a mobile number.', mobile: 'Enter a valid 10-digit mobile number.' },
  email: { required: 'Enter an email address.', email: 'Enter a valid email address.' },
  userId: {
    required: 'Choose a user ID.',
    pattern: 'Use 4–30 letters, numbers, dot, dash or underscore.',
  },
  password: {
    required: 'Choose a password.',
    minlength: 'Use at least 8 characters.',
    maxlength: 'Use at most 128 characters.',
    pattern: 'Include at least one letter and one number.',
  },
};

@Component({
  selector: 'app-register-gym-dialog',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './register-gym-dialog.html',
  styleUrl: './register-gym-dialog.scss',
})
export class RegisterGymDialog {
  private readonly registerDialog = inject(RegisterDialog);
  private readonly api = inject(GymApi);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly firstField = viewChild<ElementRef<HTMLInputElement>>('firstField');

  protected readonly form = new FormGroup({
    gymName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)] }),
    ownerName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(80)] }),
    mobile: new FormControl('', { nonNullable: true, validators: [Validators.required, mobileValidator] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    userId: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]{4,30}$/)] }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(128), Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).*$/)],
    }),
  });

  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly created = signal<GymRegistrationResult | null>(null);

  protected readonly logoTypes = LOGO_TYPES.join(',');
  protected readonly logoFile = signal<File | null>(null);
  protected readonly logoPreview = signal<string | null>(null);
  protected readonly logoError = signal<string | null>(null);
  protected readonly logoDragOver = signal(false);

  /** Where a click started, so a drag from inside the dialog onto the backdrop doesn't close it. */
  private pointerDownTarget: EventTarget | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.revokePreview());

    effect(() => {
      const el = this.dialog().nativeElement;
      if (this.registerDialog.isOpen() && !el.open) {
        el.showModal();
        queueMicrotask(() => this.firstField()?.nativeElement.focus());
      } else if (!this.registerDialog.isOpen() && el.open) {
        el.close();
      }
    });
  }

  protected showError(name: FieldName): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted());
  }

  protected errorFor(name: FieldName): string {
    const errors = this.form.controls[name].errors ?? {};
    if (errors['server']) return errors['server'];
    const key = Object.keys(errors)[0];
    return MESSAGES[name][key] ?? 'Please check this field.';
  }

  protected submit(): void {
    this.submitted.set(true);
    this.formError.set(null);
    if (this.form.invalid || this.logoError() || this.submitting()) {
      this.focusFirstInvalid();
      return;
    }

    this.submitting.set(true);
    this.api.register(this.form.getRawValue(), this.logoFile()).subscribe({
      next: (result) => {
        this.submitting.set(false);
        this.created.set(result);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.applyServerErrors(err);
      },
    });
  }

  protected onLogoPicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.setLogo(input.files?.[0] ?? null);
    input.value = ''; // allow picking the same file again after "Remove"
  }

  protected onLogoDragOver(event: DragEvent): void {
    event.preventDefault();
    this.logoDragOver.set(true);
  }

  protected onLogoDrop(event: DragEvent): void {
    event.preventDefault();
    this.logoDragOver.set(false);
    this.setLogo(event.dataTransfer?.files[0] ?? null);
  }

  protected removeLogo(): void {
    this.revokePreview();
    this.logoFile.set(null);
    this.logoPreview.set(null);
    this.logoError.set(null);
  }

  private setLogo(file: File | null): void {
    if (!file) return;
    this.removeLogo();

    if (!LOGO_TYPES.includes(file.type)) {
      this.logoError.set('Logo must be a PNG, JPG or WebP image.');
      return;
    }
    if (file.size > LOGO_MAX_BYTES) {
      this.logoError.set('Logo must be 2 MB or smaller.');
      return;
    }

    this.logoFile.set(file);
    this.logoPreview.set(URL.createObjectURL(file));
  }

  private revokePreview(): void {
    const url = this.logoPreview();
    if (url) URL.revokeObjectURL(url);
  }

  protected requestClose(): void {
    this.registerDialog.close();
  }

  /** Native close (Esc key or dialog.close()) — keep state in sync and reset after a success. */
  protected onClosed(): void {
    this.registerDialog.close();
    if (this.created()) {
      this.reset();
    }
  }

  protected onPointerDown(event: PointerEvent): void {
    this.pointerDownTarget = event.target;
  }

  /** Clicks on the dialog element itself (not its content) are clicks on the backdrop. */
  protected onDialogClick(event: MouseEvent): void {
    const el = this.dialog().nativeElement;
    if (event.target === el && this.pointerDownTarget === el && !this.submitting()) {
      this.requestClose();
    }
  }

  private applyServerErrors(err: HttpErrorResponse): void {
    if (err.status === 0) {
      this.formError.set("We couldn't reach the server. Please check your connection and try again.");
      return;
    }

    const body = err.error as ApiFieldErrors | null;
    const { logo: logoMessage, ...fieldErrors } = body?.errors ?? {};
    if (logoMessage) {
      this.logoError.set(logoMessage);
    }
    for (const [name, message] of Object.entries(fieldErrors)) {
      const control = this.form.controls[name as FieldName];
      control?.setErrors({ server: message });
      control?.markAsTouched();
    }

    if (Object.keys(fieldErrors).length || logoMessage) {
      this.focusFirstInvalid();
    } else {
      this.formError.set(body?.message ?? 'Something went wrong. Please try again.');
    }
  }

  private focusFirstInvalid(): void {
    queueMicrotask(() => this.dialog().nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
  }

  private reset(): void {
    this.form.reset();
    this.submitted.set(false);
    this.showPassword.set(false);
    this.formError.set(null);
    this.created.set(null);
    this.removeLogo();
  }
}
