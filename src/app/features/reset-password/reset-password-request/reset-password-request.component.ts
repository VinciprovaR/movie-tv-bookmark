import { Component, inject, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthActions, AuthSelectors } from '../../../shared/store/auth';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-reset-password-request',
  standalone: true,
  imports: [
    CommonModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
  ],
  templateUrl: './reset-password-request.component.html',
  styleUrl: './reset-password-request.component.css',
})
export class ResetPasswordRequestComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  resetPasswordForm!: FormGroup;

  selectIsLoading$: Observable<boolean> = this.store.select(
    AuthSelectors.selectIsLoading
  );

  constructor() {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.store.dispatch(
        AuthActions.requestResetPassword(this.resetPasswordForm.value)
      );
    }
  }
}
