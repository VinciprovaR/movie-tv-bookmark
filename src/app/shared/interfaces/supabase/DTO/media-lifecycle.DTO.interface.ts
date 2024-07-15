import { lifeCycleId } from '../supabase-lifecycle.interface';

export interface MediaLifecycleDTO<T> {
  lifecycleId: lifeCycleId;
  index: number;
  mediaDataDTO: T;
}

export interface LifecycleOption {
  label: string;
  value: lifeCycleId;
}
