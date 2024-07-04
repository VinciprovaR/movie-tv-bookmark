import { lifeCycleId } from '../../lifecycle.models';

export interface MediaLifecycleDTO {
  mediaId: number;
  lifecycleId: lifeCycleId;
  index: number;
}

export interface SelectLifecycleDTO {
  label: string;
  value: lifeCycleId;
}
