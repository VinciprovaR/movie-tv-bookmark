import { FormControl } from '@angular/forms';

// export interface ErrorResponse {
//   errors: Record<string, string>;
// }

//export type ErrorResponse = Record<string, string>

export interface ErrorResponse {
  [key: string]: string;
}

export interface RegisterForm {
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  username: FormControl<string>;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
  stayConnected: FormControl<boolean | null>;
}

export interface LoginPayload {
  email: string;
  password: string;
  stayConnected: boolean;
}
