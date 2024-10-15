import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { AskAiActions, AskAiSelectors } from '.';

import { CustomHttpErrorResponseInterface } from '../../../shared/interfaces/customHttpErrorResponse.interface';
import {
  Movie,
  MovieResult,
  TV,
  TVResult,
} from '../../../shared/interfaces/TMDB/tmdb-media.interface';
import { AuthActions } from '../auth';
import { SupabaseAskOpenAiService } from '../../../features/ai/services/supabase-ask-openai.service';

@Injectable()
export class AskAiEffects {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly SupabaseAskOpenAiService = inject(SupabaseAskOpenAiService);

  askAi$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AskAiActions.askAi),
      switchMap((action) => {
        let { query } = action;
        if (query) {
          return this.SupabaseAskOpenAiService.askOpenAi(query).pipe(
            map((mediaResult: Movie[] & TV[]) => {
              return AskAiActions.askAiSuccess({
                mediaResult,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(AskAiActions.askAiFailure({ httpErrorResponse }));
              }
            )
          );
        }
        return of(AskAiActions.cleanState());
      })
    );
  });

  cleanState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        AuthActions.logoutLocalSuccess,
        AuthActions.logoutGlobalSuccess,
        AuthActions.loginSuccess
      ),
      switchMap((action) => {
        return of(AskAiActions.cleanState());
      })
    );
  });

  onAskAiSuccessMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AskAiActions.askAiSuccess),
      switchMap((action) => {
        let movieResult: MovieResult = {
          page: 1,
          total_pages: 1,
          results: [],
          total_results: 0,
        };

        for (let media of action.mediaResult) {
          if (media && this.isMovie(media)) {
            movieResult.results.push(media);
            movieResult.total_results += 1;
          }
        }

        return of(AskAiActions.askAiMovieSuccess({ movieResult }));
      })
    );
  });

  onAskAiSuccessTV$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AskAiActions.askAiSuccess),
      switchMap((action) => {
        let tvResult: TVResult = {
          page: 1,
          total_pages: 1,
          results: [],
          total_results: 0,
        };

        for (let media of action.mediaResult) {
          if (media && !this.isMovie(media)) {
            tvResult.results.push(media);
            tvResult.total_results += 1;
          }
        }

        return of(AskAiActions.askAiTVSuccess({ tvResult }));
      })
    );
  });

  isMovie(media: object): media is Movie {
    return (media as Movie).title !== undefined;
  }
}
