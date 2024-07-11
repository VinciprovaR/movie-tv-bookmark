import { Inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, from, map } from 'rxjs';
import { TV_Data } from '../../interfaces/supabase/entities/tv_data.entity.interface';
import { MediaDataDTO } from '../../interfaces/supabase/DTO';

@Injectable({
  providedIn: 'root',
})
export class SupabaseTVDataDAO {
  private readonly TABLE = 'tv_data';

  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  findByTVId(tvId: number): Observable<TV_Data[]> {
    return from(this.supabase.from(this.TABLE).select('*').eq(`id`, tvId)).pipe(
      map((result: any) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }

  //to-do user null? non possibile
  //to-do tipizzare ritorni
  createTVData(mediaDataDTO: MediaDataDTO): Observable<TV_Data[]> {
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

  updateTVData(mediaDataDTO: MediaDataDTO): Observable<TV_Data[]> {
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
