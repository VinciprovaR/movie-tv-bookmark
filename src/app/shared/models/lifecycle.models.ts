export type noLifecycle = 0;
export type watchListLifecycle = 1;
export type watchedLifecycle = 2;
export type rewatchLifecycle = 3;
export type stillWatchingLifecycle = 4;

export type lifeCycleId =
  | noLifecycle
  | watchListLifecycle
  | watchedLifecycle
  | rewatchLifecycle
  | stillWatchingLifecycle;

export const LifecycleIdEnum = {
  NoLifecycle: 0 as noLifecycle,
  WatchListLifecycle: 1 as watchListLifecycle,
  WatchedLifecycle: 2 as watchedLifecycle,
  RewatchLifecycle: 3 as rewatchLifecycle,
  StillWatchingLifecycle: 4 as stillWatchingLifecycle,
};
