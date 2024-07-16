import { CrudOperationsEnum } from '../interfaces/supabase/supabase-lifecycle-crud-cases.interface';

export const CRUD_OPERATIONS_ENUM: CrudOperationsEnum = {
  create: 'create',
  delete: 'delete',
  update: 'update',
  createUpdate: 'createUpdate',
  unchanged: 'unchanged',
  default: 'default',
};
