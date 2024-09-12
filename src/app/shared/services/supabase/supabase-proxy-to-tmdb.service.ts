import { inject, Injectable } from '@angular/core';
import { from, map, of, switchMap, tap } from 'rxjs';
import { SUPABASE_CLIENT } from '../../../providers';
import { FunctionsResponse } from '@supabase/functions-js';
import { CustomHttpErrorResponseInterface } from '../../interfaces/customHttpErrorResponse.interface';
import { TMDBApiPayload } from '../../interfaces/supabase/supabase-proxy.interface';

/**
 * SupabaseProxyToTMDBService call a generic supabase edge function
 * used as a proxy to mask the TMDB API key and call the TMDB services.
 * TMDBApiPayload is used to determine which TMDB service call with is params.
 * TMDB service are mapped in the supabase edge function, to prevent calling
 * services that Movie&TVBookmark doesn't use.
 *
 */
@Injectable({
  providedIn: 'root',
})
export class SupabaseProxyToTMDBService {
  private readonly supabase = inject(SUPABASE_CLIENT);

  callSupabaseFunction<T>(TMDBApiPayload: TMDBApiPayload) {
    return from(
      this.supabase.functions.invoke('tmdb-api', {
        body: TMDBApiPayload,
      })
    ).pipe(
      switchMap((result: FunctionsResponse<T>) => {
        if (result.error) {
          return from(this.readStream<T>(result.error.context.body));
        }
        return of(result);
      }),
      tap((result: FunctionsResponse<T>) => {
        if (result.error) {
          throw result.error;
        }
      }),
      map((res: FunctionsResponse<T>) => {
        return res.data as T;
      })
    );
  }

  async readStream<T>(body: any): Promise<FunctionsResponse<T>> {
    const reader = body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;
    let chunks = '';
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      chunks += decoder.decode(value, { stream: !done });
    }
    const error: CustomHttpErrorResponseInterface = JSON.parse(chunks);
    return { data: null, error };
  }
}
