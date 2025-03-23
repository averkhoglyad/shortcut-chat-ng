import { Component, Inject, Input, OnInit, signal, Signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BehaviorSubject, delay, distinctUntilChanged, Observable, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CHAT_SERVICE, ChatService } from '../../service/chat.service';
import { Chat } from '../../model/chat';
import { filter, map } from 'rxjs/operators';
import { Slice } from '../../model/paging';
import { NgClass } from '@angular/common';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollableElement,
  CdkVirtualScrollViewport
} from '@angular/cdk/scrolling';
import { Skeleton } from 'primeng/skeleton';

@Component({
  imports: [
    RouterOutlet,
    NgClass,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollableElement,
    RouterLink,
    RouterLinkActive,
    Skeleton
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent implements OnInit {

  private readonly tokens$ = new BehaviorSubject<string | null | undefined>(undefined);
  private readonly chats$: Observable<Array<Chat>>;
  private accumulator: Array<Chat> = [];
  private lastToken: string = '';
  readonly chats: Signal<Array<Chat> | undefined>;
  readonly loading = signal(false);
  readonly hasMore = signal(false);

  private readonly chat$ = new BehaviorSubject<any | undefined>(undefined)
  readonly currentChat: Signal<any | undefined> = toSignal(this.chat$);

  constructor(@Inject(CHAT_SERVICE)
              private readonly chatService: ChatService) {
    this.chats$ = this.tokens$
      .pipe(
        filter(it => it !== undefined),
        distinctUntilChanged(),
        switchMap(token => this.loadNextPortion(token)),
        tap(it => this.lastToken = it.nextToken),
        tap(it => this.hasMore.update(() => !!it.nextToken)),
        map(it => this.accumulator = this.accumulator.concat(it.items)),
      );

    this.chats = toSignal(this.chats$);
  }

  private loadNextPortion(token: string | null): Observable<Slice<Chat>> {
    return (!token ? this.chatService.list() : this.chatService.list(token))
      .pipe(
        tap(() => this.loading.update(() => true)),
        delay(500),
        tap(() => this.loading.update(() => false)),
      );
  }

  @Input()
  set chatId(chatId: string) {
    this.chat$.next(chatId);
  }

  ngOnInit(): void {
    this.tokens$.next(null);
  }

  loadNext() {
    this.tokens$.next(this.lastToken);
  }

  trackingChat(index: number, chat: Chat): string | undefined {
    return chat.id
  }
}
