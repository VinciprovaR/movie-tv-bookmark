export type createOperation = 'create';
export type deleteOperation = 'delete';
export type updateOperation = 'update';
export type createUpdateOperation = 'createUpdate';
export type unchangedOperation = 'unchanged';
export type defaultOperation = 'default';

export type crud_operations =
  | createOperation
  | deleteOperation
  | updateOperation
  | createUpdateOperation
  | unchangedOperation
  | defaultOperation;

export interface LifecycleCrudConditions {
  [key: string]: crud_operations;
}
