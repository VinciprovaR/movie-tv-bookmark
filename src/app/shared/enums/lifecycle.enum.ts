import { lifeCycleId } from '../interfaces/lifecycle.interface';

const NO_LIFECYCLE: lifeCycleId = 0;
const WATCHLIST_LIFECYCLE: lifeCycleId = 1;
const WATCHED_LIFECYCLE: lifeCycleId = 2;
const REWATCH_LIFECYCLE: lifeCycleId = 3;
const STILL_WATCHING_LIFECYCLE: lifeCycleId = 4;

export const LifecycleEnum = {
  NoLifecycle: NO_LIFECYCLE,
  WatchListLifecycle: WATCHLIST_LIFECYCLE,
  WatchedLifecycle: WATCHED_LIFECYCLE,
  RewatchLifecycle: REWATCH_LIFECYCLE,
  StillWatchingLifecycle: STILL_WATCHING_LIFECYCLE,
};
