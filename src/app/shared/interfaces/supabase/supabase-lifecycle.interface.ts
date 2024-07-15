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

interface MediaLifecycleMap {
  [key: number]: lifeCycleId;
}

export type MovieLifecycleMap = MediaLifecycleMap;
export type TVLifecycleMap = MediaLifecycleMap;
