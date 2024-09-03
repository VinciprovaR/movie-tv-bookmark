import { Routes } from '@angular/router';
import { authGuard, nonAuthGuard } from './shared/guards';
import { redirectGuard } from './shared/guards/redirect.guard';
import { authGuardConfirmedEmail } from './shared/guards/authGuardConfirmedEmail';

export const routes: Routes = [
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
    canActivate: [authGuard],
    title: 'Settings',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),

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
    path: 'reset-password-request',
    loadComponent: () =>
      import(
        './features/reset-password/reset-password-request/reset-password-request.component'
      ).then((m) => m.ResetPasswordRequestComponent),
    canActivate: [nonAuthGuard],
    title: 'Reset Password',
  },
  {
    path: 'resend-confirmation-email',
    loadComponent: () =>
      import(
        './features/confirmation-email-request/confirmation-email-request.component'
      ).then((m) => m.ConfirmationRmailRequestComponent),
    canActivate: [nonAuthGuard],
    title: 'Resend Confirmation Email',
  },
  {
    path: 'email-confirmed',
    loadComponent: () =>
      import('./features/confirm-email/confirm-email.component').then(
        (m) => m.ConfirmEmailComponent
      ),
    canActivate: [authGuardConfirmedEmail],
    title: 'Confirmation Email Result',
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import(
        './features/reset-password/reset-password/reset-password.component'
      ).then((m) => m.ResetPasswordComponent),

    title: 'Reset Password ',
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
    path: 'movie',
    loadComponent: () =>
      import('./features/movie-search/movie-search.component').then(
        (m) => m.MovieSearchComponent
      ),

    title: 'Search Movie',
  },
  {
    path: 'tv',
    loadComponent: () =>
      import('./features/tv-search/tv-search.component').then(
        (m) => m.TVSearchComponent
      ),

    title: 'Search TV',
  },
  {
    path: 'discovery-movie',
    loadComponent: () =>
      import('./features/movie-discovery/movie-discovery.component').then(
        (m) => m.MovieDiscoveryComponent
      ),

    title: 'Discovery Movie',
  },
  {
    path: 'discovery-tv',
    loadComponent: () =>
      import('./features/tv-discovery/tv-discovery.component').then(
        (m) => m.TVDiscoveryComponent
      ),

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

    title: 'Movie Detail',
  },
  {
    path: 'movie-credits/:movieId',
    loadComponent: () =>
      import(
        './features/movie-detail-credits/movie-detail-credits.component'
      ).then((m) => m.MovieDetailCreditsComponent),

    title: 'Movie Detail Credits',
  },
  {
    path: 'tv-detail/:tvId',
    loadComponent: () =>
      import('./features/tv-detail/tv-detail.component').then(
        (m) => m.TVDetailComponent
      ),

    title: 'TV Detail',
  },
  {
    path: 'tv-credits/:tvId',
    loadComponent: () =>
      import('./features/tv-detail-credits/tv-detail-credits.component').then(
        (m) => m.TVDetailCreditsComponent
      ),

    title: 'TV Detail Credits',
  },
  {
    path: 'people',
    loadComponent: () =>
      import('./features/people-search/people-search.component').then(
        (m) => m.PeopleSearchComponent
      ),
    title: 'Search People',
  },
  {
    path: 'person-detail/:personId',
    loadComponent: () =>
      import('./features/person-detail/person-detail.component').then(
        (m) => m.PersonDetailComponent
      ),

    title: 'Person Detail',
  },
  {
    path: 'page-not-found',
    loadComponent: () =>
      import('./features/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),

    title: 'Page not found',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
    // canActivate: [redirectGuard],
  },
  {
    path: '**',
    redirectTo: '/page-not-found',
    pathMatch: 'full',
  },
];
