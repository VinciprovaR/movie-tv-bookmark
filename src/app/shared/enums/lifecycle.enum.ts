import {
  lifeCycleId,
  noLifecycle,
  rewatchLifecycle,
  stillWatchingLifecycle,
  watchedLifecycle,
  watchListLifecycle,
} from '../interfaces/lifecycle.interface';

const NO_LIFECYCLE: noLifecycle = 0;
const WATCHLIST_LIFECYCLE: watchListLifecycle = 1;
const WATCHED_LIFECYCLE: watchedLifecycle = 2;
const REWATCH_LIFECYCLE: rewatchLifecycle = 3;
const STILL_WATCHING_LIFECYCLE: stillWatchingLifecycle = 4;

export const LifecycleEnum = {
  NoLifecycle: NO_LIFECYCLE,
  WatchListLifecycle: WATCHLIST_LIFECYCLE,
  WatchedLifecycle: WATCHED_LIFECYCLE,
  RewatchLifecycle: REWATCH_LIFECYCLE,
  StillWatchingLifecycle: STILL_WATCHING_LIFECYCLE,
};
