import { Inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { SECURITY_SERVICE, SecurityService } from "./security.service";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

export const HAS_AUTHORITY = 'hasAuthority';

@Injectable()
export class IsAuthorized implements CanActivate, CanActivateChild {

  constructor(private readonly router: Router,
              @Inject(SECURITY_SERVICE)
              private readonly securityService: SecurityService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate0(state);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate0(state);
  }

  private canActivate0(state: RouterStateSnapshot): Observable<boolean> {
    return this.securityService.current()
      .pipe(
        map(principal => {
          if (principal) {
            return true;
          }
          // not logged in so redirect to login page with the return url
          this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
          return false;
        })
      );
  }
}

@Injectable()
export class IsAnonymous implements CanActivate, CanActivateChild {

  constructor(private readonly router: Router,
              @Inject(SECURITY_SERVICE)
              private readonly securityService: SecurityService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate0();
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate0();
  }

  private canActivate0(): Observable<boolean> {
    return this.securityService.current()
      .pipe(
        map(principal => {
          if (!principal) {
            return true;
          }
          // no access
          this.router.navigate(['/error/403']);
          return false;
        })
      );
  }
}

@Injectable()
export class HasAuthority implements CanActivate, CanActivateChild {

  constructor(private readonly router: Router,
              @Inject(SECURITY_SERVICE)
              private readonly securityService: SecurityService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate0(route, state);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate0(childRoute, state);
  }

  private canActivate0(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.securityService.current()
      .pipe(
        map(principal => {
          if (!principal) {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
            return false;
          }

          const authorities = route.data[HAS_AUTHORITY] || [];
          if (authorities.includes(principal.authorities)) {
            return true;
          }

          // no access
          this.router.navigate(['/error/403']);
          return false;
        })
      );
  }
}
