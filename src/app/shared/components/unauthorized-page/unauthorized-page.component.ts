import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { map, Observable, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { AuthSelectors } from '../../store/auth';

@Component({
  selector: 'app-unauthorized-page',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './unauthorized-page.component.html',
  styleUrl: './unauthorized-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorizedPageComponent
  extends AbstractComponent
  implements OnInit
{
  isUserAuthenticated$!: Observable<boolean>;
  isLoading$!: Observable<boolean>;

  params: any = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
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
