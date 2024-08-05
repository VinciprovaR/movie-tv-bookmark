export type noLifecycle = 'noLifecycle';
export type watchListLifecycle = 'watchlist';
export type watchedLifecycle = 'watched';
export type rewatchLifecycle = 'rewatch';
export type stillWatchingLifecycle = 'watching';

export type lifecycleEnum =
  | noLifecycle
  | watchListLifecycle
  | watchedLifecycle
  | rewatchLifecycle
  | stillWatchingLifecycle;

// export type lifecycleMetadata = { enum: lifecycleEnum; label: string };

interface MediaLifecycleMap {
  [key: number]: lifecycleEnum;
}

export interface LifecycleStatus {
  key: string;
  label: string;
  description: string;
}

export interface LifecycleStatusMap {
  noLifecycle: LifecycleStatus;
  watchlist: LifecycleStatus;
  rewatch: LifecycleStatus;
  watching: LifecycleStatus;
  watched: LifecycleStatus;
}

export type MovieLifecycleMap = MediaLifecycleMap;
export type TVLifecycleMap = MediaLifecycleMap;
