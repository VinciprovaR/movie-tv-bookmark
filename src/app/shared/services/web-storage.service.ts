import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebStorageService {
  constructor() {}
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
