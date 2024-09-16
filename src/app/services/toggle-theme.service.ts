import { DOCUMENT } from '@angular/common';
import { inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { THEME_KEY_LOCAL_STORAGE } from '../providers';
import { WebStorageService } from './web-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ToggleThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly webStorageService = inject(WebStorageService);
  readonly renderer!: Renderer2;
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly THEME_KEY_LOCAL_STORAGE = inject(THEME_KEY_LOCAL_STORAGE);

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  toggleTheme(isDarkTheme: boolean) {
    if (isDarkTheme) {
      this.setDarkTheme();
    } else {
      this.removeDarkTheme();
    }

    this.webStorageService.saveitem({
      key: this.THEME_KEY_LOCAL_STORAGE,
      value: isDarkTheme.toString(),
    });
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
