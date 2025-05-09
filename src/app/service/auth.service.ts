import { Inject, Injectable, InjectionToken } from '@angular/core';
import { USER_SERVICE, UserService } from './user.service';
import { SECURITY_SERVICE, SecurityService } from '../security/security.service';
import { catchError, concatMap, Observable, tap } from 'rxjs';
import { User } from '../model/user';
import { Principal } from '../security/data';
import { map } from 'rxjs/operators';

const TOKEN_KEY = "token";

export const AUTH_SERVICE = new InjectionToken<AuthService>("AuthService")

export interface AuthService {

  authorizeByEmail(email: string): Observable<Principal>;

  signOut(): Observable<boolean>;

}

@Injectable()
export class AuthServiceImpl implements AuthService {

  constructor(@Inject(USER_SERVICE)
              private readonly userService: UserService,
              @Inject(SECURITY_SERVICE)
              private readonly securityService: SecurityService) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token != null) {
      this.userService.findById(token)
        .pipe(map(it => createPrincipal(it)))
        .subscribe({
          next: principal => securityService.authenticate(principal),
          error: () => securityService.clear()
        })
    } else {
      securityService.clear();
    }
  }

  authorizeByEmail(email: string): Observable<Principal> {
    return this.userService.findByEmail(email)
      .pipe(
        catchError(() => this.createUser(email)),
        concatMap(user => this.securityService.authenticate(createPrincipal(user))),
        tap(it => localStorage.setItem(TOKEN_KEY, it.accountId))
      );
  }

  private createUser(email: string): Observable<User> {
    const user = new User();
    user.email = email;
    user.name = email;
    return this.userService.create(user);
  }

  signOut(): Observable<boolean> {
    return this.securityService.clear()
      .pipe(
        tap(() => localStorage.removeItem(TOKEN_KEY))
      );
  }
}

function createPrincipal(user: User): Principal {
  return new Principal(
    user.id!!,
    user.email,
    []
  );
}
