import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginDialog } from './auth/login-dialog/login-dialog';
import { RegisterGymDialog } from './gym-registration/register-gym-dialog';

@Component({
  imports: [RouterOutlet, LoginDialog, RegisterGymDialog],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {}
