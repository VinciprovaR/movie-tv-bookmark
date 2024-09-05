import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';
import { CommonModule } from '@angular/common';
import { AuthActions } from '../../shared/store/auth';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent extends AbstractComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.logout();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  logout() {
    this.store.dispatch(AuthActions.logoutLocal({ scope: 'local' }));
  }
}
