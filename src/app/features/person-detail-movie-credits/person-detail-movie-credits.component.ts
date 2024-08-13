import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable, takeUntil } from 'rxjs';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';

import { MediaLifecycleDTO } from '../../shared/interfaces/supabase/DTO';
import { MovieLifecycleMap } from '../../shared/interfaces/supabase/supabase-lifecycle.interface';
import { Movie } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import {
  MovieLifecycleSelectors,
  MovieLifecycleActions,
} from '../../shared/store/movie-lifecycle';

import { CommonModule } from '@angular/common';
import { PersonDetailCreditsMovieStore } from '../../shared/store/component-store/person-detail-movie-credits-store.service';

@Component({
  selector: 'app-person-detail-movie-credits',
  standalone: true,
  imports: [MediaListContainerComponent, CommonModule],
  providers: [BridgeDataService, PersonDetailCreditsMovieStore],
  templateUrl: './person-detail-movie-credits.component.html',
  styleUrl: './person-detail-movie-credits.component.css',
})
export class PersonDetailMovieCreditsComponent implements OnInit {
  title: string = 'Movie partecipated in';

  private readonly destroyRef$ = inject(DestroyRef);
  private readonly store = inject(Store);
  private readonly bridgeDataService = inject(BridgeDataService);
  private readonly personDetailCreditsMovieStore = inject(
    PersonDetailCreditsMovieStore
  );
  destroyed$ = new Subject();

  selectIsLoading$!: Observable<boolean>;
  selectMovieList$!: Observable<Movie[]>;
  selectMovieLifecycleMap$!: Observable<MovieLifecycleMap>;

  @Input({ required: true })
  personId: number = 0;

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
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

  initSelectors() {
    this.selectIsLoading$ = this.personDetailCreditsMovieStore.selectIsLoading$;
    this.selectMovieList$ =
      this.personDetailCreditsMovieStore.selectCreditsMoviePersonDetail$;

    this.selectMovieLifecycleMap$ = this.store.select(
      MovieLifecycleSelectors.selectMovieLifecycleMap
    );
  }

  creditsMovie() {
    this.personDetailCreditsMovieStore.creditsMovie(this.personId);
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
}
