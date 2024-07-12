import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LifecycleOption } from '../../interfaces/supabase/DTO';
import { Lifecycle_Metadata } from '../../interfaces/supabase/entities';
import { SupabaseUtilsService } from './supabase-utils.service';
import { SupabaseMediaLifecycleMetadataDAO } from './supabase-lifecycle-metadata.dao';
import { LifecycleTypeIdMap } from '../../interfaces/store/lifecycle-metadata-state.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseLifecycleMetadataService {
  private readonly supabaseMediaLifecycleMetadataDAO = inject(
    SupabaseMediaLifecycleMetadataDAO
  );
  private readonly supabaseUtilsService = inject(SupabaseUtilsService);

  constructor() {}

  retriveLifecycleMetadata(): Observable<{
    lifecycleOptions: LifecycleOption[];
    lifecycleTypeIdMap: LifecycleTypeIdMap;
  }> {
    return this.supabaseMediaLifecycleMetadataDAO.findLifecycleMetadata().pipe(
      map((lifecycleOptionsResult: Lifecycle_Metadata[]) => {
        return this.supabaseUtilsService.transformLifecycleMetadata(
          lifecycleOptionsResult
        );
      })
    );
  }
}
