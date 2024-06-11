import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { WebStorageService } from '../services';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(WebStorageService);

  const token = jwtService.getJwtToken();

  const request = req.clone({
    setHeaders: {
      ...(token ? { Authorization: `${token}` } : {}),
    },
  });
  return next(request);
};
