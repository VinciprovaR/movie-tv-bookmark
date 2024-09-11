import { inject, Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Observable, map, switchMap, of } from 'rxjs';
import {
  Movie,
  MovieDetail,
  MovieResult,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { MediaBookmarkDTO } from '../../interfaces/supabase/DTO';
import { Movie_Data, Movie_Bookmark } from '../../interfaces/supabase/entities';
import { SupabaseMovieBookmarkDAO } from './supabase-movie-bookmark.dao';
import {
  bookmarkEnum,
  MovieBookmarkMap,
} from '../../interfaces/supabase/supabase-bookmark.interface';
import { SupabaseMovieDataDAO } from './supabase-movie-data.dao';
import { SupabaseUtilsService } from './supabase-utils.service';
import { crud_operations } from '../../interfaces/supabase/supabase-bookmark-crud-cases.interface';
import { PayloadMovieBookmark } from '../../interfaces/store/movie-bookmark-state.interface';

/**
 * SupabaseMovieBookmarkService init, find, create, update, delete bookmark
 * related to movies.
 *
 */
@Injectable({
  providedIn: 'root',
})
export class SupabaseMovieBookmarkService {
  private readonly supabaseMovieBookmarkDAO = inject(SupabaseMovieBookmarkDAO);
  private readonly supabaseUtilsService = inject(SupabaseUtilsService);
  private readonly supabaseMovieDataDAO = inject(SupabaseMovieDataDAO);

  constructor() {}

  initMovieBookmarkMapFromMovieResultTMDB(
    movieList: Movie[] | Movie_Data[] | MovieDetail[]
  ): Observable<MovieBookmarkMap> {
    let mediaIdList = this.supabaseUtilsService.buildMediaIdListMap(movieList);
    return this.supabaseMovieBookmarkDAO
      .findBookmarkListByMovieIds(mediaIdList)
      .pipe(
        map((movieBookmarkEntityList: Movie_Bookmark[]) => {
          return this.supabaseUtilsService.movieBookmarkMapFactory(
            movieBookmarkEntityList
          );
        })
      );
  }

  initMovieBookmarkMapFromMovieResultSupabase(
    movieBookmarkEntityList:
      | Movie_Bookmark[]
      | (Movie_Bookmark[] & Movie_Data[])
  ): Observable<MovieBookmarkMap> {
    return of(
      this.supabaseUtilsService.movieBookmarkMapFactory(movieBookmarkEntityList)
    );
  }

  removeMovieWithBookmark(movieResult: MovieResult) {
    let { mediaIdList, mediaIdMapIndex } =
      this.supabaseUtilsService.buildMediaIdListMapIndex(movieResult);
    return this.supabaseMovieBookmarkDAO
      .findBookmarkListByMovieIds(mediaIdList)
      .pipe(
        map((entityMediaBookmark: Movie_Bookmark[]) => {
          return this.supabaseUtilsService.removeMediaWithBookmark(
            entityMediaBookmark,
            mediaIdMapIndex,
            movieResult
          ) as MovieResult;
        })
      );
  }

  findMovieByBookmarkId(
    bookmarkEnum: bookmarkEnum,
    payload: PayloadMovieBookmark
  ): Observable<Movie_Bookmark[] & Movie_Data[]> {
    return this.supabaseMovieBookmarkDAO.findMovieByBookmarkId(
      bookmarkEnum,
      payload
    );
  }

  crudOperationResolver(
    movieBookmarkDTO: MediaBookmarkDTO<Movie | MovieDetail | Movie_Data>
  ): Observable<crud_operations> {
    return this.supabaseMovieBookmarkDAO
      .findBookmarkListByMovieIds([movieBookmarkDTO.mediaDataDTO.id])
      .pipe(
        map((movieBookmarkFromDB: Movie_Bookmark[]) => {
          let operation = this.supabaseUtilsService.checkCase(
            movieBookmarkFromDB,
            movieBookmarkDTO
          );
          if (operation === 'default') {
            throw new Error('Something went wrong. Case default');
          }
          return operation;
        })
      );
  }

  updateMovieBookmark(
    movieBookmarkDTO: MediaBookmarkDTO<Movie | MovieDetail | Movie_Data>
  ): Observable<MovieBookmarkMap> {
    return this.supabaseMovieBookmarkDAO
      .updateMovieBookmark(
        movieBookmarkDTO.bookmarkEnum,
        movieBookmarkDTO.mediaDataDTO.id
      )
      .pipe(
        map((movieBookmarkEntityList: Movie_Bookmark[]) => {
          return this.supabaseUtilsService.movieBookmarkMapFactory(
            movieBookmarkEntityList
          );
        })
      );
  }

  deleteMovieBookmark(
    movieBookmarkDTO: MediaBookmarkDTO<Movie | MovieDetail | Movie_Data>
  ): Observable<MovieBookmarkMap> {
    return this.supabaseMovieBookmarkDAO
      .updateMovieBookmark(
        movieBookmarkDTO.bookmarkEnum,
        movieBookmarkDTO.mediaDataDTO.id
      )
      .pipe(
        map((movieBookmarkEntityList: Movie_Bookmark[]) => {
          return this.supabaseUtilsService.movieBookmarkMapFactory(
            movieBookmarkEntityList
          );
        })
      );
  }

  createMovieBookmark(
    movieBookmarkDTO: MediaBookmarkDTO<Movie | MovieDetail | Movie_Data>,
    user: User
  ): Observable<MovieBookmarkMap> {
    return this.supabaseMovieDataDAO
      .findByMovieId(movieBookmarkDTO.mediaDataDTO.id)
      .pipe(
        switchMap((movieDataEntityList: Movie_Data[]) => {
          if (movieDataEntityList.length === 0) {
            let movieData: Movie_Data =
              this.supabaseUtilsService.movieDataObjFactory(
                movieBookmarkDTO.mediaDataDTO
              );
            return this.supabaseMovieDataDAO.createMovieData(movieData);
          }
          return of(movieDataEntityList);
        }),
        switchMap(() => {
          return this.supabaseMovieBookmarkDAO.createMovieBookmark(
            movieBookmarkDTO.bookmarkEnum,
            movieBookmarkDTO.mediaDataDTO.id,
            user
          );
        }),
        map((movieBookmarkEntityList: Movie_Bookmark[]) => {
          return this.supabaseUtilsService.movieBookmarkMapFactory(
            movieBookmarkEntityList
          );
        })
      );
  }

  unchangedMovieBookmark(
    movieBookmarkDTO: MediaBookmarkDTO<Movie>,
    user: User
  ): Observable<MovieBookmarkMap> {
    let movieBookmarkFromDBCustom: Movie_Bookmark = {
      bookmark_enum: 'noBookmark',
      movie_id: movieBookmarkDTO.mediaDataDTO.id,
      user_id: user.id,
    };
    return of([movieBookmarkFromDBCustom]).pipe(
      map((movieBookmarkEntityList: Movie_Bookmark[]) => {
        return this.supabaseUtilsService.movieBookmarkMapFactory(
          movieBookmarkEntityList
        );
      })
    );
  }
}
