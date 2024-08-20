import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable, takeUntil } from 'rxjs';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';

import { MediaBookmarkDTO } from '../../shared/interfaces/supabase/DTO';
import { MovieBookmarkMap } from '../../shared/interfaces/supabase/supabase-bookmark.interface';
import {
  Movie,
  PersonDetailMovieCredits,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import {
  MovieBookmarkSelectors,
  MovieBookmarkActions,
} from '../../shared/store/movie-bookmark';

import { CommonModule } from '@angular/common';
import { PersonDetailMovieCreditsStore } from '../../shared/store/component-store/person-detail-movie-credits-store.service';
import { MissingFieldPlaceholderComponent } from '../../shared/components/missing-field-placeholder/missing-field-placeholder.component';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-person-movies',
  standalone: true,
  imports: [
    MediaListContainerComponent,
    CommonModule,
    MissingFieldPlaceholderComponent,
  ],
  providers: [BridgeDataService],
  templateUrl: './person-movies.component.html',
  styleUrl: './person-movies.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonMoviesComponent
  extends AbstractComponent
  implements OnInit, OnDestroy
{
  title: string = 'Movie partecipated in';

  private readonly bridgeDataService = inject(BridgeDataService);
  private readonly personDetailMovieCreditsStore = inject(
    PersonDetailMovieCreditsStore
  );

  selectIsLoading$!: Observable<boolean>;
  personDetailMovieCredits$!: Observable<PersonDetailMovieCredits>;
  selectMovieBookmarkMap$!: Observable<MovieBookmarkMap>;

  @Input({ required: true })
  personId: number = 0;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSelectors();
    this.initDataBridge();
    this.creditsMovie();
  }

  initDataBridge() {
    //data to bookmark-selector, bookmark selected
    this.selectMovieBookmarkMap$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((movieBookmarkMap) => {
        this.bridgeDataService.pushMediaBookmarkMap(movieBookmarkMap);
      });

    // data from bookmark-selector
    this.bridgeDataService.movieInputBookmarkOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaBookmarkDTO) => {
        this.createUpdateDeleteMovieBookmark(
          mediaBookmarkDTO as MediaBookmarkDTO<Movie>
        );
      });
  }

  override initSelectors() {
    this.selectIsLoading$ = this.personDetailMovieCreditsStore.selectIsLoading$;
    this.personDetailMovieCredits$ =
      this.personDetailMovieCreditsStore.selectCreditsMoviePersonDetail$;

    this.selectMovieBookmarkMap$ = this.store.select(
      MovieBookmarkSelectors.selectMovieBookmarkMap
    );
  }

  override initSubscriptions(): void {}

  creditsMovie() {
    this.personDetailMovieCreditsStore.movieCredits(this.personId);
  }

  createUpdateDeleteMovieBookmark(mediaBookmarkDTO: MediaBookmarkDTO<Movie>) {
    this.store.dispatch(
      MovieBookmarkActions.createUpdateDeleteMovieBookmark({
        mediaBookmarkDTO,
      })
    );
  }

  removeDuplicateCrewMovie(crewMovieList: Movie[]): Movie[] {
    let crewMovieIdList: number[] = [];
    return crewMovieList.filter((crewMovie) => {
      const isPresent = crewMovieIdList.indexOf(crewMovie.id) > -1;
      crewMovieIdList.push(crewMovie.id);
      return !isPresent;
    });
  }

  ngOnDestroy(): void {
    this.personDetailMovieCreditsStore.cleanPersonDetailCreditsMovie();
  }
}
