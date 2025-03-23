import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-page/login.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { Error401Component } from './pages/error401/error401.component';
import { Error403Component } from './pages/error403/error403.component';
import { Error500Component } from './pages/error500/error500.component';
import { Error404Component } from './pages/error404/error404.component';
import { IsAuthorized } from './security/filters';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { ChatViewPageComponent } from './pages/chat-page/chat-view-page/chat-view-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePageComponent
  },
  {
    path: 'chat',
    component: ChatPageComponent,
    canActivate: [IsAuthorized],
    canActivateChild: [IsAuthorized],
    children: [
      {
        path: ':chatId',
        component: ChatViewPageComponent
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'error/401',
    component: Error401Component
  },
  {
    path: 'error/403',
    component: Error403Component
  },
  {
    path: 'error/500',
    component: Error500Component
  },
  {
    path: '**',
    component: Error404Component
  }
];
