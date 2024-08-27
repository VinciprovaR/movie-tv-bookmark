import { inject, Inject, Injectable } from '@angular/core';
import { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, from, map } from 'rxjs';
import { TV, TVDetail } from '../../interfaces/TMDB/tmdb-media.interface';
import { TV_Data } from '../../interfaces/supabase/entities';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomHttpErrorResponse } from '../../models/customHttpErrorResponse.model';

@Injectable({
  providedIn: 'root',
})
export class SupabaseTVDataDAO {
  private readonly supabase = inject(SUPABASE_CLIENT);

  private readonly TABLE = 'tv_data';

  constructor() {}

  findByTVId(tvId: number): Observable<TV_Data[]> {
    return from(this.supabase.from(this.TABLE).select('*').eq(`id`, tvId)).pipe(
      map((result: PostgrestSingleResponse<TV_Data[]>) => {
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

  createTVData(tvDataDTO: TV_Data): Observable<TV_Data[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .insert<TV_Data>({
          id: tvDataDTO.id,
          poster_path: tvDataDTO.poster_path,
          first_air_date: tvDataDTO.first_air_date,
          name: tvDataDTO.name,
          genre_ids: tvDataDTO.genre_ids,
        })
        .select()
    ).pipe(
      map((result: PostgrestSingleResponse<TV_Data[]>) => {
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

  updateTVData(tvDataDTO: TV): Observable<TV_Data[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .update({
          poster_path: tvDataDTO.poster_path,
          first_air_date: tvDataDTO.first_air_date,
          name: tvDataDTO.name,
        })
        .eq(`id`, tvDataDTO.id)
        .select()
    ).pipe(
      map((result: PostgrestSingleResponse<TV_Data[]>) => {
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
