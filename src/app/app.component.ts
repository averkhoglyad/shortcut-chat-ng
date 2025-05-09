import { Component, computed, Inject, Signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FieldsetModule } from 'primeng/fieldset';
import { Button } from 'primeng/button';
import { CaretLeftIcon, HomeIcon } from 'primeng/icons';
import { Menu } from 'primeng/menu';
import { NgIf } from '@angular/common';
import { Principal } from './security/data';
import { SECURITY_SERVICE, SecurityService } from './security/security.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Ripple } from 'primeng/ripple';
import { Popover } from 'primeng/popover';
import { AUTH_SERVICE, AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FieldsetModule, Button, HomeIcon, Menu, NgIf, RouterLink, CaretLeftIcon, Ripple],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  readonly currentPrincipal: Signal<Principal | null | undefined>;

  constructor(private readonly router: Router,
              @Inject(AUTH_SERVICE)
              private readonly authService: AuthService,
              @Inject(SECURITY_SERVICE)
              securityService: SecurityService) {
    this.currentPrincipal = toSignal(securityService.observe());
  }

  logout() {
    this.authService.signOut()
      .subscribe(() => this.router.navigateByUrl('/'));
  }
}
