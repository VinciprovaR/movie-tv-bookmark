import { Movie, MovieDetail, TV, TVDetail } from '../TMDB/tmdb-media.interface';
import { MovieData, TVData } from './media-data.entity.interface';

export type movieBookmarkDTOType = Movie | MovieDetail | MovieData;
export type mediaBookmarkDTOTVType = TV | TVDetail | TVData;

export type noBookmark = 'noBookmark';
export type watchListBookmark = 'watchlist';
export type watchedBookmark = 'watched';
export type rewatchBookmark = 'rewatch';
export type stillWatchingBookmark = 'watching';

export type bookmarkEnum =
  | noBookmark
  | watchListBookmark
  | watchedBookmark
  | rewatchBookmark
  | stillWatchingBookmark;

interface MediaBookmarkMap {
  [key: number]: bookmarkEnum;
}

export interface BookmarkStatus {
  key: string;
  label: string;
  description: string;
}

export interface BookmarkStatusMap {
  noBookmark: BookmarkStatus;
  watchlist: BookmarkStatus;
  rewatch: BookmarkStatus;
  watching: BookmarkStatus;
  watched: BookmarkStatus;
}

export type MovieBookmarkMap = MediaBookmarkMap;
export type TVBookmarkMap = MediaBookmarkMap;
