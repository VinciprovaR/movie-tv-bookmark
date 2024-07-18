import { Component, inject, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthSelectors } from '../../shared/store/auth';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '@supabase/supabase-js/';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly store = inject(Store);

  selectUser$!: Observable<User | null>;

  constructor() {}

  ngOnInit(): void {
    this.selectUser$ = this.store.select(AuthSelectors.selectUser);
  }
}
