import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthSelectors } from '../../shared/store/auth';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '@supabase/supabase-js/';
import { AuthService } from '../../shared/services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  selectUser$!: Observable<User | null>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    console.log('init home');
    this.selectUser$ = this.store.select(AuthSelectors.selectUser);
  }

  ngOnDestroy(): void {
    console.log('destroy home');
  }
}
