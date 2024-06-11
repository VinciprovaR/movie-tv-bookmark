import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { AuthSelectors } from '../../shared/store/auth';
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

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    console.log('init user profile');
    this.userSelector$ = this.store.select(AuthSelectors.selectUser);
  }
}
