import { inject, Injectable } from '@angular/core';
import { from, map, of, switchMap, tap } from 'rxjs';
import { SUPABASE_CLIENT } from '../../../providers';
import { FunctionsResponse } from '@supabase/functions-js';
import { CustomHttpErrorResponseInterface } from '../../interfaces/customHttpErrorResponse.interface';

export interface TMDBApiPayload {
  serviceKey: string;
  pathParams?: { [key: string]: string | number };
  queryParams?: { [key: string]: string };
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseProxyToTMDBService {
  private readonly supabase = inject(SUPABASE_CLIENT);

  constructor() {}

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
