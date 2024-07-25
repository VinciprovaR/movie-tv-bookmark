import { lifecycleEnum } from './supabase/supabase-lifecycle.interface';

export interface LinkPath {
  path: string;
  label: string;
}

export interface NavElements {
  [key: string]: { label: string; subMenu: LinkPath[] };
}

export interface LifecycleNavElement {
  path: lifecycleEnum;
  label: string;
}
