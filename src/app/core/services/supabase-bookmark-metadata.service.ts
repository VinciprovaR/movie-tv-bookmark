import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BookmarkTypeIdMap } from '../../shared/interfaces/store/bookmark-metadata-state.interface';
import { BookmarkMetadata } from '../../shared/interfaces/supabase/bookmark-metadata.entity.interface';
import { BookmarkOption } from '../../shared/interfaces/supabase/media-bookmark.DTO.interface';
import { SupabaseMediaBookmarkMetadataDAO } from './supabase-bookmark-metadata.dao';
import { SupabaseUtilsService } from './supabase-utils.service';

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
