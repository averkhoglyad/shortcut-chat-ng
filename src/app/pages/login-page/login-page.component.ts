import { Component, inject, Inject, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SECURITY_SERVICE, SecurityService } from '../../security/security.service';
import { Principal } from '../../security/data';
import { Router } from '@angular/router';
import { AUTH_SERVICE, AuthService } from '../../service/auth.service';

@Component({
  imports: [ButtonModule, InputTextModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  process = signal(false);

  constructor(private readonly router: Router,
              @Inject(AUTH_SERVICE)
              private readonly authService: AuthService,
              @Inject(SECURITY_SERVICE)
              securityService: SecurityService) {
    securityService.current()
      .subscribe(it => {
        if (it != null) {
          router.navigate(['/']);
        }
      });
  }

  login(username: string) {
    this.process.set(true);
    this.authService
      .authorizeByEmail(username)
      .subscribe({
        next: (res: Principal) => {
          console.log("Auth success: ", res);
          this.router.navigate(['/test']);
        },
        error: (err: any) => {
          console.log("Auth error: ", err)
          alert("Authentication failed");
          this.process.set(false)
        }
      });
  }
}
