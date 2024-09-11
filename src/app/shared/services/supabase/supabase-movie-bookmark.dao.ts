import { inject, Injectable } from '@angular/core';
import { PostgrestSingleResponse, User } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, from, map, tap } from 'rxjs';
import { bookmarkEnum } from '../../interfaces/supabase/supabase-bookmark.interface';
import { Movie_Data, Movie_Bookmark } from '../../interfaces/supabase/entities';
import { SortyByConfig } from '../../interfaces/supabase/supabase-filter-config.interface';
import { PayloadMovieBookmark } from '../../interfaces/store/movie-bookmark-state.interface';
import { CustomHttpErrorResponse } from '../../models/customHttpErrorResponse.model';

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

  constructor() {}

  findBookmarkListByMovieIds(
    movieIdList: number[]
  ): Observable<Movie_Bookmark[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .select('*, ...bookmark_metadata!inner(label)')
        .in(`movie_id`, movieIdList)
    ).pipe(
      map((result: PostgrestSingleResponse<Movie_Bookmark[]>) => {
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
  ): Observable<Movie_Bookmark[] & Movie_Data[]> {
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
      tap(
        (result: PostgrestSingleResponse<Movie_Bookmark[] & Movie_Data[]>) => {
          if (result.error) {
            throw new CustomHttpErrorResponse({
              error: result.error,
              message: result.error.message,
            });
          }
        }
      ),
      map(
        (result: PostgrestSingleResponse<Movie_Bookmark[] & Movie_Data[]>) => {
          return result.data as Movie_Bookmark[] & Movie_Data[];
        }
      )
    );
  }

  createMovieBookmark(
    bookmarkEnum: bookmarkEnum,
    movieId: number,
    user: User
  ): Observable<Movie_Bookmark[]> {
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
      map((result: PostgrestSingleResponse<Movie_Bookmark[]>) => {
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
  ): Observable<Movie_Bookmark[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .update({
          bookmark_enum: bookmarkEnum,
        })
        .eq(`movie_id`, mediaId)
        .select()
    ).pipe(
      map((result: PostgrestSingleResponse<Movie_Bookmark[]>) => {
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
