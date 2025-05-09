import { Inject, Injectable, InjectionToken } from '@angular/core';
import { concatMap, NEVER, Observable } from 'rxjs';
import { Chat, Message, Participant } from '../model/chat';
import { Slice } from '../model/paging';
import { Ref } from '../model/base';
import { SECURITY_SERVICE, SecurityService } from '../security/security.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../model/user';
import { map } from 'rxjs/operators';

export const CHAT_SERVICE = new InjectionToken<ChatService>("ChatService")

export interface ChatService {

  list(token?: string): Observable<Slice<Chat>>;

  details(chatId: string): Observable<Chat>;

  create(participant: Ref<string, User>): Observable<Chat>;

  messages(chatId: string, token?: string): Observable<Slice<Message>>;

  sendMessage(chatId: string, message: string): Observable<Message>;

}

@Injectable()
export class ChatServiceImpl implements ChatService {

  constructor(private readonly http: HttpClient,
              @Inject(SECURITY_SERVICE)
              private readonly securityService: SecurityService) {
  }

  list(token?: string): Observable<Slice<Chat>> {
    const url = `${environment.services.chats}/chats`;
    let params = new HttpParams();
    if (!!token) {
      params = params.set('lastId', token);
    }
    return this.securityService.current()
      .pipe(
        map(principal => new HttpHeaders().set(environment.security.header, principal?.accountId || '')),
        concatMap(headers => this.http.get<Slice<Chat>>(url, { params: params, headers: headers }))
      );
  }

  details(chatId: string): Observable<Chat> {
    const url = `${environment.services.chats}/chats/${chatId}`;
    return this.securityService.current()
      .pipe(
        map(principal => new HttpHeaders().set(environment.security.header, principal?.accountId || '')),
        concatMap(headers => this.http.get<Chat>(url, { headers: headers }))
      );
  }

  create(participant: Ref<string, User>): Observable<Chat> {
    throw new Error("Not implemented")
    // return this.securityService.current()
    //   .pipe(
    //
    //   );
    // const url = `${environment.services.chats}/chats`;
    // return this.http.post<Chat>(url, chat);
  }

  messages(chatId: string, token?: string): Observable<Slice<Message>> {
    const url = `${environment.services.messages}/messages`;
    let params = new HttpParams()
      .set('chat', chatId);
    if (!!token) {
      params = params.set('lastId', token);
    }
    return this.securityService.current()
      .pipe(
        map(principal => new HttpHeaders().set(environment.security.header, principal?.accountId || '')),
        concatMap(headers => this.http.get<Slice<Message>>(url, { params: params, headers: headers }))
      );
  }

  sendMessage(chatId: string, message: string): Observable<Message> {
    const url = `${environment.services.messages}/messages`;
    return this.securityService.current()
      .pipe(
        map(principal => new HttpHeaders().set(environment.security.header, principal?.accountId || '')),
        concatMap(headers => this.http
          .post<Message>(url, createMessage(chatId, message), { headers: headers }))
      );
  }
}

// function createChat(Array<Ref<string, User>>): Chat {
//   const result = new Message()
//   result.chat = new Ref(chatId);
//   result.text = message;
//   return result;
// }

function createMessage(chatId: string, message: string): Message {
  const result = new Message()
  result.chat = new Ref(chatId);
  result.text = message;
  return result;
}
