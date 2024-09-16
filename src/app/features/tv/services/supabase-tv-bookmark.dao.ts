import { inject, Injectable } from '@angular/core';
import { PostgrestSingleResponse, User } from '@supabase/supabase-js';
import { from, map, Observable } from 'rxjs';
import { SUPABASE_CLIENT } from '../../../providers';
import { CustomHttpErrorResponse } from '../../../models/customHttpErrorResponse.model';
import { PayloadTVBookmark } from '../../../shared/interfaces/store/tv-bookmark-state.interface';
import { SortyByConfig } from '../../../shared/interfaces/supabase/supabase-filter-config.interface';
import { TVBookmark } from '../../../shared/interfaces/supabase/tv-bookmark.entity.interface';
import { TVData } from '../../../shared/interfaces/supabase/tv-data.entity.interface';
import { bookmarkEnum } from '../../../shared/interfaces/supabase/supabase-bookmark.interface';

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

  findBookmarkListByTVIds(tvIdList: number[]): Observable<TVBookmark[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .select('*, ...bookmark_metadata!inner(label)')
        .in(`tv_id`, tvIdList)
    ).pipe(
      map((result: PostgrestSingleResponse<TVBookmark[]>) => {
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

  findTVByBookmarkId(
    bookmarkEnum: bookmarkEnum,
    payload: PayloadTVBookmark
  ): Observable<TVBookmark[] & TVData[]> {
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
      map((result: PostgrestSingleResponse<TVBookmark[] & TVData[]>) => {
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

  createTVBookmark(
    bookmarkEnum: bookmarkEnum,
    tvId: number,
    user: User
  ): Observable<TVBookmark[]> {
    let tvBookmark: TVBookmark = {
      user_id: user?.id,
      bookmark_enum: bookmarkEnum,
      tv_id: tvId,
    };

    return from(
      this.supabase.from(this.TABLE).insert<TVBookmark>(tvBookmark).select()
    ).pipe(
      map((result: PostgrestSingleResponse<TVBookmark[]>) => {
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

  updateTVBookmark(
    bookmarkEnum: bookmarkEnum,
    tvId: number
  ): Observable<TVBookmark[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .update({
          bookmark_enum: bookmarkEnum,
        })
        .eq(`tv_id`, tvId)
        .select()
    ).pipe(
      map((result: PostgrestSingleResponse<TVBookmark[]>) => {
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
