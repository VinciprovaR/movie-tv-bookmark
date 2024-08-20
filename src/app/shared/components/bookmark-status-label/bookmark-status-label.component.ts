import { Component, inject, Input } from '@angular/core';
import { LIFECYCLE_STATUS_MAP } from '../../../providers';
import { bookmarkEnum } from '../../interfaces/supabase/supabase-bookmark.interface';
import { CommonModule } from '@angular/common';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-bookmark-status-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookmark-status-label.component.html',
  styleUrl: './bookmark-status-label.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkStatusLabelComponent {
  readonly bookmarkStatusMap = inject(LIFECYCLE_STATUS_MAP);

  @Input()
  customClass: string = '';

  @Input({ required: true })
  bookmarkEnumSelected: bookmarkEnum = 'noBookmark';
}
