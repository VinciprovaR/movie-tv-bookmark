import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseProxyToOpenAiService } from '../../../core/services/supabase-proxy-to-open-ai.service ';
import {
  Movie,
  TV,
} from '../../../shared/interfaces/TMDB/tmdb-media.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseAskOpenAiService {
  private readonly supabaseProxyToOpenAiService = inject(
    SupabaseProxyToOpenAiService
  );

  askOpenAi(query: string): Observable<Movie[] & TV[]> {
    return this.supabaseProxyToOpenAiService.callSupabaseFunction<
      Movie[] & TV[]
    >({
      userPrompt: query,
      queryParams: {
        language: 'en-US',
        include_adult: 'false',
      },
    });
  }
}
