import { Component, Inject, Input, signal, Signal } from '@angular/core';
import { BehaviorSubject, delay, Observable, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChatPageComponent } from '../chat-page.component';
import { CHAT_SERVICE, ChatService } from '../../../service/chat.service';
import { Chat, Message } from '../../../model/chat';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollableElement,
  CdkVirtualScrollViewport
} from '@angular/cdk/scrolling';
import { JsonPipe, NgClass } from '@angular/common';
import { Ref } from '../../../model/base';
import { Textarea } from 'primeng/textarea';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { filter, map } from 'rxjs/operators';
import { Slice } from '../../../model/paging';

@Component({
  imports: [
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
    CdkVirtualScrollableElement,
    NgClass,
    JsonPipe,
    Textarea,
    InputGroup,
    InputGroupAddon,
    Button,
    FormsModule
  ],
  templateUrl: './chat-view-page.component.html',
  styleUrl: './chat-view-page.component.scss'
})
export class ChatViewPageComponent {

  private readonly chatId$ = new BehaviorSubject<string | undefined>(undefined)

  private readonly tokens$ = new BehaviorSubject<string | null | undefined>(undefined);
  private readonly messages$ = new BehaviorSubject<Array<Message> | undefined>(undefined)
  private readonly modified$ = new BehaviorSubject<Array<Message> | undefined>(undefined)

  private accumulator: Array<Message> = []
  private lastToken: string | undefined;

  readonly currentChat: Signal<Chat | Ref<string, Chat> | undefined>;
  readonly messages: Signal<Array<Message>> = signal([randomMessage()]);

  message: string = '';

  constructor(private readonly parent: ChatPageComponent,
              @Inject(CHAT_SERVICE)
              private readonly chatService: ChatService) {
    this.currentChat = toSignal(this.chatId$
      .pipe(
        filter(it => it !== undefined),
        tap(() => this.accumulator = []),
        tap(() => this.tokens$.next(null)),
        switchMap(id => chatService.details(id)),
      ));
    //
    // this.tokens$
    //   .pipe(
    //     filter(it => it !== undefined),
    //     switchMap
    //   )
  }

  // private loadMessages(token: string | null): Observable<Slice<Message>> {
  //   return (!token ? this.chatService.messages(currentChat) : this.chatService.messages(token));
  // }

  @Input()
  set chatId(chatId: string) {
    this.chatId$.next(chatId);
    this.parent.chatId = chatId;
  }

  trackingMessage(index: number, message: Message): number | undefined {
    return message.id;
  }

  sendMessage(message: string) {

  }
}

function randomMessage() {
  const message = new Message();
  message.id = -1;
  message.author = new Ref(-1);
  message.chat = new Ref('-1');
  message.text = "Some message"
  return message;
}
