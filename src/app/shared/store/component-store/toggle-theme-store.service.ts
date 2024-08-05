import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs';
import { ToggleThemeService } from '../../services/toggle-theme.service';
import { WebStorageService } from '../../services/web-storage.service';
import { THEME_KEY_LOCAL_STORAGE } from '../../../providers';

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
    let isDarkMode = false;

    if (webStorageService.getItem(themeKeyLocalStorage) != undefined) {
      console.log('theme preferences salvate in storage, priorità a storage');
      isDarkMode = 'true' === webStorageService.getItem(themeKeyLocalStorage);
    } else {
      console.log(
        'theme preferences non ancora salvate in storage, priorità a device'
      );
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        console.log('device is dark mode');
        isDarkMode = true;
      } else {
        console.log('device is light mode');
      }
    }

    super({
      isDarkTheme: isDarkMode,
      icon: 'dark_mode',
    });
  }

  readonly toggleTheme = this.updater((state) => {
    if (!state.isDarkTheme) {
    }
    return {
      isDarkTheme: !state.isDarkTheme,
      icon: state.isDarkTheme ? 'dark_mode' : 'light_mode',
    };
  });

  readonly showAlertError = this.effect(() => {
    return this.selectIsDarkTheme$.pipe(
      tap((isDarkTheme: boolean) => {
        this.toggleThemeService.toggleTheme(isDarkTheme);
      })
    );
  });
}
