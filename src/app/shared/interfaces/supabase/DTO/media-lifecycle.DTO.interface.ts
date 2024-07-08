import { lifeCycleId } from '../../lifecycle.interface';

export interface MediaLifecycleDTO {
  mediaId: number;
  lifecycleId: lifeCycleId;
  index: number;
}

export interface LifecycleOption {
  label: string;
  value: lifeCycleId;
}
