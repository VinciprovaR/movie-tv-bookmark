import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable, takeUntil } from 'rxjs';
import { AuthActions, AuthSelectors } from '../../shared/store/auth';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AbstractAuthComponent } from '../../shared/components/abstract/abstract-auth.component';

@Component({
  selector: 'app-confirmation-email-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatIconModule],
  templateUrl: './confirmation-email-request.component.html',
  styleUrl: './confirmation-email-request.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationRmailRequestComponent extends AbstractAuthComponent {
  private readonly fb = inject(FormBuilder);
  confirmationEmailRequestForm!: FormGroup;

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
    this.confirmationEmailRequestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  override initSelectors(): void {}

  override initSubscriptions(): void {
    this.confirmationEmailRequestForm.statusChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((status) => {
        this.isFormValid = status === 'INVALID' ? false : true;
      });
  }

  get isEmailError() {
    return (
      this.submitted &&
      (this.confirmationEmailRequestForm.get('email')?.hasError('email') ||
        this.confirmationEmailRequestForm.get('email')?.hasError('required'))
    );
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.confirmationEmailRequestForm.valid) {
      this.isFormValid = true;
      this.store.dispatch(
        AuthActions.resendConfirmationRegister(
          this.confirmationEmailRequestForm.value
        )
      );
    } else {
      this.errorContainerTransition();
      this.isFormValid = false;
    }
  }
}
