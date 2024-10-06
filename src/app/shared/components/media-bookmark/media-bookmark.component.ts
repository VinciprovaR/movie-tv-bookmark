import { UnauthorizedComponent } from './../../../components/unauthorized-page/unauthorized.component';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { map, Observable, skipWhile } from 'rxjs';
import { AuthSelectors } from '../../../core/store/auth';
import { SupabaseAuthEventsService } from '../../../services/supabase-auth-events.service';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

@Component({
  selector: 'app-media-bookmark',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    RouterLinkActive,
    UnauthorizedComponent,
  ],
  templateUrl: './media-bookmark.component.html',
  styleUrl: './media-bookmark.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaBookmarkComponent
  extends AbstractComponent
  implements OnInit
{
  private readonly supabaseAuthEventsService = inject(
    SupabaseAuthEventsService
  );

  ngOnInit(): void {
    this.initSelectors();
  }

  isUserAuthenticated$!: Observable<boolean>;

  initSelectors(): void {
    this.isUserAuthenticated$ = this.store
      .select(AuthSelectors.selectUser)
      .pipe(map((user) => !!user));
  }
}
