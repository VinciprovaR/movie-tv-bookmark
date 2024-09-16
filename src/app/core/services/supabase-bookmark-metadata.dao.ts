import { inject, Injectable } from '@angular/core';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { from, map, Observable } from 'rxjs';
import { CustomHttpErrorResponse } from '../../models/customHttpErrorResponse.model';
import { SUPABASE_CLIENT } from '../../providers';
import { BookmarkMetadata } from '../../shared/interfaces/supabase/bookmark-metadata.entity.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseMediaBookmarkMetadataDAO {
  private readonly supabase = inject(SUPABASE_CLIENT);

  findBookmarkMetadata(): Observable<BookmarkMetadata[]> {
    return from(
      this.supabase
        .from('bookmark_metadata')
        .select('*')
        .order('order', { ascending: true })
    ).pipe(
      map((result: PostgrestSingleResponse<BookmarkMetadata[]>) => {
        if (result.error)
          throw new CustomHttpErrorResponse({
            error: result.error,
            message: result.error.message,
          });
        return result.data;
      })
    );
  }
}
