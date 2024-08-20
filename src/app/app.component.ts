import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/layout/header/header.component';
import { AuthSelectors } from './shared/store/auth';
import { map } from 'rxjs';
import { ContentComponent } from './shared/layout/content/content.component';
import { AlertContainerComponent } from './features/alert-container/alert-container.component';
import { NotifierStore } from './shared/store/component-store/notifier-store.service';
import { LoadingComponent } from './features/loading/loading.component';
import { RouterOutlet } from '@angular/router';
import { AbstractComponent } from './shared/components/abstract/abstract-component.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ContentComponent,
    HeaderComponent,
    AlertContainerComponent,
    LoadingComponent,
    RouterOutlet,
  ],
  providers: [NotifierStore],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends AbstractComponent implements OnInit {
  readonly isUserAuthenticated$ = this.store
    .select(AuthSelectors.selectUser)
    .pipe(map((user) => !!user));

  constructor() {
    super();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  ngOnInit(): void {}
}
