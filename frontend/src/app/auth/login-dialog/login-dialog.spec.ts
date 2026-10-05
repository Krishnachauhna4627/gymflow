import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AuthDialogs } from '../auth-dialogs';
import { AuthService } from '../auth.service';
import { LoginDialog } from './login-dialog';

describe('LoginDialog', () => {
  let fixture: ComponentFixture<LoginDialog>;
  let http: HttpTestingController;
  let el: HTMLElement;
  let dialogs: AuthDialogs;

  const session = {
    user: { id: 1, name: 'Ravi Kumar', email: 'ravi@example.com', userId: 'irongym', role: 'owner' },
    gym: { id: 1, name: 'Iron Gym', logoUrl: '/api/gyms/1/logo' },
  };

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

  beforeEach(async () => {
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    };

    await TestBed.configureTestingModule({
      imports: [LoginDialog],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginDialog);
    http = TestBed.inject(HttpTestingController);
    dialogs = TestBed.inject(AuthDialogs);
    el = fixture.nativeElement;
  });

  afterEach(() => http.verify());

  it('requires both fields', async () => {
    dialogs.openLogin();
    await fixture.whenStable();
    await submit();

    expect(el.querySelectorAll('.field__error')).toHaveLength(2);
    http.expectNone('/api/auth/login');
  });

  it('logs in, stores the session and goes to the dashboard', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    dialogs.openLogin();
    await fixture.whenStable();

    fill({ 'login-userId': ' irongym ', 'login-password': 'secret123' });
    await submit();

    const req = http.expectOne('/api/auth/login');
    expect(req.request.body).toEqual({ userId: 'irongym', password: 'secret123', remember: true });
    req.flush(session);
    await fixture.whenStable();

    expect(TestBed.inject(AuthService).session()).toEqual(session);
    expect(dialogs.active()).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('shows the server message and clears the password on failure', async () => {
    dialogs.openLogin('irongym');
    await fixture.whenStable();
    expect(el.querySelector<HTMLInputElement>('#login-userId')!.value).toBe('irongym');

    fill({ 'login-password': 'wrong-pass1' });
    await submit();
    http
      .expectOne('/api/auth/login')
      .flush({ message: 'Incorrect user ID or password.' }, { status: 401, statusText: 'Unauthorized' });
    await fixture.whenStable();

    expect(el.querySelector('.form__alert')!.textContent).toContain('Incorrect user ID or password.');
    expect(el.querySelector<HTMLInputElement>('#login-password')!.value).toBe('');
    expect(TestBed.inject(AuthService).session()).toBeNull();
  });

  it('switches to the register popup', async () => {
    dialogs.openLogin();
    await fixture.whenStable();
    el.querySelector<HTMLButtonElement>('.switch .link')!.click();

    expect(dialogs.active()).toBe('register');
  });
});
