import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { map, Observable, takeUntil } from 'rxjs';
import { AuthSelectors } from '../../../core/store/auth';
import { BookmarkMetadataSelectors } from '../../../core/store/bookmark-metadata';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { scrollDirection } from '../../interfaces/layout.interface';
import { BookmarkTypeIdMap } from '../../interfaces/store/bookmark-metadata-state.interface';
import { BookmarkOption } from '../../interfaces/supabase/media-bookmark.DTO.interface';
import {
  MovieData,
  TVData,
} from '../../interfaces/supabase/media-data.entity.interface';
import { bookmarkEnum } from '../../interfaces/supabase/supabase-bookmark.interface';
import {
  MediaType,
  Movie,
  MovieDetail,
  TV,
  TVDetail,
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
export class BookmarkComponent extends AbstractComponent implements OnInit {
  bookmarkTypeIdMap!: BookmarkTypeIdMap;
  bookmarkTypeIdMap$!: Observable<BookmarkTypeIdMap>;
  isUserAuthenticated$!: Observable<boolean>;
  bookmarkOptions$!: Observable<BookmarkOption[]>;

  @Output()
  bookmarkLabelEmitter = new EventEmitter<BookmarkOption>();

  @Input()
  customClass: string = '';
  @Input({ required: true })
  media!: Movie | MovieData | TV | TVData | MovieDetail | TVDetail;
  @Input({ required: true })
  index: number = 0;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input()
  personIdentifier: string = '';
  @Input({ required: true })
  direction: scrollDirection = 'none';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSelectors();
    this.initSubscriptions();
  }

  initSelectors() {
    this.isUserAuthenticated$ = this.store
      .select(AuthSelectors.selectUser)
      .pipe(map((user) => !!user));

    this.bookmarkOptions$ = this.store.select(
      BookmarkMetadataSelectors.selectBookmarkOptions
    );

    this.bookmarkTypeIdMap$ = this.store.select(
      BookmarkMetadataSelectors.selectBookmarkTypeIdMap
    );
  }

  initSubscriptions() {
    this.bookmarkTypeIdMap$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((bookmarkTypeIdMap: BookmarkTypeIdMap) => {
        this.bookmarkTypeIdMap = bookmarkTypeIdMap;

        this.bookmarkLabelEmitter.emit(this.bookmarkTypeIdMap['noBookmark']);
      });
  }

  setBookmarkStatusElement(bookmarkEnumSelected: bookmarkEnum) {
    this.bookmarkLabelEmitter.emit(
      this.bookmarkTypeIdMap[bookmarkEnumSelected]
    );

    //this.detectChanges();
  }
}
