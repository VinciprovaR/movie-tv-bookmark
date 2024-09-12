import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  bookmarkEnum,
  MovieBookmarkMap,
  TVBookmarkMap,
} from '../../interfaces/supabase/supabase-bookmark.interface';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, distinctUntilChanged, filter, map, takeUntil } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BridgeDataService } from '../../services/bridge-data.service';
import { BookmarkOption } from '../../interfaces/supabase/DTO';
import {
  MediaType,
  Movie,
  MovieDetail,
  TV,
  TVDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { BookmarkMetadataSelectors } from '../../store/bookmark-metadata';
import { MovieData, TVData } from '../../interfaces/supabase/entities';
import { MatIconModule } from '@angular/material/icon';
import { LIFECYCLE_STATUS_MAP } from '../../../providers';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { scrollDirection } from '../../interfaces/layout.interface';

@Component({
  selector: 'app-bookmark-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './bookmark-selector.component.html',
  styleUrl: './bookmark-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkSelectorComponent
  extends AbstractComponent
  implements OnInit
{
  private readonly fb = inject(FormBuilder);
  private readonly bridgeDataService = inject(BridgeDataService);
  readonly bookmarkStatusMap = inject(LIFECYCLE_STATUS_MAP);

  bookmarkOptions$!: Observable<BookmarkOption[]>;

  @Output()
  bookmarkStatusElementEmitter = new EventEmitter<bookmarkEnum>();

  @Input({ required: true })
  index!: number;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  mediaData!: Movie | MovieDetail | MovieData | TV | TVDetail | TVData;
  @Input()
  personIdentifier: string = '';
  @Input({ required: true })
  direction: scrollDirection = 'none';

  idItem!: string;

  bookmarkControl!: FormControl<bookmarkEnum>;

  bookmarkEnumSelected: bookmarkEnum = 'noBookmark';

  @Input({ required: true })
  isDetail!: boolean;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.idItem = this.personIdentifier
      ? `${this.personIdentifier}_`
      : '' + `${this.index}_${this.mediaData.id}`;

    this.initSelectors();
    this.buildControl();
    this.initDataBridge();
  }

  initSelectors() {
    this.bookmarkOptions$ = this.store.select(
      BookmarkMetadataSelectors.selectBookmarkOptions
    );
  }

  initDataBridge() {
    this.bridgeDataService.mediaBookmarkMapObs$
      .pipe(
        takeUntil(this.destroyed$),
        distinctUntilChanged(),
        filter((mediaBookmarkMap: MovieBookmarkMap | TVBookmarkMap) => {
          return (
            mediaBookmarkMap &&
            (mediaBookmarkMap[this.mediaData.id] != null ||
              mediaBookmarkMap[this.mediaData.id] != undefined)
          );
        }),
        map((mediaBookmarkMap: MovieBookmarkMap | TVBookmarkMap) => {
          return mediaBookmarkMap[this.mediaData.id];
        })
      )
      .subscribe((bookmarkEnum: bookmarkEnum) => {
        this.updatedBookmarkChange(bookmarkEnum);
        this.updateControlValue(bookmarkEnum);
      });
  }

  buildControl() {
    this.bookmarkControl = this.fb.control('noBookmark', {
      nonNullable: true,
    });

    this.bookmarkControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((bookmarkEnum) => {
        this.notifyBookmarkChange(bookmarkEnum);
      });
  }

  notifyBookmarkChange(bookmarkEnum: bookmarkEnum) {
    this.bridgeDataService.pushInputBookmarkOptions(this.mediaType, {
      mediaDataDTO: this.mediaData,
      bookmarkEnum: bookmarkEnum,
    });
  }

  updatedBookmarkChange(bookmarkEnum: bookmarkEnum) {
    this.bookmarkEnumSelected = bookmarkEnum;
    this.bookmarkStatusElementEmitter.emit(bookmarkEnum);
  }

  updateControlValue(bookmarkEnum: bookmarkEnum) {
    this.bookmarkControl.setValue(bookmarkEnum, {
      emitEvent: false,
    });
  }
}
