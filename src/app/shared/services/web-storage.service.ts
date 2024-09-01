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

  getItem(key: string): string {
    return window.localStorage[key];
  }

  saveitem(obj: { key: string; value: string }): void {
    if (obj.key && obj.value) {
      window.localStorage[obj.key] = obj.value;
    }
  }

  destroyItem(key: string): void {
    console.log('destroy: ', key);
    if (key) {
      window.localStorage.removeItem(key);
    }
  }
}
