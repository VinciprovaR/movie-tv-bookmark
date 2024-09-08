import { Component, inject, Input } from '@angular/core';
import { LIFECYCLE_STATUS_MAP } from '../../../providers';
import { bookmarkEnum } from '../../interfaces/supabase/supabase-bookmark.interface';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { scrollDirection } from '../../interfaces/layout.types';

@Component({
  selector: 'app-bookmark-status-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookmark-status-label.component.html',
  styleUrl: './bookmark-status-label.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkStatusLabelComponent extends AbstractComponent {
  readonly bookmarkStatusMap = inject(LIFECYCLE_STATUS_MAP);

  @Input({ required: true })
  isUserAuthenticated!: boolean;
  @Input()
  direction: scrollDirection = 'vertical';

  constructor() {
    super();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  @Input()
  customClass: string = '';

  @Input({ required: true })
  bookmarkEnumSelected: bookmarkEnum = 'noBookmark';
}
