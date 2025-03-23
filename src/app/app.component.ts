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

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FieldsetModule, Button, HomeIcon, Menu, NgIf, RouterLink, CaretLeftIcon, Ripple, Popover],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  readonly currentPrincipal: Signal<Principal | null | undefined>;

  constructor(private readonly router: Router,
              @Inject(SECURITY_SERVICE) private readonly securityService: SecurityService) {
    this.currentPrincipal = toSignal(this.securityService.observe());
  }

  logout() {
    this.securityService.logout()
      .subscribe(() => this.router.navigateByUrl('/'));
  }
}
