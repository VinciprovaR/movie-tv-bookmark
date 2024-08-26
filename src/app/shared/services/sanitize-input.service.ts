import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SanitizeInputService {
  private readonly specialCharMap: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  constructor() {}

  escapeHtml(input: string): string {
    return String(input).replace(/[&<>"'`=\/]/g, (char) => {
      return this.specialCharMap[char];
    });
  }
}
