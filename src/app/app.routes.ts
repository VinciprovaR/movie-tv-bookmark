import { Routes } from '@angular/router';
import {
  authGuard,
  nonAuthGuard,
  passwordRecoveryGuard,
} from './shared/guards';
import { redirectGuard } from './shared/guards/redirect.guard';

export const routes: Routes = [
  {
    path: 'user-profile',
    loadComponent: () =>
      import('./features/user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent
      ),

    canActivate: [authGuard],
    title: 'User Profile',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
    title: 'Home',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
    canActivate: [nonAuthGuard],
    title: 'Login',
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import(
        './features/reset-password/reset-password-request/reset-password-request.component'
      ).then((m) => m.ResetPasswordRequestComponent),
    canActivate: [nonAuthGuard],
    title: 'Reset Password',
  },
  {
    //to-do guard verify token
    //passwordRecoveryGuard
    path: 'reset-password-form',
    loadComponent: () =>
      import(
        './features/reset-password/reset-password-form/reset-password-form.component'
      ).then((m) => m.ResetPasswordFormComponent),
    canActivate: [authGuard, passwordRecoveryGuard],
    title: 'Reset Password Form',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/register-page/register-page.component').then(
        (m) => m.RegisterPageComponent
      ),
    canActivate: [nonAuthGuard],
    title: 'Register',
  },
  {
    path: 'register-success',
    loadComponent: () =>
      import('./features/register-success/register-success.component').then(
        (m) => m.RegisterSuccessComponent
      ),
    title: 'Register Success',
  },
  {
    path: 'movie',
    loadComponent: () =>
      import('./features/movie-search/movie-search.component').then(
        (m) => m.MovieSearchComponent
      ),
    canActivate: [authGuard],
    title: 'Search Movie',
  },
  {
    path: 'tv',
    loadComponent: () =>
      import('./features/tv-search/tv-search.component').then(
        (m) => m.TVSearchComponent
      ),
    canActivate: [authGuard],
    title: 'Search TV',
  },
  {
    path: 'discovery-movie',
    loadComponent: () =>
      import('./features/movie-discovery/movie-discovery.component').then(
        (m) => m.MovieDiscoveryComponent
      ),
    canActivate: [authGuard],
    title: 'Discovery Movie',
  },
  {
    path: 'discovery-tv',
    loadComponent: () =>
      import('./features/tv-discovery/tv-discovery.component').then(
        (m) => m.TVDiscoveryComponent
      ),
    canActivate: [authGuard],
    title: 'Discovery TV',
  },
  {
    path: 'movie-bookmark-search',
    loadComponent: () =>
      import(
        './shared/components/media-bookmark-search/media-bookmark-search.component'
      ).then((m) => m.MediaBookmarkSearchComponent),
    canActivate: [authGuard],
    title: 'Movie Bookmarks',
    children: [
      {
        path: '',
        redirectTo: 'watchlist',
        pathMatch: 'full',
      },
      {
        path: ':bookmarkType',
        loadComponent: () =>
          import(
            './features/movie-bookmark-search/movie-bookmark-search.component'
          ).then((m) => m.MovieBookmarkSearchComponent),
        canActivate: [authGuard],
        title: 'Movie Bookmark List',
      },
    ],
  },
  {
    path: 'tv-bookmark-search',
    loadComponent: () =>
      import(
        './shared/components/media-bookmark-search/media-bookmark-search.component'
      ).then((m) => m.MediaBookmarkSearchComponent),
    canActivate: [authGuard],
    title: 'TV Bookmarks',
    children: [
      {
        path: '',
        redirectTo: 'watchlist',
        pathMatch: 'full',
      },
      {
        path: ':bookmarkType',
        loadComponent: () =>
          import(
            './features/tv-bookmark-search/tv-bookmark-search.component'
          ).then((m) => m.TVBookmarkSearchComponent),
        canActivate: [authGuard],
        title: 'TV Bookmark List',
      },
    ],
  },
  {
    path: 'movie-detail/:movieId',
    loadComponent: () =>
      import('./features/movie-detail/movie-detail.component').then(
        (m) => m.MovieDetailComponent
      ),
    canActivate: [authGuard],
    title: 'Movie Detail',
  },
  {
    path: 'movie-credits/:movieId',
    loadComponent: () =>
      import(
        './features/movie-detail-credits/movie-detail-credits.component'
      ).then((m) => m.MovieDetailCreditsComponent),
    canActivate: [authGuard],
    title: 'Movie Detail Credits',
  },
  {
    path: 'tv-detail/:tvId',
    loadComponent: () =>
      import('./features/tv-detail/tv-detail.component').then(
        (m) => m.TVDetailComponent
      ),
    canActivate: [authGuard],
    title: 'TV Detail',
  },
  {
    path: 'tv-credits/:tvId',
    loadComponent: () =>
      import('./features/tv-detail-credits/tv-detail-credits.component').then(
        (m) => m.TVDetailCreditsComponent
      ),
    canActivate: [authGuard],
    title: 'TV Detail Credits',
  },
  {
    path: 'people',
    loadComponent: () =>
      import('./features/people-search/people-search.component').then(
        (m) => m.PeopleSearchComponent
      ),
    canActivate: [authGuard],
    title: 'Search People',
  },
  {
    path: 'person-detail/:personId',
    loadComponent: () =>
      import('./features/person-detail/person-detail.component').then(
        (m) => m.PersonDetailComponent
      ),
    canActivate: [authGuard],
    title: 'Person Detail',
  },
  {
    path: '',
    pathMatch: 'full',
    canActivate: [redirectGuard],
    children: [],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
