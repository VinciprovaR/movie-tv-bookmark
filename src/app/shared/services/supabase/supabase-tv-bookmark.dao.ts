import { inject, Inject, Injectable } from '@angular/core';
import { PostgrestSingleResponse, User } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, from, map, tap } from 'rxjs';
import { TV_Data, TV_Bookmark } from '../../interfaces/supabase/entities';
import { bookmarkEnum } from '../../interfaces/supabase/supabase-bookmark.interface';

import { SortyByConfig } from '../../interfaces/supabase/supabase-filter-config.interface';
import { PayloadTVBookmark } from '../../interfaces/store/tv-bookmark-state.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseTVBookmarkDAO {
  private readonly supabase = inject(SUPABASE_CLIENT);

  private readonly TABLE = 'tv_bookmark';

  readonly orderByConfigSupabase: SortyByConfig = {
    'first_air_date.desc': {
      field: 'tv_data(first_air_date)',
      rule: { ascending: false },
    },
    'first_air_date.asc': {
      field: 'tv_data(first_air_date)',
      rule: { ascending: true },
    },
    'name.desc': { field: 'tv_data(name)', rule: { ascending: false } },
    'name.asc': { field: 'tv_data(name)', rule: { ascending: true } },
  };

  constructor() {}

  findBookmarkListByTVIds(tvIdList: number[]): Observable<TV_Bookmark[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .select('*, ...bookmark_metadata!inner(label)')
        .in(`tv_id`, tvIdList)
    ).pipe(
      map((result: PostgrestSingleResponse<TV_Bookmark[]>) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }

  findTVByBookmarkId(
    bookmarkEnum: bookmarkEnum,
    payload: PayloadTVBookmark
  ): Observable<TV_Bookmark[] & TV_Data[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .select(
          '*, ...tv_data!inner(id, poster_path, first_air_date, name, genre_ids)'
        )
        .contains('tv_data.genre_ids', payload.genreIdList)
        .eq(`bookmark_enum`, bookmarkEnum)
        .order(
          this.orderByConfigSupabase[payload.sortBy].field,
          this.orderByConfigSupabase[payload.sortBy].rule
        )
    ).pipe(
      map((result: PostgrestSingleResponse<TV_Bookmark[] & TV_Data[]>) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }

  //to-do user null? non possibile
  //to-do tipizzare ritorni
  createTVBookmark(
    bookmarkEnum: bookmarkEnum,
    tvId: number,
    user: User
  ): Observable<TV_Bookmark[]> {
    let tvBookmark: TV_Bookmark = {
      user_id: user?.id,
      bookmark_enum: bookmarkEnum,
      tv_id: tvId,
    };

    return from(
      this.supabase.from(this.TABLE).insert<TV_Bookmark>(tvBookmark).select()
    ).pipe(
      map((result: PostgrestSingleResponse<TV_Bookmark[]>) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }

  updateTVBookmark(
    bookmarkEnum: bookmarkEnum,
    tvId: number
  ): Observable<TV_Bookmark[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .update({
          bookmark_enum: bookmarkEnum,
        })
        .eq(`tv_id`, tvId)
        .select()
    ).pipe(
      map((result: PostgrestSingleResponse<TV_Bookmark[]>) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }

  deleteTVBookmark(
    tvId: number,
    bookmarkEnum: bookmarkEnum
  ): Observable<TV_Bookmark[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .update({
          bookmark_enum: bookmarkEnum,
        })
        .eq(`tv_id`, tvId)
        .select()
    ).pipe(
      map((result: PostgrestSingleResponse<TV_Bookmark[]>) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }
}
