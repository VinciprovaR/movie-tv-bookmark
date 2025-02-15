import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, takeUntil } from 'rxjs';
import { AuthActions, AuthSelectors } from '../../../core/store/auth';
import { AbstractAuthComponent } from '../../abstract/components/abstract-auth.component';

@Component({
  selector: 'app-reset-password-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatIconModule],
  templateUrl: './reset-password-request.component.html',
  styleUrl: './reset-password-request.component.css',
})
export class ResetPasswordRequestComponent extends AbstractAuthComponent {
  private readonly fb = inject(FormBuilder);
  resetPasswordRequestForm!: FormGroup;

  submitted = false;

  selectIsLoading$: Observable<boolean> = this.store.select(
    AuthSelectors.selectIsLoading
  );

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    this.initSubscriptions();
  }

  override buildForm(): void {
    this.resetPasswordRequestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  initSubscriptions(): void {
    this.resetPasswordRequestForm.statusChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((status) => {
        this.isFormValid = status === 'VALID';
      });
  }

  get isEmailError() {
    return (
      this.submitted &&
      (this.resetPasswordRequestForm.get('email')?.hasError('email') ||
        this.resetPasswordRequestForm.get('email')?.hasError('required'))
    );
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.resetPasswordRequestForm.valid) {
      this.isFormValid = true;
      this.store.dispatch(
        AuthActions.requestResetPassword(this.resetPasswordRequestForm.value)
      );
    } else {
      this.errorContainerTransition();
      this.isFormValid = false;
    }
  }
}
