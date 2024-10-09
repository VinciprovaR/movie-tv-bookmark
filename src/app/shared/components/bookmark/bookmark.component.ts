import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { map, Observable, BehaviorSubject } from 'rxjs';
import { AuthSelectors } from '../../../core/store/auth';
import { LIFECYCLE_STATUS_MAP } from '../../../providers';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { scrollDirection } from '../../interfaces/layout.interface';
import {
  MovieData,
  TVData,
} from '../../interfaces/supabase/media-data.entity.interface';
import { bookmarkEnum } from '../../interfaces/supabase/supabase-bookmark.interface';
import {
  MediaType,
  Movie,
  TV,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { BookmarkDisabledDialogComponent } from '../bookmark-disabled-confirmation-dialog/bookmark-disabled-dialog.component';
import { BookmarkSelectorComponent } from '../bookmark-selector/bookmark-selector.component';

@Component({
  selector: 'app-bookmark',
  standalone: true,
  imports: [
    CommonModule,
    BookmarkSelectorComponent,
    BookmarkDisabledDialogComponent,
  ],
  templateUrl: './bookmark.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkComponent
  extends AbstractComponent
  implements OnInit, AfterViewInit
{
  readonly bookmarkStatusMap = inject(LIFECYCLE_STATUS_MAP);
  isUserAuthenticated$!: Observable<boolean>;
  bookmarkColorClass$ = new BehaviorSubject<string>('noBookmark-color');
  @Input()
  customClass: string = '';
  @Input({ required: true })
  media!: Movie | MovieData | TV | TVData;
  @Input({ required: true })
  index: number = 0;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input()
  personIdentifier: string = '';
  @Input({ required: true })
  direction: scrollDirection = 'none';
  @ViewChild('bookmark') bookmarkRef!: ElementRef;
  bookmarkStatusMapKey = 'noBookmark';
  bookmarkEnumSelectedLabel: string = this.bookmarkStatusMap.noBookmark.label;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSelectors();
  }

  ngAfterViewInit(): void {
    console.log('after init');
    this.bookmarkColorClass$.next(`${this.bookmarkStatusMapKey}-color`);
  }

  initSelectors() {
    this.isUserAuthenticated$ = this.store
      .select(AuthSelectors.selectUser)
      .pipe(map((user) => !!user));
  }

  setBookmarkStatusElement(bookmarkEnumSelected: bookmarkEnum) {
    console.log(bookmarkEnumSelected);
    this.bookmarkStatusMapKey =
      this.bookmarkStatusMap[bookmarkEnumSelected].key;
    this.bookmarkColorClass$.next(`${this.bookmarkStatusMapKey}-color`);

    this.bookmarkEnumSelectedLabel =
      this.bookmarkStatusMap[bookmarkEnumSelected].label;

    this.detectChanges();
  }
}
