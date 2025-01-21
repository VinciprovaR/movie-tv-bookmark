import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthActions } from '../../../../core/store/auth';
import { AbstractComponent } from '../../../../shared/abstract/components/abstract-component.component';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
})
export class LogoutComponent extends AbstractComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.logout();
  }

  logout() {
    this.store.dispatch(AuthActions.logoutLocal({ scope: 'local' }));
  }
}
