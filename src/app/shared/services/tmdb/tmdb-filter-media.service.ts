import { inject, Injectable } from '@angular/core';
import {
  Certification,
  CertificationResult,
  Genre,
  GenresResult,
  Language,
} from '../../interfaces/TMDB/tmdb-filters.interface';
import { map, Observable } from 'rxjs';
import { SupabaseProxyToTMDBService } from '../supabase/supabase-proxy-to-tmdb.service';

@Injectable({
  providedIn: 'root',
})
export class TMDBFilterMediaService {
  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

  retriveGenreMovieList(): Observable<Genre[]> {
    return this.supabaseProxyToTMDBService
      .callSupabaseFunction<GenresResult>({
        serviceKey: `/genre/movie/list`,
        queryParams: {
          language: 'en-US',
        },
      })
      .pipe(
        map((genreResult: GenresResult) => {
          return genreResult.genres;
        })
      );
  }

  retriveCertificationMovieList(): Observable<Certification[]> {
    return this.supabaseProxyToTMDBService
      .callSupabaseFunction<CertificationResult>({
        serviceKey: `/certification/movie/list`,
      })
      .pipe(
        map((certificationResult: CertificationResult) => {
          //not i18e
          return certificationResult.certifications['US'];
        })
      );
  }

  retriveGenreTVList(): Observable<Genre[]> {
    return this.supabaseProxyToTMDBService
      .callSupabaseFunction<GenresResult>({
        serviceKey: `/genre/tv/list`,
        queryParams: {
          language: 'en-US',
        },
      })
      .pipe(
        map((genreResult: GenresResult) => {
          return genreResult.genres;
        })
      );
  }

  retriveLanguagesList(): Observable<Language[]> {
    return this.supabaseProxyToTMDBService
      .callSupabaseFunction<Language[]>({
        serviceKey: `/configuration/languages`,
      })
      .pipe(
        map((result) => {
          result.sort((a, b) => a.english_name.localeCompare(b.english_name));
          return result;
        })
      );
  }
}
