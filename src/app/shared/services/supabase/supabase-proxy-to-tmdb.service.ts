import { inject, Injectable } from '@angular/core';
import { from, map, tap } from 'rxjs';
import { SUPABASE_CLIENT } from '../../../providers';
import { FunctionsResponse } from '@supabase/functions-js';
import { HttpErrorResponse } from '@angular/common/http';

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
          throw new HttpErrorResponse(result.error);
        }
      }),
      map((res: FunctionsResponse<T>) => {
        return res.data as T;
      })
    );
  }

  // callSupabaseFunction<T>(TMDBProxyParams: TMDBProxyParams) {
  //   return from(
  //     this.supabase.functions.invoke('tmdb-proxy', {
  //       body: TMDBProxyParams,
  //     })
  //   ).pipe(
  //     tap((result: FunctionsResponse<T>) => {
  //       if (result.error) {
  //         throw new HttpErrorResponse(result.error);
  //       }
  //     }),
  //     map((res: FunctionsResponse<T>) => {
  //       return res.data as T;
  //     })
  //   );
  // }
}
