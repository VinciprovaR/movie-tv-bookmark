import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Observable, map, takeUntil } from 'rxjs';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';
import { AuthSelectors } from '../../shared/store/auth';
import { RouterLink } from '@angular/router';
import { SuccessMessageTemplateComponent } from '../../shared/components/success-message-template/success-message-template.component';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink,
    SuccessMessageTemplateComponent,
  ],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailComponent extends AbstractComponent implements OnInit {
  isUserAuthenticated$!: Observable<boolean>;
  isLoading$!: Observable<boolean>;

  @Input('email')
  email!: string;
  params: any = null;

  confirmEmailMessage: string = '';
  confirmEmailTitle: string = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.confirmEmailTitle = 'Confirmation success!';
    this.confirmEmailMessage = `Email ${this.email}  Confirmed!`;

    this.initSubscriptions();
  }

  override initSelectors(): void {
    this.isLoading$ = this.store.select(AuthSelectors.selectIsLoading);
  }
  override initSubscriptions(): void {
    this.isUserAuthenticated$ = this.store
      .select(AuthSelectors.selectUser)
      .pipe(map((user) => !!user));

    this.route.fragment.pipe(takeUntil(this.destroyed$)).subscribe((f) => {
      if (f) {
        this.params = Object.fromEntries(new URLSearchParams(f));
      }
    });
  }
}
