import { Component, inject, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthSelectors } from '../../shared/store/auth';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '@supabase/supabase-js/';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent extends AbstractComponent implements OnInit {
  selectUser$!: Observable<User | null>;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.selectUser$ = this.store.select(AuthSelectors.selectUser);
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}
}
