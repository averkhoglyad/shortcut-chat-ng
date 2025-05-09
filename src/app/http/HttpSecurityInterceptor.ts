import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { NEVER, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { Inject, Injectable } from "@angular/core";
import { SECURITY_SERVICE, SecurityService } from '../security/security.service';

@Injectable()
export class HttpSecurityInterceptor implements HttpInterceptor {

  constructor(private readonly router: Router,
              @Inject(SECURITY_SERVICE)
              private readonly securityService: SecurityService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.securityService.clear();
              this.router.navigateByUrl('error/401');
              return NEVER;
            }
            if (err.status === 403) {
              this.router.navigateByUrl('error/403');
              return NEVER;
            }
          }
          return throwError(() => err);
        })
      );
  }
}
