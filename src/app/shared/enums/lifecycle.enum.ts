import {
  lifeCycleId,
  noLifecycle,
  rewatchLifecycle,
  stillWatchingLifecycle,
  watchedLifecycle,
  watchListLifecycle,
} from '../interfaces/supabase/supabase-lifecycle.interface';

const NO_LIFECYCLE: noLifecycle = 0;
const WATCHLIST_LIFECYCLE: watchListLifecycle = 1;
const WATCHED_LIFECYCLE: watchedLifecycle = 2;
const REWATCH_LIFECYCLE: rewatchLifecycle = 3;
const STILL_WATCHING_LIFECYCLE: stillWatchingLifecycle = 4;

export const LifecycleEnum: any = {
  noLifecycle: NO_LIFECYCLE,
  watchlist: WATCHLIST_LIFECYCLE,
  watched: WATCHED_LIFECYCLE,
  rewatch: REWATCH_LIFECYCLE,
  stillWatching: STILL_WATCHING_LIFECYCLE,
};
