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

// export type bookmarkMetadata = { enum: bookmarkEnum; label: string };

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
