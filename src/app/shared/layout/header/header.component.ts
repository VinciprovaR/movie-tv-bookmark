import { Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NavigatorComponent } from '../../components/navigator/navigator.component';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { AuthSelectors } from '../../store/auth';
import { LinkPath } from '../../interfaces/navigator.interface';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NavigatorComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private readonly store = inject(Store);
  isUserAuthenticated$!: Observable<boolean>;

  readonly LINK_PATH_LIST: LinkPath[] = [
    { label: 'Home', path: 'home' },
    { label: 'User Profile', path: 'user-profile' },
    { label: 'Search Movie', path: 'movie' },
    { label: 'Search TV show', path: 'tv' },
    { label: 'Discovery Movie', path: 'discovery-movie' },
    { label: 'Discovery TV', path: 'discovery-tv' },
    { label: 'Movie Lifecycle', path: 'movie-lifecycle-search' },
    { label: 'TV Lifecycle', path: 'tv-lifecycle-search' },
  ];

  constructor() {}

  ngOnInit(): void {
    this.initSelectors();
  }

  initSelectors() {
    this.isUserAuthenticated$ = this.store
      .select(AuthSelectors.selectUser)
      .pipe(map((user) => !!user));
  }
}
