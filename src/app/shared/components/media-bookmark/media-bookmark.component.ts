import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthSelectors } from '../../../core/store/auth';
import { AbstractMediaComponent } from '../../abstract/components/abstract-media.component';
import { UnauthorizedComponent } from './../../../components/unauthorized-page/unauthorized.component';

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
})
export class MediaBookmarkComponent
  extends AbstractMediaComponent
  implements OnInit
{
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
