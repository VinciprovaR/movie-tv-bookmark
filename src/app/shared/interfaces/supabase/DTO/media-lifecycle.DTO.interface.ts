import { lifecycleEnum } from '../supabase-lifecycle.interface';

export interface MediaLifecycleDTO<T> {
  lifecycleEnum: lifecycleEnum;
  index: number;
  mediaDataDTO: T;
}

export interface LifecycleOption {
  label: string;
  value: lifecycleEnum;
}
