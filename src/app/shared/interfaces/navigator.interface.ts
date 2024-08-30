import { bookmarkEnum } from './supabase/supabase-bookmark.interface';

export interface LinkPath {
  path: string;
  label: string;
  needAuth: boolean;
}

export interface NavElements {
  [key: string]: {
    single: boolean;
    label: string;
    subMenu?: LinkPath[];
    paths: string[];
    needAuth: boolean;
    onlyNonAuth: boolean;
  };
}

export interface BookmarkNavElement {
  path: bookmarkEnum;
  label: string;
}
