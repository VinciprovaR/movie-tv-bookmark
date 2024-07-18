import { lifecycleEnum } from '../supabase-lifecycle.interface';

export interface Lifecycle_Metadata {
  id: number;
  enum: lifecycleEnum;
  description: string;
  label: string;
}
