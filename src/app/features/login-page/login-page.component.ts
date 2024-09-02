import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
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
import { NavigationStart, RouterModule } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
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
  selectIsRequestResetPassword$!: Observable<boolean>;
  selectIsResendConfirmationRegister$!: Observable<boolean>;
  selectIsAccountDeleted$!: Observable<boolean>;
  registerFlowEnd$!: Observable<boolean>;

  confirmationEmailMessage: string = '';
  requestResetPasswordMessage: string = '';
  accountDeletedMessage: string = '';
  @Input('email') email?: string = '';

  loginForm!: FormGroup<LoginForm>;
  submitted = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.confirmationEmailMessage = `We've sent you an email to ${this.email} with
              instructions to confirm your account, if not confirmed yet and if
              created. Please check your inbox, and don't forget to check your
              spam or junk folder if you don't see the email within a few
              minutes!`;

    this.requestResetPasswordMessage = `We've sent you an email to ${this.email} with
              instructions to reset your password, if the account exist. Please
              check your inbox, and don't forget to check your spam or junk
              folder if you don't see the email within a few minutes!`;

    this.accountDeletedMessage = `Account with email ${this.email} deleted successfully!`;

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

  override initSelectors(): void {
    this.selectIsLoading$ = this.store.select(AuthSelectors.selectIsLoading);

    this.selectIsRequestResetPassword$ = this.store.select(
      AuthSelectors.selectIsRequestResetPassword
    );

    this.selectIsResendConfirmationRegister$ = this.store.select(
      AuthSelectors.selectIsResendConfirmationRegister
    );

    this.selectIsAccountDeleted$ = this.store.select(
      AuthSelectors.selectIsAccountDeleted
    );

    this.registerFlowEnd$ = this.store.select(
      AuthSelectors.selectRegisterFlowEnd
    );
  }

  override initSubscriptions(): void {
    this.loginForm.statusChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((status) => {
        this.isFormValid = status === 'INVALID' ? false : true;
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
  //to-do non va bene, dispatca le action quando loggi anche e quindi strani effetti
  ngOnDestroy(): void {
    // this.store.dispatch(AuthActions.cleanRequestResetPassword());
    // this.store.dispatch(AuthActions.cleanRegisterFlow());
    // this.store.dispatch(AuthActions.cleanResendConfirmationRegisterFlow());
    // this.store.dispatch(AuthActions.cleanAccountDeletedFlow());
  }
}
