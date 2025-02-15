import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { Observable, takeUntil } from 'rxjs';
import { AuthActions, AuthSelectors } from '../../../../core/store/auth';
import { AbstractAuthComponent } from '../../../../shared/abstract/components/abstract-auth.component';
import {
  PasswordGroup,
  RegisterForm,
} from '../../../../shared/interfaces/supabase/supabase-auth.interface';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent extends AbstractAuthComponent {
  registerForm!: FormGroup<RegisterForm>;

  selectIsLoading$: Observable<boolean> = this.store.select(
    AuthSelectors.selectIsLoading
  );

  submitted = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    this.initSubscriptions();
  }

  override buildForm(): void {
    this.registerForm = new FormGroup<RegisterForm>({
      email: new FormControl<string>('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
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

  initSubscriptions(): void {
    this.registerForm.statusChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((status: string) => {
        this.isFormValid = status === 'VALID';
      });
  }

  get isEmailError() {
    return (
      this.submitted &&
      (this.registerForm.get('email')?.hasError('email') ||
        this.registerForm.get('email')?.hasError('required'))
    );
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

  get passwordGroup(): FormGroup<PasswordGroup> {
    return this.registerForm.controls[
      'passwordGroup'
    ] as FormGroup<PasswordGroup>;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.isFormValid = true;

      this.store.dispatch(
        AuthActions.register({
          email: this.registerForm.value.email as string,
          password: this.registerForm.value.passwordGroup?.password as string,
        })
      );
    } else {
      this.errorContainerTransition();

      this.isFormValid = false;
    }
  }
}
