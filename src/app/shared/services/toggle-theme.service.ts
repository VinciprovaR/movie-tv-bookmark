import { DOCUMENT } from '@angular/common';
import { inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToggleThemeService {
  private readonly document = inject(DOCUMENT);
  readonly renderer!: Renderer2;
  private readonly rendererFactory = inject(RendererFactory2);
  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  toggleTheme(isDarkTheme: boolean) {
    if (isDarkTheme) {
      this.setDarkTheme();
    } else {
      this.removeDarkTheme();
    }
  }

  private setDarkTheme() {
    this.renderer.removeClass(this.document.body, 'light-theme');
    this.renderer.addClass(this.document.body, 'dark-theme');
  }

  private removeDarkTheme() {
    this.renderer.removeClass(this.document.body, 'dark-theme');
    this.renderer.addClass(this.document.body, 'light-theme');
  }
}
