import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Observable } from 'rxjs';
import { AuthActions, AuthSelectors } from '../../../shared/store/auth';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../../../shared/components/abstract/abstract-component.component';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordRequestComponent extends AbstractComponent {
  private readonly fb = inject(FormBuilder);
  resetPasswordForm!: FormGroup;

  selectIsLoading$: Observable<boolean> = this.store.select(
    AuthSelectors.selectIsLoading
  );

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.store.dispatch(
        AuthActions.requestResetPassword(this.resetPasswordForm.value)
      );
    }
  }
}
