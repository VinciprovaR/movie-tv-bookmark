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
