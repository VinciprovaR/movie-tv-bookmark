import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  selector: 'app-confirmation-email-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatIconModule],
  templateUrl: './confirmation-email-request.component.html',
  styleUrl: './confirmation-email-request.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationRmailRequestComponent extends AbstractAuthComponent {
  private readonly fb = inject(FormBuilder);
  selectIsLoading$: Observable<boolean> = this.store.select(
    AuthSelectors.selectIsLoading
  );
  confirmationEmailRequestForm!: FormGroup;
  submitted = false;

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

  initSubscriptions(): void {
    this.confirmationEmailRequestForm.statusChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((status: string) => {
        this.isFormValid = status === 'VALID';
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
