import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  ActivationStart,
  NavigationCancel,
  NavigationStart,
  Route,
  Router,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from './shared/layout/header/header.component';
import { AuthSelectors, AuthActions } from './shared/store/auth';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'dreams_unveiler';

  readonly isUserAuthenticated$ = this.store
    .select(AuthSelectors.selectUser)
    .pipe(map((user) => !!user));

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationStart) {
    //     console.dir(event);
    //     console.dir(this.router);
    //   }
    // });
  }
}
