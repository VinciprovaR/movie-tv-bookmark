import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthActions, AuthSelectors } from '../../shared/store/auth';
import { CommonModule } from '@angular/common';
import { User } from '@supabase/supabase-js/';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ConfirmationDialogComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent extends AbstractComponent implements OnInit {
  userSelector$!: Observable<User | null>;

  constructor() {
    super();
  }
  override initSelectors(): void {}
  override initSubscriptions(): void {}

  ngOnInit(): void {
    this.userSelector$ = this.store.select(AuthSelectors.selectUser);
  }

  logout() {
    this.store.dispatch(AuthActions.logoutLocal({ scope: 'local' }));
  }

  deleteAccount() {
    this.store.dispatch(AuthActions.deleteAccount());
  }

  requestChangePassword() {
    this.store.dispatch(AuthActions.requestResetPasswordAuthenticated());
  }
}
