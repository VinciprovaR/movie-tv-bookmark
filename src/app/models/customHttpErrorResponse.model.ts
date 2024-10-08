import { CustomHttpErrorResponseInterface } from '../shared/interfaces/customHttpErrorResponse.interface';

export class CustomHttpErrorResponse
  implements CustomHttpErrorResponseInterface
{
  readonly name = 'CustomHttpErrorResponse';
  readonly ok = false;
  error: any;
  message: string | undefined;
  status: number | undefined;
  statusText: string | undefined;
  url: string | undefined;
  type: string | undefined;

  constructor(init: {
    error?: any;
    message?: string;
    status?: number;
    statusText?: string;
    url?: string;
    type?: string;
  }) {
    this.error = init.error;
    this.message = init.message;
    this.status = init.status;
    this.statusText = init.statusText;
    this.url = init.url;
  }
}
