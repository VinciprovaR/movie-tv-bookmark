import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AuthActions, AuthSelectors } from '../../shared/store/auth';
import { Observable, takeUntil } from 'rxjs';
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

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { AbstractAuthComponent } from '../../shared/components/abstract/abstract-auth.component';
import { SuccessMessageTemplateComponent } from '../../shared/components/success-message-template/success-message-template.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatIconModule,
    MatDivider,
    SuccessMessageTemplateComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent
  extends AbstractAuthComponent
  implements OnDestroy
{
  selectIsLoading$!: Observable<boolean>;
  selectMessageSuccessOperation$!: Observable<string>;
  @Input('email') email?: string = '';
  confirmationEmailMessage: string = '';
  requestResetPasswordMessage: string = '';
  accountDeletedMessage: string = '';
  loginForm!: FormGroup<LoginForm>;
  submitted = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    this.initSelectors();
    this.initSubscriptions();
  }

  override buildForm() {
    this.loginForm = new FormGroup<LoginForm>({
      email: new FormControl<string>('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  initSelectors(): void {
    this.selectIsLoading$ = this.store.select(AuthSelectors.selectIsLoading);

    this.selectMessageSuccessOperation$ = this.store.select(
      AuthSelectors.selectMessageSuccessOperation
    );
  }

  initSubscriptions(): void {
    this.loginForm.statusChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((status: string) => {
        this.isFormValid = status === 'INVALID';
      });
  }

  get isEmailError() {
    return (
      this.submitted &&
      (this.loginForm.get('email')?.hasError('email') ||
        this.loginForm.get('email')?.hasError('required'))
    );
  }

  get isPasswordError() {
    return (
      this.submitted && this.loginForm.get('password')?.hasError('required')
    );
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.valid) {
      this.isFormValid = true;
      this.store.dispatch(
        AuthActions.login(this.loginForm.value as LoginPayload)
      );
    } else {
      this.errorContainerTransition();
      this.isFormValid = false;
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(AuthActions.cleanMessageSuccessOperation());
  }
}
