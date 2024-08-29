import { FormControl, FormGroup } from '@angular/forms';

export interface PasswordGroup {
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

export interface RegisterForm {
  email: FormControl<string>;
  passwordGroup: FormGroup<PasswordGroup>;
  username?: FormControl<string>;
}

export interface RegisterPayload {
  username?: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
  stayConnected?: FormControl<boolean | null>;
}

export interface LoginPayload {
  email: string;
  password: string;
  stayConnected?: boolean;
}

export interface PasswordResetFormForm {
  oldPassword?: FormControl<string>;
  passwordGroup: FormGroup<PasswordGroup>;
}
