import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Observable, takeUntil } from 'rxjs';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import {
  MediaType,
  Movie,
  TV,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { scrollDirection } from '../../interfaces/layout.interface';
import {
  MovieData,
  TVData,
} from '../../interfaces/supabase/media-data.entity.interface';
import { MediaCardComponent } from '../media-card/media-card.component';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';
import { NoSearchFoundComponent } from '../no-search-found/no-search-found.component';
import { TypeSuggestionComponent } from '../type-suggestion/type-suggestion.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-media-list-container',
  standalone: true,
  imports: [
    CommonModule,
    MediaCardComponent,
    InfiniteScrollModule,
    NoSearchFoundComponent,
    MatProgressSpinnerModule,
    MissingFieldPlaceholderComponent,
    TypeSuggestionComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './media-list-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaListContainerComponent
  extends AbstractComponent
  implements OnInit
{
  @Output()
  emitDiscoveryAdditionalMedia = new EventEmitter<number>();
  @Input({ required: true })
  isLoading!: boolean;
  @Input()
  noAdditional: boolean = false;
  @Input({ required: true })
  mediaList!: Movie[] | MovieData[] | TV[] | TVData[];
  @Input({ required: true })
  mediaType!: MediaType;
  @Input()
  captionNotFoundCustom!: string;
  @Input()
  scrollSelf: boolean = false;
  @Input()
  includeScrollEvents: boolean = true;
  @Input({ required: true })
  direction: scrollDirection = 'none';
  @Input()
  personIdentifier: string = '';
  @Input({ required: true })
  allowButtonAdditionalMedia!: boolean;
  @Input()
  elSm!: HTMLElement;
  @Input()
  elXl!: HTMLElement;
  @Input()
  selectScrollTo$!: Observable<null>;
  @Input()
  query!: string;
  @Input()
  loadingSpinnerText: string = 'Loading...';
  @ViewChildren('itemsLi') itemsLi!: QueryList<ElementRef>;
  titleNotFound!: string;
  captionNotFound!: string;
  ulContainerClass: string = '';
  noMoreAdditionalCaption: string = '';
  searchAdditionalButtonLabel: string = '';
  scrollTo = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    const mediaTypeLbl =
      this.mediaType === 'multi' ? 'movies or tv shows' : this.mediaType;
    this.searchAdditionalButtonLabel = `Search for additional ${mediaTypeLbl}`;
    this.captionNotFound = this.captionNotFoundCustom
      ? this.captionNotFoundCustom
      : `We couldn't find any ${mediaTypeLbl} matching your search. Try searching with different keywords`;
    this.titleNotFound = `No ${mediaTypeLbl} found`;
    this.noMoreAdditionalCaption = `There are no more additional ${mediaTypeLbl} for this query`;
    this.initSubscriptions();
  }

  ngAfterViewInit(): void {
    this.checkRenderingStatus();
  }

  ngAfterViewChecked(): void {
    this.checkRenderingStatus();
  }

  private checkRenderingStatus(): void {
    if (this.itemsLi.length === this.mediaList.length && this.scrollTo) {
      this.scrollTo = false;
      this.scroll(this.elSm, this.elXl, 80);
    }
  }

  initSubscriptions() {
    if (this.elSm && this.elXl) {
      this.selectScrollTo$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
        this.scrollTo = true;
      });
    }
  }

  discoveryAdditionalMedia() {
    if (this.mediaList.length && !this.noAdditional) {
      this.emitDiscoveryAdditionalMedia.emit(this.mediaList.length);
    }
  }

  evaluateMediaType(media: Movie | MovieData | TV | TVData): MediaType {
    if (this.mediaType === 'multi') {
      if (this.isMovie(media)) {
        return 'movie';
      }
      return 'tv';
    }

    return this.mediaType;
  }

  isMovie(media: object): media is Movie | MovieData {
    return (
      (media as Movie).title !== undefined ||
      (media as MovieData).title !== undefined
    );
  }
}
