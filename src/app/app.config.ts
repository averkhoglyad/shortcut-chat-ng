import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { HasAuthority, IsAnonymous, IsAuthorized } from './security/filters';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import Aura from '@primeng/themes/aura';
import { CHAT_SERVICE, ChatServiceImpl } from './service/chat.service';
import { SECURITY_SERVICE, SecurityServiceImpl } from './security/security.service';
import { USER_SERVICE, UserServiceImpl } from './service/user.service';
import { AUTH_SERVICE, AuthServiceImpl } from './service/auth.service';
import { HttpSecurityInterceptor } from './http/HttpSecurityInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: SECURITY_SERVICE, useClass: SecurityServiceImpl },
    { provide: CHAT_SERVICE, useClass: ChatServiceImpl },
    { provide: USER_SERVICE, useClass: UserServiceImpl },
    { provide: AUTH_SERVICE, useClass: AuthServiceImpl },
    { provide: IsAnonymous },
    { provide: IsAuthorized },
    { provide: HasAuthority },
    { provide: HTTP_INTERCEPTORS, useClass: HttpSecurityInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng'
          },
          prefix: 'p',
          darkModeSelector: 'system',
        }
      }
    })
  ]
};
