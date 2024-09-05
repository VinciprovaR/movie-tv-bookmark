import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthActions, AuthSelectors } from '../../shared/store/auth';
import { CommonModule } from '@angular/common';
import { User } from '@supabase/supabase-js/';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';
import { ChangePasswordConfirmationDialogComponent } from '../../shared/components/change-password-confirmation-dialog/change-password-confirmation-dialog.component';
import { DeleteAccountConfirmationDialogComponent } from '../../shared/components/delete-account-confirmation-dialog/delete-account-confirmation-dialog.component';
import { SubmitDialog } from '../../shared/components/abstract/abstract-dialog.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ChangePasswordConfirmationDialogComponent,
    DeleteAccountConfirmationDialogComponent,
    MatIconModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent extends AbstractComponent implements OnInit {
  userSelector$!: Observable<User | null>;
  email$!: Observable<string>;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSelectors();
  }

  override initSelectors(): void {
    this.userSelector$ = this.store.select(AuthSelectors.selectUser);
    this.email$ = this.userSelector$.pipe(
      map((user: User | null) => {
        if (user) {
          return user.email ? user.email : '';
        }
        return '';
      })
    );
  }

  override initSubscriptions(): void {}

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
