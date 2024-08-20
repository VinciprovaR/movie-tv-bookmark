import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  RegisterPayload,
  RegisterForm,
} from '../../shared/interfaces/supabase/supabase-auth.interface';
import { Observable } from 'rxjs';
import { AuthSelectors, AuthActions } from '../../shared/store/auth';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzIconModule,
    ReactiveFormsModule,
    RouterModule,
    NzToolTipModule,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent extends AbstractComponent {
  registerForm!: FormGroup<RegisterForm>;

  selectIsLoading$: Observable<boolean> = this.store.select(
    AuthSelectors.selectIsLoading
  );

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup<RegisterForm>({
      // username: new FormControl<string>('', {
      //   validators: [Validators.required],
      //   nonNullable: true,
      // }),
      email: new FormControl<string>('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: new FormControl<string>('', {
        validators: [
          this.pswLength.bind(this),
          Validators.pattern(/(?=.*\d)(?=.*[A-Za-z])^[^ ]+$/),
          Validators.required,
        ],
        nonNullable: true,
      }),
      confirmPassword: new FormControl<string>('', {
        validators: [Validators.required, this.diffPsw.bind(this)],
        nonNullable: true,
      }),
    });
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  pswLength(control: AbstractControl): ValidationErrors | null {
    return control.value.length > 0 &&
      (control.value.length < 6 || control.value.length > 15)
      ? { pswError: true }
      : null;
  }

  diffPsw(control: AbstractControl): ValidationErrors | null {
    //
    return control.value.length > 0 &&
      control.value !== this.registerForm?.value.password
      ? { diffPswErr: true }
      : null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.store.dispatch(
        AuthActions.register(this.registerForm.value as RegisterPayload)
      );
    }
  }
}
