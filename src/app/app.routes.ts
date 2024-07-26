import { Routes } from '@angular/router';
import { authGuard, nonAuthGuard } from './shared/guards';
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
  // {
  //   path: 'home',
  //   loadComponent: () =>
  //     import('./features/home/home.component').then((m) => m.HomeComponent),
  //   canActivate: [authGuard],
  //   title: 'Home',
  // },
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
    path: 'reset-password-sent',
    loadComponent: () =>
      import(
        './features/reset-password/reset-password-sent/reset-password-sent.component'
      ).then((m) => m.ResetPasswordSentComponent),
    canActivate: [nonAuthGuard],
    title: 'Reset Password Sent',
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
    path: 'movie-lifecycle-search',
    loadComponent: () =>
      import(
        './shared/components/media-lifecycle-search/media-lifecycle-search.component'
      ).then((m) => m.MediaLifecycleSearchComponent),
    canActivate: [authGuard],
    title: 'Movie Bookmarks',
    children: [
      {
        path: '',
        redirectTo: 'watchlist',
        pathMatch: 'full',
      },
      {
        path: ':lifecycleType',
        loadComponent: () =>
          import(
            './features/movie-lifecycle-search/movie-lifecycle-search.component'
          ).then((m) => m.MovieLifecycleSearchComponent),
        canActivate: [authGuard],
        title: 'Movie Lifecycle List', //to-do lifecycle list con variabile
      },
    ],
  },
  {
    path: 'tv-lifecycle-search',
    loadComponent: () =>
      import(
        './shared/components/media-lifecycle-search/media-lifecycle-search.component'
      ).then((m) => m.MediaLifecycleSearchComponent),
    canActivate: [authGuard],
    title: 'TV Bookmarks',
    children: [
      {
        path: '',
        redirectTo: 'watchlist',
        pathMatch: 'full',
      },
      {
        path: ':lifecycleType',
        loadComponent: () =>
          import(
            './features/tv-lifecycle-search/tv-lifecycle-search.component'
          ).then((m) => m.TVLifecycleSearchComponent),
        canActivate: [authGuard],
        title: 'TV Lifecycle List', //to-do lifecycle list con variabile
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
    path: 'tv-detail/:tvId',
    loadComponent: () =>
      import('./features/tv-detail/tv-detail.component').then(
        (m) => m.TVDetailComponent
      ),
    canActivate: [authGuard],
    title: 'TV Detail',
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
