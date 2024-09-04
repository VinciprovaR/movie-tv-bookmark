import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthActions, AuthSelectors } from '../../shared/store/auth';
import { CommonModule } from '@angular/common';
import { User } from '@supabase/supabase-js/';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';
import { ChangePasswordConfirmationDialogComponent } from '../../shared/components/change-password-confirmation-dialog/change-password-confirmation-dialog.component';
import { DeleteAccountConfirmationDialogComponent } from '../../shared/components/delete-account-confirmation-dialog/delete-account-confirmation-dialog.component';
import { SubmitDialog } from '../../shared/components/abstract/abstract-dialog.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ChangePasswordConfirmationDialogComponent,
    DeleteAccountConfirmationDialogComponent,
  ],
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

  deleteAccount(event: SubmitDialog) {
    if (event.typeSubmit === 'confirm') {
      this.store.dispatch(
        AuthActions.deleteAccount({ password: event.payload })
      );
    }
  }

  requestChangePassword(event: SubmitDialog) {
    if (event.typeSubmit === 'confirm') {
      this.store.dispatch(AuthActions.requestResetPasswordAuthenticated());
    }
  }
}
