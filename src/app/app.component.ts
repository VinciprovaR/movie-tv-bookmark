import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/layout/header/header.component';

import { AlertContainerComponent } from './features/alert-container/alert-container.component';
import { NotifierStore, ToggleThemeStore } from './shared/component-store';
import { LoadingComponent } from './features/loading/loading.component';
import { RouterOutlet } from '@angular/router';
import { AbstractComponent } from './shared/components/abstract/abstract-component.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { GlobalErrorStore } from './shared/component-store/global-error-store.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,

    HeaderComponent,
    AlertContainerComponent,
    LoadingComponent,
    RouterOutlet,
    FooterComponent,
  ],
  providers: [NotifierStore],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends AbstractComponent implements OnInit {
  private readonly toggleThemeStore = inject(ToggleThemeStore);
  private readonly globalErrorHandler = inject(GlobalErrorStore);

  constructor() {
    super();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  ngOnInit(): void {}
}
