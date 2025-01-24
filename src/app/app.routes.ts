import { Routes } from '@angular/router';
import { authGuard } from './core/guards/authGuard';
import { authGuardConfirmedEmail } from './core/guards/authGuardConfirmedEmail';
import { nonAuthGuard } from './core/guards/nonAuthGuard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
    title: 'Home',
  },
  {
    path: 'media-search',
    loadComponent: () =>
      import('./shared/components/media-search/media-search.component').then(
        (m) => m.MediaSearchComponent
      ),

    title: 'Media Search',
    children: [
      {
        path: '',
        redirectTo: 'movie',
        pathMatch: 'full',
      },
      {
        path: 'movie',
        loadComponent: () =>
          import(
            './features/movie/components/movie-search/movie-search.component'
          ).then((m) => m.MovieSearchComponent),
        title: 'Search Movie',
      },
      {
        path: 'tv',
        loadComponent: () =>
          import('./features/tv/components/tv-search/tv-search.component').then(
            (m) => m.TVSearchComponent
          ),
        title: 'Search TV',
      },
      {
        path: 'people',
        loadComponent: () =>
          import(
            './features/people/components/people-search/people-search.component'
          ).then((m) => m.PeopleSearchComponent),
        title: 'Search People',
      },
    ],
  },
  {
    path: 'media-discovery',
    loadComponent: () =>
      import(
        './shared/components/media-discovery/media-discovery.component'
      ).then((m) => m.MediaDiscoveryComponent),

    title: 'Media Discovery',
    children: [
      {
        path: '',
        redirectTo: 'movie',
        pathMatch: 'full',
      },
      {
        path: 'movie',
        loadComponent: () =>
          import(
            './features/movie/components/movie-discovery/movie-discovery.component'
          ).then((m) => m.MovieDiscoveryComponent),
        title: 'Discovery Movie',
      },
      {
        path: 'tv',
        loadComponent: () =>
          import(
            './features/tv/components/tv-discovery/tv-discovery.component'
          ).then((m) => m.TVDiscoveryComponent),
        title: 'Discovery TV',
      },
    ],
  },
  {
    path: 'media-bookmark',
    loadComponent: () =>
      import(
        './shared/components/media-bookmark/media-bookmark.component'
      ).then((m) => m.MediaBookmarkComponent),

    title: 'Media Bookmark',
    children: [
      {
        path: '',
        redirectTo: 'movie',
        pathMatch: 'full',
      },
      {
        path: 'movie',
        loadComponent: () =>
          import(
            './shared/components/media-bookmark-search/media-bookmark-search.component'
          ).then((m) => m.MediaBookmarkSearchComponent),

        title: 'Your Movie Bookmarks',
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
                './features/movie/components/movie-bookmark-search/movie-bookmark-search.component'
              ).then((m) => m.MovieBookmarkSearchComponent),
            title: 'Movie Bookmark List',
          },
        ],
      },
      {
        path: 'tv',
        loadComponent: () =>
          import(
            './shared/components/media-bookmark-search/media-bookmark-search.component'
          ).then((m) => m.MediaBookmarkSearchComponent),

        title: 'Your TV Bookmarks',
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
                './features/tv/components/tv-bookmark-search/tv-bookmark-search.component'
              ).then((m) => m.TVBookmarkSearchComponent),
            title: 'TV Bookmark List',
          },
        ],
      },
    ],
  },
  {
    path: 'ask',
    loadComponent: () =>
      import('./features/ai/components/ai-search/ai-search.component').then(
        (m) => m.AiSearchComponent
      ),
    title: 'Ask to ai',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/components/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
    canActivate: [nonAuthGuard],
    title: 'Login',
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./components/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
    canActivate: [authGuard],
    title: 'Settings',
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('./features/auth/components/logout/logout.component').then(
        (m) => m.LogoutComponent
      ),
    canActivate: [authGuard],
    title: 'Sign out',
  },
  {
    path: 'movie-detail/:movieId',
    loadComponent: () =>
      import(
        './features/movie/components/movie-detail/movie-detail.component'
      ).then((m) => m.MovieDetailComponent),
    title: 'Movie Detail',
  },
  {
    path: 'movie-credits/:movieId',
    loadComponent: () =>
      import(
        './features/movie/components/movie-detail-credits/movie-detail-credits.component'
      ).then((m) => m.MovieDetailCreditsComponent),
    title: 'Movie Detail Credits',
  },
  {
    path: 'tv-detail/:tvId',
    loadComponent: () =>
      import('./features/tv/components/tv-detail/tv-detail.component').then(
        (m) => m.TVDetailComponent
      ),
    title: 'TV Detail',
  },
  {
    path: 'tv-credits/:tvId',
    loadComponent: () =>
      import(
        './features/tv/components/tv-detail-credits/tv-detail-credits.component'
      ).then((m) => m.TVDetailCreditsComponent),
    title: 'TV Detail Credits',
  },

  {
    path: 'person-detail/:personId',
    loadComponent: () =>
      import(
        './features/people/components/person-detail/person-detail.component'
      ).then((m) => m.PersonDetailComponent),
    title: 'Person Detail',
  },
  {
    path: 'register',
    loadComponent: () =>
      import(
        './features/auth/components/register-page/register-page.component'
      ).then((m) => m.RegisterPageComponent),
    canActivate: [nonAuthGuard],
    title: 'Register',
  },
  {
    path: 'reset-password-request',
    loadComponent: () =>
      import(
        './shared/components/reset-password-request/reset-password-request.component'
      ).then((m) => m.ResetPasswordRequestComponent),
    canActivate: [nonAuthGuard],
    title: 'Reset Password',
  },
  {
    path: 'resend-confirmation-email',
    loadComponent: () =>
      import(
        './shared/components/confirmation-email-request/confirmation-email-request.component'
      ).then((m) => m.ConfirmationRmailRequestComponent),
    canActivate: [nonAuthGuard],
    title: 'Resend Confirmation Email',
  },
  {
    path: 'email-confirmed',
    loadComponent: () =>
      import('./shared/components/confirm-email/confirm-email.component').then(
        (m) => m.ConfirmEmailComponent
      ),
    canActivate: [authGuardConfirmedEmail],
    title: 'Confirmation Email Result',
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import(
        './shared/components/reset-password/reset-password.component'
      ).then((m) => m.ResetPasswordComponent),
    title: 'Reset Password ',
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./components/about/about.component').then(
        (m) => m.AboutComponent
      ),
    title: 'About',
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
