import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs';
import { ToggleThemeService } from '../../services/toggle-theme.service';

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
    super({ isDarkTheme: false, icon: 'dark_mode' });
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
