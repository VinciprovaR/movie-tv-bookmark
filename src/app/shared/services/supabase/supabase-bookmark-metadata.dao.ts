import { inject, Inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, from, map, tap } from 'rxjs';
import { Bookmark_Metadata } from '../../interfaces/supabase/entities';

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
        .select('{id, enum, description, label}')
        .order('order', { ascending: true })
    ).pipe(
      map((result: any) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }
}
