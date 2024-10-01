import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebStorageService {
  getItem(key: string): string {
    return window.localStorage[key];
  }

  saveitem(obj: { key: string; value: string }): void {
    if (obj.key && obj.value) {
      window.localStorage[obj.key] = obj.value;
    }
  }

  destroyItem(key: string): void {
    if (key) {
      window.localStorage.removeItem(key);
    }
  }
}
