import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Chat, Message } from '../model/chat';
import { Slice } from '../model/paging';
import { Ref } from '../model/base';

export const CHAT_SERVICE = new InjectionToken<ChatService>("ChatService")

export interface ChatService {

  list(token?: string): Observable<Slice<Chat>>;
  details(chatId: string): Observable<Chat>;
  messages(chatId: string, token?: string): Observable<Slice<Message>>;

}

@Injectable()
export class StubChatServiceImpl implements ChatService {

  private readonly sliceSize = 50;
  private readonly totalChats = 150;
  private readonly totalMessages = 250;

  list(token?: string): Observable<Slice<Chat>> {
    const startIndex = token ? parseInt(token) : 0;
    if (this.totalChats <= startIndex) {
      return of(new Slice([], ''));
    }
    const chats: Array<Chat> = [];
    for (let i = startIndex; i < startIndex + this.sliceSize; i++) {
      const chat = new Chat();
      chat.id = `${i}`;
      chat.name = `Chat #${i}`;
      chats.push(chat)
    }
    return of(new Slice(chats, `${startIndex + this.sliceSize}`));
  }

  details(chatId: string): Observable<Chat> {
    const chat = new Chat();
    chat.id = chatId;
    chat.name = `Chat #${chatId}`;
    return of(chat);
  }

  messages(chatId: string, token?: string): Observable<Slice<Message>> {
    const startIndex = token ? parseInt(token) : 0;
    if (this.totalMessages <= startIndex) {
      return of(new Slice([], ''));
    }
    const messages: Array<Message> = [];
    for (let i = startIndex; i < startIndex + this.sliceSize; i++) {
      const message = new Message();
      message.id = -1;
      message.author = new Ref(-1);
      message.chat = new Ref(chatId);
      message.text = "Some message"
      messages.push(message);
    }
    return of(new Slice(messages, `${startIndex + this.sliceSize}`));
  }

  sendMessage(message: Message): Observable<Message> {
    message.id = (new Date()).getTime();
    return of(message);
  }
}
