import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { SECURITY_SERVICE, StubSecurityServiceImpl, SecurityServiceImpl } from './security/security.service';
import { HasAuthority, IsAnonymous, IsAuthorized } from './security/filters';
import { provideHttpClient } from '@angular/common/http';

import Aura from '@primeng/themes/aura';
import { CHAT_SERVICE, StubChatServiceImpl } from './service/chat.service';


export const appConfig: ApplicationConfig = {
  providers: [
    { provide: SECURITY_SERVICE, useClass: StubSecurityServiceImpl },
    // { provide: SECURITY_SERVICE, useClass: SecurityServiceImpl },
    { provide: CHAT_SERVICE, useClass: StubChatServiceImpl },
    { provide: IsAnonymous },
    { provide: IsAuthorized },
    { provide: HasAuthority },
    provideHttpClient(),
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
