import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/layout/header/header.component';
import { AuthSelectors } from './shared/store/auth';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { LifecycleService } from './shared/services/lifecycle.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'bookmark_movie';

  readonly isUserAuthenticated$ = this.store
    .select(AuthSelectors.selectUser)
    .pipe(map((user) => !!user));

  constructor(
    private store: Store,
    private router: Router,
    private lifeCycle: LifecycleService
  ) {}

  ngOnInit(): void {
    // this.router.events.subscribe((event) => {
    //   console.log(event);
    // });
  }
}
