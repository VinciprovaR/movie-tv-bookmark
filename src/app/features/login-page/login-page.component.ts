import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthActions, AuthSelectors } from '../../shared/store/auth';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoginForm, LoginPayload } from '../../shared/models/auth.models';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    RouterModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  title: string = 'login';
  loginForm!: FormGroup<LoginForm>;

  selectIsLoading$: Observable<boolean> = this.store.select(
    AuthSelectors.selectIsLoading
  );

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup<LoginForm>({
      email: new FormControl<string>('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      // stayConnected: new FormControl<boolean>(false),
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.store.dispatch(
        AuthActions.login(this.loginForm.value as LoginPayload)
      );
    }
  }

  ngOnDestroy(): void {
    //to-do check if there are error
    this.store.dispatch(AuthActions.cleanError());
  }
}
