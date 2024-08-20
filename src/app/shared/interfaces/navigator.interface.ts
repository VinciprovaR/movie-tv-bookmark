import { bookmarkEnum } from './supabase/supabase-bookmark.interface';

export interface LinkPath {
  path: string;
  label: string;
}

export interface NavElements {
  [key: string]: { label: string; subMenu: LinkPath[] };
}

export interface BookmarkNavElement {
  path: bookmarkEnum;
  label: string;
}
