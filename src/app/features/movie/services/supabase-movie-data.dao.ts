import { inject, Injectable } from '@angular/core';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { from, map, Observable } from 'rxjs';
import { CustomHttpErrorResponse } from '../../../models/customHttpErrorResponse.model';
import { SUPABASE_CLIENT } from '../../../providers';
import { MovieData } from '../../../shared/interfaces/supabase/movie-data.entity.interface';
import { Movie } from '../../../shared/interfaces/TMDB/tmdb-media.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseMovieDataDAO {
  private readonly supabase = inject(SUPABASE_CLIENT);

  private readonly TABLE = 'movie_data';

  findByMovieId(movieId: number): Observable<MovieData[]> {
    return from(
      this.supabase.from(this.TABLE).select('*').eq(`id`, movieId)
    ).pipe(
      map((result: PostgrestSingleResponse<MovieData[]>) => {
        if (result.error) {
          if (result.error)
            throw new CustomHttpErrorResponse({
              error: result.error,
              message: result.error.message,
            });
        }

        return result.data;
      })
    );
  }

  createMovieData(movieDataDTO: MovieData): Observable<MovieData[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .insert<MovieData>({
          id: movieDataDTO.id,
          poster_path: movieDataDTO.poster_path,
          release_date: movieDataDTO.release_date,
          title: movieDataDTO.title,
          genre_ids: movieDataDTO.genre_ids,
        })
        .select()
    ).pipe(
      map((result: PostgrestSingleResponse<MovieData[]>) => {
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

  updateMovieData(movieDataDTO: Movie): Observable<MovieData[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .update({
          poster_path: movieDataDTO.poster_path,
          release_date: movieDataDTO.release_date,
          title: movieDataDTO.title,
        })
        .eq(`id`, movieDataDTO.id)
        .select()
    ).pipe(
      map((result: PostgrestSingleResponse<MovieData[]>) => {
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
