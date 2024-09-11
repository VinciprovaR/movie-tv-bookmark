import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { map, Observable, skipWhile, takeUntil } from 'rxjs';
import { NavigationStart, RouterModule } from '@angular/router';
import { SupabaseAuthEventsService } from '../../../shared/services/supabase-auth-events.service';
import { CommonModule } from '@angular/common';
import { AuthActions, AuthSelectors } from '../../../shared/store/auth';
import { AbstractAuthComponent } from '../../../shared/components/abstract/abstract-auth.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  PasswordGroup,
  PasswordChangeForm,
} from '../../../shared/interfaces/supabase/supabase-auth.interface';
import { UnauthorizedComponent } from '../../../shared/components/unauthorized-page/unauthorized.component';
import { SuccessMessageTemplateComponent } from '../../../shared/components/success-message-template/success-message-template.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatDivider,
    MatIconModule,
    UnauthorizedComponent,
    SuccessMessageTemplateComponent,
  ],
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent
  extends AbstractAuthComponent
  implements OnInit, OnDestroy
{
  private readonly supabaseAuthEventsService = inject(
    SupabaseAuthEventsService
  );

  isUserAuthenticated$!: Observable<boolean>;
  isAuthorized$!: Observable<boolean>;
  passwordResetForm!: FormGroup<PasswordChangeForm>;
  selectIsLoading$!: Observable<boolean>;

  selectMessageSuccessOperation$!: Observable<string>;

  submitted = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    this.initSelectors();
    this.initSubscriptions();
  }

  override buildForm(): void {
    this.passwordResetForm = new FormGroup<PasswordChangeForm>({
      passwordGroup: new FormGroup<PasswordGroup>(
        {
          password: new FormControl<string>('', {
            validators: [
              Validators.required,
              this.pswLength.bind(this),
              Validators.pattern(/(?=.*\d)(?=.*[A-Za-z])^[^ ]+$/),
            ],
            nonNullable: true,
          }),
          confirmPassword: new FormControl<string>('', {
            validators: [Validators.required],
            nonNullable: true,
          }),
        },
        { validators: [this.diffPsw.bind(this)] }
      ),
    });
  }

  initSelectors(): void {
    this.selectMessageSuccessOperation$ = this.store.select(
      AuthSelectors.selectMessageSuccessOperation
    );

    this.isUserAuthenticated$ = this.store
      .select(AuthSelectors.selectUser)
      .pipe(map((user) => !!user));

    this.isAuthorized$ = this.supabaseAuthEventsService.combined$.pipe(
      skipWhile((combined) => combined.isLoading),
      map((combined) => {
        if (!combined.isPasswordRecovery) {
          return false;
        }
        return true;
      })
    );

    this.selectIsLoading$ = this.store.select(AuthSelectors.selectIsLoading);
  }

  initSubscriptions(): void {
    this.passwordResetForm.statusChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((status) => {
        this.isFormValid = status === 'INVALID' ? false : true;
      });
  }

  get isPasswordError() {
    return (
      this.submitted &&
      (this.passwordGroup.controls.password.hasError('required') ||
        this.passwordGroup.controls.password.hasError('pattern') ||
        this.passwordGroup.controls.password.hasError('pswLength'))
    );
  }

  get isConfirmPasswordError() {
    return (
      this.submitted &&
      (this.passwordGroup.controls.confirmPassword.hasError('required') ||
        this.passwordGroup.hasError('diffPsw'))
    );
  }

  pswLength(control: AbstractControl): ValidationErrors | null {
    return control.value.length > 0 &&
      (control.value.length < 6 || control.value.length > 24)
      ? { pswLength: true }
      : null;
  }

  diffPsw(group: AbstractControl<PasswordGroup>): ValidationErrors | null {
    return group.value.password !== group.value.confirmPassword
      ? { diffPsw: true }
      : null;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.passwordResetForm.valid) {
      this.isFormValid = true;

      this.store.dispatch(
        AuthActions.updatePassword({
          password: this.passwordResetForm.value.passwordGroup
            ?.password as string,
        })
      );
    } else {
      this.errorContainerTransition();

      this.isFormValid = false;
    }
  }

  get passwordGroup(): FormGroup<PasswordGroup> {
    return this.passwordResetForm.controls[
      'passwordGroup'
    ] as FormGroup<PasswordGroup>;
  }

  ngOnDestroy(): void {
    this.supabaseAuthEventsService.passwordRecoveryFlowEnd();
    this.store.dispatch(AuthActions.cleanMessageSuccessOperation());
  }
}
