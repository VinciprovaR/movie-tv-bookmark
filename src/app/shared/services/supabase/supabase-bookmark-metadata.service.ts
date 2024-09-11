import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BookmarkOption } from '../../interfaces/supabase/DTO';
import { BookmarkMetadata } from '../../interfaces/supabase/entities';
import { SupabaseUtilsService } from './supabase-utils.service';
import { SupabaseMediaBookmarkMetadataDAO } from './supabase-bookmark-metadata.dao';
import { BookmarkTypeIdMap } from '../../interfaces/store/bookmark-metadata-state.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseBookmarkMetadataService {
  private readonly supabaseMediaBookmarkMetadataDAO = inject(
    SupabaseMediaBookmarkMetadataDAO
  );
  private readonly supabaseUtilsService = inject(SupabaseUtilsService);

  retriveBookmarkMetadata(): Observable<{
    bookmarkOptions: BookmarkOption[];
    bookmarkTypeIdMap: BookmarkTypeIdMap;
  }> {
    return this.supabaseMediaBookmarkMetadataDAO.findBookmarkMetadata().pipe(
      map((bookmarkOptionsResult: BookmarkMetadata[]) => {
        return this.supabaseUtilsService.transformBookmarkMetadata(
          bookmarkOptionsResult
        );
      })
    );
  }
}
