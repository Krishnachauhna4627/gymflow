import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterDialog } from './register-dialog';
import { RegisterGymDialog } from './register-gym-dialog';

describe('RegisterGymDialog', () => {
  let fixture: ComponentFixture<RegisterGymDialog>;
  let http: HttpTestingController;
  let el: HTMLElement;

  const fill = (values: Record<string, string>) => {
    for (const [id, value] of Object.entries(values)) {
      const input = el.querySelector<HTMLInputElement>(`#${id}`)!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
  };
  const submit = async () => {
    el.querySelector<HTMLButtonElement>('button[type=submit]')!.click();
    await fixture.whenStable();
  };
  const errors = () => [...el.querySelectorAll('.field__error')].map((e) => e.textContent!.trim());

  const valid = {
    gymName: 'Iron Gym',
    ownerName: 'Ravi Kumar',
    mobile: '98765 43210',
    email: 'ravi@example.com',
    userId: 'irongym',
    password: 'secret123',
  };

  beforeEach(async () => {
    // jsdom has no <dialog> modal support
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    };

    await TestBed.configureTestingModule({
      imports: [RegisterGymDialog],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterGymDialog);
    http = TestBed.inject(HttpTestingController);
    el = fixture.nativeElement;
    TestBed.inject(RegisterDialog).open();
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('shows required errors and sends nothing when submitted empty', async () => {
    await submit();

    expect(errors()).toHaveLength(6);
    http.expectNone('/api/gyms');
  });

  it('rejects an invalid mobile number and a weak password', async () => {
    fill({ ...valid, mobile: '12345', password: 'abcdefgh' });
    await submit();

    expect(errors()).toEqual(['Enter a valid 10-digit mobile number.', 'Include at least one letter and one number.']);
  });

  it('registers the gym and shows the success state', async () => {
    fill(valid);
    await submit();

    const req = http.expectOne('/api/gyms');
    const body = req.request.body as FormData;
    expect(req.request.method).toBe('POST');
    expect(Object.fromEntries(body.entries())).toEqual(valid);
    expect(body.has('logo')).toBe(false);
    req.flush({ gym: { id: 1, name: 'Iron Gym', logoUrl: null }, owner: { id: 1, name: 'Ravi Kumar', email: valid.email, userId: 'irongym' } });
    await fixture.whenStable();

    expect(el.querySelector('h2')!.textContent).toContain('Your Gym Is Ready');
    expect(el.querySelector('.success p')!.textContent).toContain('irongym');
  });

  describe('logo', () => {
    const pick = async (file: File) => {
      const input = el.querySelector<HTMLInputElement>('#logo')!;
      Object.defineProperty(input, 'files', { value: [file], configurable: true });
      input.dispatchEvent(new Event('change'));
      await fixture.whenStable();
    };

    beforeEach(() => {
      URL.createObjectURL ??= () => 'blob:preview';
      URL.revokeObjectURL ??= () => {};
    });

    it('previews the picked logo and uploads it with the form', async () => {
      const logo = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], 'logo.png', { type: 'image/png' });
      await pick(logo);

      expect(el.querySelector('.logo-tile img')).toBeTruthy();
      expect(el.querySelector('.logo-actions .btn')!.textContent).toContain('Change Logo');

      fill(valid);
      await submit();
      const body = http.expectOne('/api/gyms').request.body as FormData;
      expect(body.get('logo')).toBe(logo);
    });

    it('refuses non-image and oversized files before uploading', async () => {
      await pick(new File(['<svg/>'], 'logo.svg', { type: 'image/svg+xml' }));
      expect(errors()).toEqual(['Logo must be a PNG, JPG or WebP image.']);

      await pick(new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'big.png', { type: 'image/png' }));
      expect(errors()).toEqual(['Logo must be 2 MB or smaller.']);

      fill(valid);
      await submit();
      http.expectNone('/api/gyms');
    });

    it('can remove the logo again', async () => {
      await pick(new File([new Uint8Array([1])], 'logo.png', { type: 'image/png' }));
      el.querySelector<HTMLButtonElement>('.logo-actions .link')!.click();
      await fixture.whenStable();

      expect(el.querySelector('.logo-tile img')).toBeNull();
    });
  });

  it('shows server field errors next to the right fields', async () => {
    fill(valid);
    await submit();

    http
      .expectOne('/api/gyms')
      .flush({ message: 'Some details are already in use.', errors: { userId: 'This user ID is already taken.' } }, { status: 409, statusText: 'Conflict' });
    await fixture.whenStable();

    expect(errors()).toEqual(['This user ID is already taken.']);
  });
});
