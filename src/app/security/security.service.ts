import { Injectable, InjectionToken, OnInit } from "@angular/core";
import { filter, first, map } from "rxjs/operators";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Principal } from './data';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { User } from '../model/user';

const TOKEN_KEY = "token";
const HEADER_KEY = environment.security.header;
const URL = environment.security.sessionUrl;

export const SECURITY_SERVICE = new InjectionToken<SecurityService>("SecurityService")

export interface SecurityService {

  authenticate(username: string): Observable<Principal>;

  current(): Observable<Principal | null>;

  logout(): Observable<boolean>;

  observe(): Observable<Principal | null>;

}

@Injectable()
export class StubSecurityServiceImpl implements SecurityService {

  private readonly principal$: Subject<Principal | null | undefined> = new BehaviorSubject<Principal | null| undefined>(undefined);

  constructor() {
    const token = localStorage.getItem(TOKEN_KEY);
    const principal = !!token ? new Principal(-1, token) : null;
    this.principal$.next(principal);
  }

  authenticate(username: string): Observable<Principal> {
    const principal = new Principal(-1, username);
    localStorage.setItem(TOKEN_KEY, username);
    this.principal$.next(principal);
    return of(principal);
  }

  current(): Observable<Principal | null> {
    return this.observe()
      .pipe(first());
  }

  logout(): Observable<boolean> {
    localStorage.removeItem(TOKEN_KEY);
    this.principal$.next(null);
    return of(true);
  }

  observe(): Observable<Principal | null> {
    return this.principal$
      .pipe(filter(it => it !== undefined));
  }
}

@Injectable()
export class SecurityServiceImpl implements SecurityService {

  private readonly principal$: Subject<Principal | null | undefined> = new BehaviorSubject<Principal | null | undefined>(undefined);
  private initialize: boolean = false;

  constructor(private readonly http: HttpClient) {
  }

  authenticate(username: string): Observable<Principal> {
    const req = {
      login: username,
      // password: password
    };
    return this.http.put<User>(URL, req, {observe: 'response'})
      .pipe(
        map((res: HttpResponse<User>) => {
          const token = res.headers.get(HEADER_KEY);
          if (token == null) localStorage.removeItem(TOKEN_KEY);
          else localStorage.setItem(TOKEN_KEY, token);
          return res.body
        }),
        map(it => {
          const principal = userToPrincipal(it);
          this.principal$.next(principal);
          return principal;
        })
      );
  }

  token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  current(): Observable<Principal | null> {
    return this.observe()
      .pipe(first());
  }

  logout(): Observable<boolean> {
    localStorage.removeItem(TOKEN_KEY);
    this.principal$.next(null);
    return of(true);
  }

  observe(): Observable<Principal | null> {
    this.lazyInit();
    return this.principal$
      .pipe(filter(it => it !== undefined));
  }

  private lazyInit() {
    if (this.initialize) return;
    this.initialize = true;
    this.http.get<User>(URL)
      .subscribe(it => this.principal$.next(it ? userToPrincipal(it) : null));
  }
}

function userToPrincipal(it: User | null) {
  const id = it && it.id
  if (!it || !id) throw "Bad credentials";
  return new Principal(id, it.name);
}
