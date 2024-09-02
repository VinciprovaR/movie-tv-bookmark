export interface CustomHttpErrorResponseInterface {
  name: 'CustomHttpErrorResponse';
  ok: boolean;
  error: any;
  message: string | undefined;
  status: number | undefined;
  statusText: string | undefined;
  url: string | undefined;
  type: string | undefined;
}
