import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonCardComponent } from '../../shared/components/person-card/person-card.component';
import { CastCrewCardComponent } from '../../shared/components/cast-crew-card/cast-crew-card.component';
import { Observable } from 'rxjs';
import { FadeScrollerDirective } from '../../shared/directives/fade-scroller.directive';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';
import {
  CastMovie,
  CrewMovie,
  MovieCredit,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { MovieDetailCreditsStore } from '../../shared/store/component-store/movie-detail-credits.store.service';
import { CastCrewCreditCardComponent } from '../../shared/components/cast-crew-credit-card/cast-crew-credit-card.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-movie-detail-credits',
  standalone: true,
  imports: [
    CommonModule,
    PersonCardComponent,
    CastCrewCardComponent,
    FadeScrollerDirective,
    CastCrewCreditCardComponent,
    MatIconModule,
  ],
  providers: [MovieDetailCreditsStore],
  templateUrl: './movie-detail-credits.component.html',
  styleUrl: './movie-detail-credits.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailCreditsComponent
  extends AbstractComponent
  implements OnInit
{
  private readonly movieDetailCreditsStore = inject(MovieDetailCreditsStore);
  movieCredits$!: Observable<MovieCredit | null>;
  @Input()
  movieId: number = 0;
  isHideCastContainer: boolean = false;
  isHideCrewContainer: boolean = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSelectors();
    this.searchMovieCredits();
  }

  initSelectors() {
    this.movieCredits$ = this.movieDetailCreditsStore.selectMovieCredits$;
  }

  searchMovieCredits() {
    this.movieDetailCreditsStore.searchMovieCredits(this.movieId);
  }

  toggleCast() {
    this.isHideCastContainer = !this.isHideCastContainer;
  }
  toggleCrew() {
    this.isHideCrewContainer = !this.isHideCrewContainer;
  }

  // private buildCharacterTV(cast: CastTV): string {
  //   let roleResult = '';
  //   cast.roles.forEach((role: Role, i, array) => {
  //     if (i === array.length - 1) {
  //       roleResult = roleResult.concat(role.character);
  //     } else {
  //       roleResult = roleResult.concat(role.character, ' / ');
  //     }
  //   });
  //   return roleResult;
  // }

  // private buildJobTV(crew: CrewTV): string {
  //   let roleResult = '';
  //   crew.jobs.forEach((job: Job, i, array) => {
  //     if (i === array.length - 1) {
  //       roleResult = roleResult.concat(job.job);
  //     } else {
  //       roleResult = roleResult.concat(job.job, ' / ');
  //     }
  //   });
  //   return roleResult;
  // }

  private buildCharacterMovie(cast: CastMovie): string {
    return cast.character;
  }

  private buildJobMovie(crew: CrewMovie): string {
    return crew.job;
  }
}
