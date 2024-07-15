import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { AuthActions, AuthSelectors } from '../../shared/store/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js/';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  userSelector$!: Observable<User | null>;
  private readonly store = inject(Store);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.userSelector$ = this.store.select(AuthSelectors.selectUser);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
