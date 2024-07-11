import { Inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, from, map } from 'rxjs';
import { Movie_Data } from '../../interfaces/supabase/entities/movie_data.entity.interface';
import { MediaDataDTO } from '../../interfaces/supabase/DTO';

@Injectable({
  providedIn: 'root',
})
export class SupabaseMovieDataDAO {
  private readonly TABLE = 'movie_data';

  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  findByMovieId(movieId: number): Observable<Movie_Data[]> {
    return from(
      this.supabase.from(this.TABLE).select('*').eq(`id`, movieId)
    ).pipe(
      map((result: any) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }

  //to-do user null? non possibile
  //to-do tipizzare ritorni
  createMovieData(mediaDataDTO: MediaDataDTO): Observable<Movie_Data[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .insert<any>({
          id: mediaDataDTO.mediaId,
          poster_path: mediaDataDTO.poster_path,
          release_date: mediaDataDTO.release_date,
          title: mediaDataDTO.title,
        })
        .select()
    ).pipe(
      map((result: any) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }

  updateMovieData(mediaDataDTO: MediaDataDTO): Observable<Movie_Data[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .update({
          poster_path: mediaDataDTO.poster_path,
          release_date: mediaDataDTO.release_date,
          title: mediaDataDTO.title,
        })
        .eq(`id`, mediaDataDTO.mediaId)
        .select()
    ).pipe(
      map((result: any) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }
}
