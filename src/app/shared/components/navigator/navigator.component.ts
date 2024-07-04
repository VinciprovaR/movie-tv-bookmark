import { Component, OnInit } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthSelectors, AuthActions } from '../../store/auth';
@Component({
  selector: 'app-navigator',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive],
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.css',
})
export class NavigatorComponent implements OnInit {
  readonly isUserAuthenticated$ = this.store
    .select(AuthSelectors.selectUser)
    .pipe(map((user) => !!user));

  constructor(private store: Store) {}
  ngOnInit(): void {}

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
