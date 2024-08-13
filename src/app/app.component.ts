import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/layout/header/header.component';
import { AuthSelectors } from './shared/store/auth';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { ContentComponent } from './shared/layout/content/content.component';
import { AlertContainerComponent } from './features/alert-container/alert-container.component';
import { NotifierStore } from './shared/store/component-store/notifier-store.service';
import { ToggleThemeStore } from './shared/store/component-store/toggle-theme-store.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ContentComponent,
    HeaderComponent,
    AlertContainerComponent,
  ],
  providers: [NotifierStore],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly toggleThemeStore = inject(ToggleThemeStore);

  readonly isUserAuthenticated$ = this.store
    .select(AuthSelectors.selectUser)
    .pipe(map((user) => !!user));

  constructor() {}

  ngOnInit(): void {}
}
