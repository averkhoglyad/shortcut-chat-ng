import { Injectable, InjectionToken } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { User } from '../model/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const USER_SERVICE = new InjectionToken<UserService>("UserService")

export interface UserService {

  findById(id: string): Observable<User>;

  findByEmail(email: string): Observable<User>;

  create(user: User): Observable<User>

}

@Injectable()
export class UserServiceImpl implements UserService {

  constructor(private readonly http: HttpClient) {
  }

  findById(id: string): Observable<User> {
    const url = `${environment.services.users}/users/${id}`;
    return this.http.get<User>(url);
  }

  findByEmail(email: string): Observable<User> {
    const url = `${environment.services.users}/users/by-email`;
    const params = new HttpParams()
      .set('email', email);

    return this.http.get<User>(url, {params: params});
  }

  create(user: User): Observable<User> {
    const url = `${environment.services.users}/users`;
    return this.http.post<User>(url, user);
  }
}
