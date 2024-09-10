import { inject, Injectable } from '@angular/core';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, from, map } from 'rxjs';
import { Bookmark_Metadata } from '../../interfaces/supabase/entities';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { CustomHttpErrorResponse } from '../../models/customHttpErrorResponse.model';

@Injectable({
  providedIn: 'root',
})
export class SupabaseMediaBookmarkMetadataDAO {
  private readonly supabase = inject(SUPABASE_CLIENT);

  constructor() {}

  findBookmarkMetadata(): Observable<Bookmark_Metadata[]> {
    return from(
      this.supabase
        .from('bookmark_metadata')
        .select('*')
        .order('order', { ascending: true })
    ).pipe(
      map((result: PostgrestSingleResponse<Bookmark_Metadata[]>) => {
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
