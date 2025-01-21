import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, distinctUntilChanged, filter, map, takeUntil } from 'rxjs';
import { BridgeDataService } from '../../../core/services/bridge-data.service';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { scrollDirection } from '../../interfaces/layout.interface';
import { BookmarkTypeIdMap } from '../../interfaces/store/bookmark-metadata-state.interface';
import { BookmarkOption } from '../../interfaces/supabase/media-bookmark.DTO.interface';
import {
  MovieData,
  TVData,
} from '../../interfaces/supabase/media-data.entity.interface';
import {
  MovieBookmarkMap,
  TVBookmarkMap,
  bookmarkEnum,
} from '../../interfaces/supabase/supabase-bookmark.interface';
import {
  MediaType,
  Movie,
  MovieDetail,
  TV,
  TVDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';

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
  styleUrl: 'bookmark-selector.component.css',
})
export class BookmarkSelectorComponent
  extends AbstractComponent
  implements OnInit
{
  private readonly fb = inject(FormBuilder);
  private readonly bridgeDataService = inject(BridgeDataService);
  mediaBookmarkMapObs$!: Observable<MovieBookmarkMap | TVBookmarkMap>;
  @Output()
  bookmarkStatusElementEmitter = new EventEmitter<bookmarkEnum>();
  @Input({ required: true })
  bookmarkOptions!: BookmarkOption[];
  @Input({ required: true })
  index: number = 0;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  mediaData!: Movie | MovieDetail | MovieData | TV | TVDetail | TVData;
  @Input()
  personIdentifier: string = '';
  @Input({ required: true })
  direction: scrollDirection = 'none';
  @Input({ required: true })
  isDetail!: boolean;
  @Input({ required: true })
  bookmarkTypeIdMap!: BookmarkTypeIdMap;
  idItem!: string;
  bookmarkControl!: FormControl<bookmarkEnum>;
  bookmarkEnumSelected: bookmarkEnum = 'noBookmark';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.idItem = `${this.index}_${this.mediaData.id}`;

    this.initSelectors();
    this.buildControl();
    this.initDataBridge();
  }

  initSelectors() {
    if (this.mediaType === 'movie') {
      this.mediaBookmarkMapObs$ =
        this.bridgeDataService.mediaBookmarkMapMovieObs$;
    } else if (this.mediaType === 'tv') {
      this.mediaBookmarkMapObs$ = this.bridgeDataService.mediaBookmarkMapTVObs$;
    }
  }

  initDataBridge() {
    this.mediaBookmarkMapObs$
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
