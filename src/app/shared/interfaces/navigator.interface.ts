import { lifecycleEnum } from './supabase/supabase-lifecycle.interface';

export interface LinkPath {
  path: string;
  label: string;
}

export interface LinkPathLifecycle {
  path: lifecycleEnum;
  label: string;
}
