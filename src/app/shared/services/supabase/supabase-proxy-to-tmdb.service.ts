import { inject, Injectable } from '@angular/core';
import { from, map, tap } from 'rxjs';
import { SUPABASE_CLIENT } from '../../../providers';
import { FunctionsResponse } from '@supabase/functions-js';

import { CustomHttpErrorResponse } from '../../models/customHttpErrorResponse.model';
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

  callSupabaseFunction<T>(TMDBProxyPayload: TMDBApiPayload) {
    return from(
      this.supabase.functions.invoke('tmdb-api', {
        body: TMDBProxyPayload,
      })
    ).pipe(
      tap((result: FunctionsResponse<T>) => {
        if (result.error) {
          const error = result.error as CustomHttpErrorResponseInterface;
          throw new CustomHttpErrorResponse({
            error,
            message: error.message,
            status: error.status,
            statusText: error.statusText,
            url: error.url,
          });
        }
      }),
      map((res: FunctionsResponse<T>) => {
        return res.data as T;
      })
    );
  }
}
