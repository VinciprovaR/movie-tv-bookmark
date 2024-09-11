import { inject, Injectable } from '@angular/core';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, from, map } from 'rxjs';
import { TV } from '../../interfaces/TMDB/tmdb-media.interface';
import { TVData } from '../../interfaces/supabase/entities';

import { CustomHttpErrorResponse } from '../../models/customHttpErrorResponse.model';

@Injectable({
  providedIn: 'root',
})
export class SupabaseTVDataDAO {
  private readonly supabase = inject(SUPABASE_CLIENT);

  private readonly TABLE = 'tv_data';

  findByTVId(tvId: number): Observable<TVData[]> {
    return from(this.supabase.from(this.TABLE).select('*').eq(`id`, tvId)).pipe(
      map((result: PostgrestSingleResponse<TVData[]>) => {
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

  createTVData(tvDataDTO: TVData): Observable<TVData[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .insert<TVData>({
          id: tvDataDTO.id,
          poster_path: tvDataDTO.poster_path,
          first_air_date: tvDataDTO.first_air_date,
          name: tvDataDTO.name,
          genre_ids: tvDataDTO.genre_ids,
        })
        .select()
    ).pipe(
      map((result: PostgrestSingleResponse<TVData[]>) => {
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

  updateTVData(tvDataDTO: TV): Observable<TVData[]> {
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
      map((result: PostgrestSingleResponse<TVData[]>) => {
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
