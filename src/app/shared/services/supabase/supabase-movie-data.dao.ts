import { inject, Injectable } from '@angular/core';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, from, map } from 'rxjs';
import { Movie } from '../../interfaces/TMDB/tmdb-media.interface';
import { Movie_Data } from '../../interfaces/supabase/entities';

@Injectable({
  providedIn: 'root',
})
export class SupabaseMovieDataDAO {
  private readonly supabase = inject(SUPABASE_CLIENT);

  private readonly TABLE = 'movie_data';

  constructor() {}

  findByMovieId(movieId: number): Observable<Movie_Data[]> {
    return from(
      this.supabase.from(this.TABLE).select('*').eq(`id`, movieId)
    ).pipe(
      map((result: PostgrestSingleResponse<Movie_Data[]>) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }

  createMovieData(movieDataDTO: Movie_Data): Observable<Movie_Data[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .insert<Movie_Data>({
          id: movieDataDTO.id,
          poster_path: movieDataDTO.poster_path,
          release_date: movieDataDTO.release_date,
          title: movieDataDTO.title,
          genre_ids: movieDataDTO.genre_ids,
        })
        .select()
    ).pipe(
      map((result: PostgrestSingleResponse<Movie_Data[]>) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }

  updateMovieData(movieDataDTO: Movie): Observable<Movie_Data[]> {
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
      map((result: PostgrestSingleResponse<Movie_Data[]>) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }
}
