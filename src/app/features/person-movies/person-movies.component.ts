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

import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';
import { MovieLifecycleMap } from '../../shared/interfaces/supabase/supabase-lifecycle.interface';
import {
  Movie,
  PersonDetailMovieCredits,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import {
  MovieLifecycleSelectors,
  MovieLifecycleActions,
} from '../../shared/store/movie-lifecycle';

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
  selectMovieLifecycleMap$!: Observable<MovieLifecycleMap>;

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
    //data to lifecycle-selector, lifecycle selected
    this.selectMovieLifecycleMap$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((movieLifecycleMap) => {
        this.bridgeDataService.pushMediaLifecycleMap(movieLifecycleMap);
      });

    // data from lifecycle-selector
    this.bridgeDataService.movieInputLifecycleOptionsObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaLifecycleDTO) => {
        this.createUpdateDeleteMovieLifecycle(
          mediaLifecycleDTO as MediaLifecycleDTO<Movie>
        );
      });
  }

  override initSelectors() {
    this.selectIsLoading$ = this.personDetailMovieCreditsStore.selectIsLoading$;
    this.personDetailMovieCredits$ =
      this.personDetailMovieCreditsStore.selectCreditsMoviePersonDetail$;

    this.selectMovieLifecycleMap$ = this.store.select(
      MovieLifecycleSelectors.selectMovieLifecycleMap
    );
  }

  override initSubscriptions(): void {}

  creditsMovie() {
    this.personDetailMovieCreditsStore.movieCredits(this.personId);
  }

  createUpdateDeleteMovieLifecycle(
    mediaLifecycleDTO: MediaLifecycleDTO<Movie>
  ) {
    this.store.dispatch(
      MovieLifecycleActions.createUpdateDeleteMovieLifecycle({
        mediaLifecycleDTO,
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
