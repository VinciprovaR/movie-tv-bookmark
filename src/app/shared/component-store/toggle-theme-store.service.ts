import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs';
import { ToggleThemeService } from '../services/toggle-theme.service';
import { WebStorageService } from '../services/web-storage.service';
import { THEME_KEY_LOCAL_STORAGE } from '../../providers';

export interface ToggleThemeState {
  isDarkTheme: boolean;
  icon: string;
}

//to-do preferenze da device + salvare scelta in storage o db
@Injectable({
  providedIn: 'root',
})
export class ToggleThemeStore extends ComponentStore<ToggleThemeState> {
  private readonly toggleThemeService = inject(ToggleThemeService);

  readonly selectIsDarkTheme$ = this.select((state) => state.isDarkTheme);
  readonly selectIcon$ = this.select((state) => state.icon);

  constructor() {
    const webStorageService = inject(WebStorageService);
    const themeKeyLocalStorage = inject(THEME_KEY_LOCAL_STORAGE);
    let isDarkTheme = false;

    if (webStorageService.getItem(themeKeyLocalStorage) != undefined) {
      isDarkTheme = 'true' === webStorageService.getItem(themeKeyLocalStorage);
    } else {
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        isDarkTheme = true;
      } else {
      }
    }

    super({
      isDarkTheme: isDarkTheme,
      icon: isDarkTheme ? 'light_mode' : 'dark_mode',
    });
  }

  readonly toggleTheme = this.updater((state) => {
    return {
      isDarkTheme: !state.isDarkTheme,
      icon: state.isDarkTheme ? 'dark_mode' : 'light_mode',
    };
  });

  readonly toggleThemeEffect = this.effect(() => {
    return this.selectIsDarkTheme$.pipe(
      tap((isDarkTheme: boolean) => {
        this.toggleThemeService.toggleTheme(isDarkTheme);
      })
    );
  });
}
