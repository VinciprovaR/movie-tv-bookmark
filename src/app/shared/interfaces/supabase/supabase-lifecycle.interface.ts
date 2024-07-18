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

interface MediaLifecycleMap {
  [key: number]: lifecycleEnum;
}

export type MovieLifecycleMap = MediaLifecycleMap;
export type TVLifecycleMap = MediaLifecycleMap;
