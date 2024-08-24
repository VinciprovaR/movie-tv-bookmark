import { inject, Injectable } from '@angular/core';
import { from, map, tap } from 'rxjs';
import { SUPABASE_CLIENT } from '../../../providers';
import { FunctionsResponse } from '@supabase/functions-js';
import { HttpErrorResponse } from '@angular/common/http';

export interface TMDBProxyParams {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  pathKey: string;
  pathParam?: string;
  queryStrings: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseProxyToTMDBService {
  private readonly supabase = inject(SUPABASE_CLIENT);

  constructor() {}

  callSupabaseFunction<T>(TMDBProxyParams: TMDBProxyParams) {
    return from(
      this.supabase.functions.invoke('tmdb-proxy', {
        body: TMDBProxyParams,
      })
    ).pipe(
      tap((result: FunctionsResponse<T>) => {
        if (result.error) {
          throw new HttpErrorResponse(result.error);
        }
      }),
      map((res: FunctionsResponse<T>) => {
        return res.data as T;
      })
    );
  }
}
