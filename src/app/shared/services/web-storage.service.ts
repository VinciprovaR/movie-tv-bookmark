import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebStorageService {
  constructor() {}
  getJwtToken(): string {
    return window.localStorage['jwtToken'];
  }

  saveJwtToken(jwtToken: string): void {
    window.localStorage['jwtToken'] = jwtToken;
  }

  destroyJwtToken(): void {
    window.localStorage.removeItem('jwtToken');
  }

  getRememberMe(): boolean {
    return 'true' === window.localStorage['remember-me'];
  }

  saveRememberMe(remember: boolean): void {
    window.localStorage['remember-me'] = remember;
  }

  destroyRemember(): void {
    window.localStorage.removeItem('remember-me');
  }
}
