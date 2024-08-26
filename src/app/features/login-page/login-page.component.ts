import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthActions, AuthSelectors } from '../../shared/store/auth';

import { Observable } from 'rxjs';
import {
  LoginForm,
  LoginPayload,
} from '../../shared/interfaces/supabase/supabase-auth.interface';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';
import { ChangeDetectionStrategy } from '@angular/core';

import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatInputModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent extends AbstractComponent {
  loginForm!: FormGroup<LoginForm>;

  selectIsLoading$: Observable<boolean> = this.store.select(
    AuthSelectors.selectIsLoading
  );

  constructor() {
    super();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  ngOnInit(): void {
    this.loginForm = new FormGroup<LoginForm>({
      email: new FormControl<string>('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }), //
      // stayConnected: new FormControl<boolean>(false),
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.store.dispatch(
        AuthActions.login(this.loginForm.value as LoginPayload)
      );
    }
  }
}
