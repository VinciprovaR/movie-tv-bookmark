import { Injectable } from '@angular/core';
import {
  MediaBookmarkDTO,
  BookmarkOption,
} from '../../interfaces/supabase/DTO';
import {
  Bookmark_Metadata,
  Movie_Data,
  Movie_Bookmark,
  TV_Data,
  TV_Bookmark,
} from '../../interfaces/supabase/entities';
import {
  bookmarkEnum,
  MovieBookmarkMap,
  TVBookmarkMap,
} from '../../interfaces/supabase/supabase-bookmark.interface';
import {
  Movie,
  MovieDetail,
  MovieResult,
  TV,
  TVDetail,
  TVResult,
} from '../../interfaces/TMDB/tmdb-media.interface';

import { BookmarkTypeIdMap } from '../../interfaces/store/bookmark-metadata-state.interface';
import {
  crud_operations,
  BookmarkCrudConditions,
} from '../../interfaces/supabase/supabase-bookmark-crud-cases.interface';
import { Genre } from '../../interfaces/TMDB/tmdb-filters.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseUtilsService {
  private readonly LIFECYCLE_CASES: BookmarkCrudConditions = {
    noEntityANDInBookmarkSelected: 'create', //Case #0 - Create - Movie/tv doesn't have its own bookmark and bookmark selected is > 0, must create the bookmark item
    oneEntityANDNoBookmarkSelected: 'delete', //Case #1 - Delete - Movie/tv has its own bookmark and bookmark selected is == 0, must fake delete the bookmark item , update the bookmark to 0
    oneEntityANDInBookmarkSelected: 'update', //Case #2 - Update - Movie/tv has its own bookmark and bookmark selected is > 0, must update the bookmark item

    noEntityANDNoBookmarkSelected: 'unchanged', //Case #3 - Nothing - Movie/tv doesn't have its own bookmark and bookmark selected is == 0, must do nothing, count as delete return bookmark 0
    oneEntityANDInBookmarkSelectedButNoBookmarkInEntity: 'createUpdate', //  //Case #4 - Create Update - Movie/tv has its own bookmark, the bookmark is 0 and bookmark selected is > 0, must fake create the item, is an update
    default: 'default', //#Case #99/Default - Default - All cases covered, should not be possible
  };

  constructor() {}

  transformBookmarkMetadata(mediaBookmarkOptions: Bookmark_Metadata[]): {
    bookmarkOptions: BookmarkOption[];
    bookmarkTypeIdMap: BookmarkTypeIdMap;
  } {
    let bookmarkOptions: BookmarkOption[] = [];
    let bookmarkTypeIdMap: BookmarkTypeIdMap = {};
    mediaBookmarkOptions.forEach((lc) => {
      bookmarkOptions.push({ label: lc.label, value: lc.enum });
      bookmarkTypeIdMap[lc.enum] = lc.enum as bookmarkEnum;
    });

    return { bookmarkOptions, bookmarkTypeIdMap };
  }

  movieBookmarkMapFactory(
    movieBookmarkEntityList:
      | Movie_Bookmark[]
      | (Movie_Bookmark[] & Movie_Data[])
  ): MovieBookmarkMap {
    let movieBookmarkMap: MovieBookmarkMap = {};
    movieBookmarkEntityList.forEach((movieBookmarkEntity) => {
      movieBookmarkMap[movieBookmarkEntity.movie_id] =
        movieBookmarkEntity.bookmark_enum;
    });
    return movieBookmarkMap;
  }

  movieDataObjFactory(movie: Movie | Movie_Data | MovieDetail): Movie_Data {
    let movieData: Partial<Movie_Data> = {
      id: movie.id,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      title: movie.title,
    };

    if (this.isMovieDetailEntity(movie)) {
      let genre_ids: number[] = movie.genres.map((genre: Genre) => {
        return genre.id;
      });

      movieData.genre_ids = genre_ids;
    } else {
      movieData.genre_ids = movie.genre_ids;
    }
    return movieData as Movie_Data;
  }

  private isMovieDetailEntity(movie: object): movie is MovieDetail {
    return (movie as MovieDetail).genres !== undefined;
  }

  tvBookmarkMapFactory(
    tvBookmarkEntityList: TV_Bookmark[] | (TV_Bookmark[] & TV_Data[])
  ): TVBookmarkMap {
    let tvBookmarkMap: TVBookmarkMap = {};
    tvBookmarkEntityList.forEach((tvBookmarkEntity) => {
      tvBookmarkMap[tvBookmarkEntity.tv_id] = tvBookmarkEntity.bookmark_enum;
    });
    return tvBookmarkMap;
  }

  tvDataObjFactory(tv: TV | TV_Data | TVDetail): TV_Data {
    let tvData: Partial<TV_Data> = {
      id: tv.id,
      poster_path: tv.poster_path,
      first_air_date: tv.first_air_date,
      name: tv.name,
    };

    if (this.isTVDetailEntity(tv)) {
      let genre_ids: number[] = tv.genres.map((genre: Genre) => {
        return genre.id;
      });

      tvData.genre_ids = genre_ids;
    } else {
      tvData.genre_ids = tv.genre_ids;
    }
    return tvData as TV_Data;
  }

  private isTVDetailEntity(tv: object): tv is TVDetail {
    return (tv as TVDetail).genres !== undefined;
  }

  removeMediaWithBookmark(
    entityMediaBookmark: Movie_Bookmark[] | TV_Bookmark[],
    mediaIdMapIndex: { [key: number]: number },
    mediaResult: MovieResult | TVResult
  ): MovieResult | TVResult {
    let indexListToRemove: number[] = [];
    entityMediaBookmark.forEach((mlc: Movie_Bookmark | TV_Bookmark) => {
      if (mlc.bookmark_enum != 'noBookmark') {
        if (this.isMovieEntity(mlc)) {
          indexListToRemove.push(mediaIdMapIndex[mlc.movie_id]);
        } else {
          indexListToRemove.push(mediaIdMapIndex[mlc.tv_id]);
        }
      }
    });
    indexListToRemove = indexListToRemove.sort((a, b) => b - a);

    indexListToRemove.forEach((indexToRemove) => {
      mediaResult.results.splice(indexToRemove, 1);
    });
    return mediaResult;
  }

  buildMediaIdListMap(
    mediaResult:
      | Movie[]
      | TV[]
      | Movie_Data[]
      | TV_Data[]
      | MovieDetail[]
      | TVDetail[]
  ): number[] {
    let mediaIdList: number[] = [];
    for (let i = 0; i < mediaResult.length; i++) {
      mediaIdList.push(mediaResult[i].id);
    }
    return mediaIdList;
  }

  buildMediaIdListMapIndex(mediaResult: MovieResult | TVResult): {
    mediaIdList: number[];
    mediaIdMapIndex: { [key: number]: number };
  } {
    let mediaIdList: number[] = [];
    let mediaIdMapIndex: { [key: number]: number } = {};
    for (let i = 0; i < mediaResult.results.length; i++) {
      mediaIdList.push(mediaResult.results[i].id);
      mediaIdMapIndex[mediaResult.results[i].id] = i;
    }
    return { mediaIdList, mediaIdMapIndex };
  }

  checkCase(
    mediaBookmarkFromDB:
      | Movie_Bookmark[]
      | TV_Bookmark[]
      | (Movie_Bookmark[] & Movie_Data[])
      | (TV_Bookmark[] & TV_Data[]),
    mediaBookmarkDTO: MediaBookmarkDTO<
      Movie | MovieDetail | TV | TVDetail | TV_Data | Movie_Data
    >
  ): crud_operations {
    let isEntity = mediaBookmarkFromDB.length === 1;
    let isBookmarkSelected = mediaBookmarkDTO.bookmarkEnum != 'noBookmark';
    let isEntityButNoBookmarkInEntity = false;

    if (isEntity) {
      isEntityButNoBookmarkInEntity =
        mediaBookmarkFromDB[0].bookmark_enum === 'noBookmark';
    }

    let condition =
      (!isEntity && isBookmarkSelected && !isEntityButNoBookmarkInEntity
        ? 'noEntityANDInBookmarkSelected'
        : false) ||
      (isEntity && !isBookmarkSelected && !isEntityButNoBookmarkInEntity
        ? 'oneEntityANDNoBookmarkSelected'
        : false) ||
      (isEntity && isBookmarkSelected && !isEntityButNoBookmarkInEntity
        ? 'oneEntityANDInBookmarkSelected'
        : false) ||
      (isEntity && isBookmarkSelected && isEntityButNoBookmarkInEntity
        ? 'oneEntityANDInBookmarkSelectedButNoBookmarkInEntity'
        : false) ||
      (!isEntity && !isBookmarkSelected && !isEntityButNoBookmarkInEntity
        ? 'noEntityANDNoBookmarkSelected'
        : 'default');

    return this.LIFECYCLE_CASES[condition];
  }

  isMovieEntity(
    entityMediaBookmark: object
  ): entityMediaBookmark is Movie_Bookmark {
    return (entityMediaBookmark as Movie_Bookmark).movie_id !== undefined;
  }
}
