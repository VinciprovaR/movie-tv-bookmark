import { inject, Injectable } from '@angular/core';
import { PostgrestSingleResponse, User } from '@supabase/supabase-js';
import { from, map, Observable, tap } from 'rxjs';
import { SUPABASE_CLIENT } from '../../../providers';
import { bookmarkEnum } from '../../../shared/interfaces/supabase/supabase-bookmark.interface';
import { CustomHttpErrorResponse } from '../../../models/customHttpErrorResponse.model';
import { PayloadMovieBookmark } from '../../../shared/interfaces/store/movie-bookmark-state.interface';
import { MovieBookmark } from '../../../shared/interfaces/supabase/movie-bookmark.entity.interface';
import { MovieData } from '../../../shared/interfaces/supabase/movie-data.entity.interface';
import { SortyByConfig } from '../../../shared/interfaces/supabase/supabase-filter-config.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseMovieBookmarkDAO {
  private readonly supabase = inject(SUPABASE_CLIENT);

  readonly orderByConfigSupabase: SortyByConfig = {
    'primary_release_date.desc': {
      field: 'movie_data(release_date)',
      rule: { ascending: false },
    },
    'primary_release_date.asc': {
      field: 'movie_data(release_date)',
      rule: { ascending: true },
    },
    'title.desc': { field: 'movie_data(title)', rule: { ascending: false } },
    'title.asc': { field: 'movie_data(title)', rule: { ascending: true } },
  };

  private readonly TABLE = 'movie_bookmark';

  findBookmarkListByMovieIds(
    movieIdList: number[]
  ): Observable<MovieBookmark[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .select('*, ...bookmark_metadata!inner(label)')
        .in(`movie_id`, movieIdList)
    ).pipe(
      map((result: PostgrestSingleResponse<MovieBookmark[]>) => {
        if (result.error) {
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: result.error.message,
          });
        }

        return result.data;
      })
    );
  }

  findMovieByBookmarkId(
    bookmarkEnum: bookmarkEnum,
    payload: PayloadMovieBookmark
  ): Observable<MovieBookmark[] & MovieData[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .select(
          '*, ...movie_data!inner(id, poster_path, release_date, title, genre_ids)'
        )
        .contains('movie_data.genre_ids', payload.genreIdList)
        .eq(`bookmark_enum`, bookmarkEnum)
        .order(
          this.orderByConfigSupabase[payload.sortBy].field,
          this.orderByConfigSupabase[payload.sortBy].rule
        )
    ).pipe(
      tap((result: PostgrestSingleResponse<MovieBookmark[] & MovieData[]>) => {
        if (result.error) {
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: result.error.message,
          });
        }
      }),
      map((result: PostgrestSingleResponse<MovieBookmark[] & MovieData[]>) => {
        return result.data as MovieBookmark[] & MovieData[];
      })
    );
  }

  createMovieBookmark(
    bookmarkEnum: bookmarkEnum,
    movieId: number,
    user: User
  ): Observable<MovieBookmark[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .insert<any>({
          user_id: user.id,
          bookmark_enum: bookmarkEnum,
          movie_id: movieId,
        })
        .select()
    ).pipe(
      map((result: PostgrestSingleResponse<MovieBookmark[]>) => {
        if (result.error) {
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: result.error.message,
          });
        }

        return result.data;
      })
    );
  }

  updateMovieBookmark(
    bookmarkEnum: bookmarkEnum,
    mediaId: number
  ): Observable<MovieBookmark[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .update({
          bookmark_enum: bookmarkEnum,
        })
        .eq(`movie_id`, mediaId)
        .select()
    ).pipe(
      map((result: PostgrestSingleResponse<MovieBookmark[]>) => {
        if (result.error) {
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: result.error.message,
          });
        }

        return result.data;
      })
    );
  }
}
