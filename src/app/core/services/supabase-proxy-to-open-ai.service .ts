import { inject, Injectable } from '@angular/core';
import { FunctionsResponse } from '@supabase/functions-js';
import { from, map, of, switchMap, tap } from 'rxjs';
import { SUPABASE_CLIENT } from '../../providers';
import { CustomHttpErrorResponseInterface } from '../../shared/interfaces/customHttpErrorResponse.interface';
import { OpeanAiApiPayload } from '../../shared/interfaces/supabase/supabase-proxy.interface';
import { CustomHttpErrorResponse } from '../../models/customHttpErrorResponse.model';

/**

 *
 */
@Injectable({
  providedIn: 'root',
})
export class SupabaseProxyToOpenAiService {
  private readonly supabase = inject(SUPABASE_CLIENT);

  callSupabaseFunction<T>(opeanAiApiPayload: OpeanAiApiPayload) {
    return from(
      this.supabase.functions.invoke('open-ai-api', {
        body: opeanAiApiPayload,
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
    if (body) {
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
    const error = new CustomHttpErrorResponse({
      error: 'Something went wrong',
      message: 'Something went wrong',
      status: 500,
    });
    return { data: null, error };
  }
}
