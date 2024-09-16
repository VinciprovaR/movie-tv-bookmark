import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Observable, map, takeUntil } from 'rxjs';
import { AuthSelectors } from '../../core/store/auth';
import { AbstractComponent } from '../../shared/abstract/components/abstract-component.component';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './unauthorized.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorizedComponent extends AbstractComponent implements OnInit {
  isUserAuthenticated$!: Observable<boolean>;
  isLoading$!: Observable<boolean>;

  @Input()
  canForceLogOut: boolean = false;

  @Input({ required: true })
  pageName!: string;

  params: any = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSelectors();
    this.initSubscriptions();
  }

  initSelectors(): void {
    this.isLoading$ = this.store.select(AuthSelectors.selectIsLoading);
    this.isUserAuthenticated$ = this.store
      .select(AuthSelectors.selectUser)
      .pipe(map((user) => !!user));
  }
  initSubscriptions(): void {
    this.route.fragment.pipe(takeUntil(this.destroyed$)).subscribe((f) => {
      if (f) {
        this.params = Object.fromEntries(new URLSearchParams(f));
      }
    });
  }
}
