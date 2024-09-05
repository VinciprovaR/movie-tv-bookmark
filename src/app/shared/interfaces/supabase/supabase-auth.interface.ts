import { FormControl, FormGroup } from '@angular/forms';
import { AuthError, Session } from '@supabase/supabase-js';

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

export interface PasswordChangeForm {
  currentPassword?: FormControl<string>;
  passwordGroup: FormGroup<PasswordGroup>;
}

export interface PublicUserEntity {
  id: number;
  email: string;
  user_id: string;
}

export interface UserSupabase {
  id: string;
  email: string;
}

export type CustomSessionResponse =
  | {
      data: {
        session: Session;
      };
      error: null;
    }
  | {
      data: {
        session: null;
      };
      error: AuthError;
    }
  | {
      data: {
        session: null;
      };
      error: null;
    };

export interface DeleteAccountForm {
  password: FormControl<string>;
  securityPrompt: FormControl<string>;
}
