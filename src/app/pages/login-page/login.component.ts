import { Component, Inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SECURITY_SERVICE, SecurityService } from '../../security/security.service';
import { Principal } from '../../security/data';
import { Router } from '@angular/router';

@Component({
  imports: [ButtonModule, InputTextModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email: string = '';
  process: boolean = false;

  constructor(private readonly router: Router,
              @Inject(SECURITY_SERVICE)
              private readonly securityService: SecurityService) {
    securityService.current()
      .subscribe(it => {
        if (it != null) {
          router.navigate(['/']);
        }
      });
  }

  login(username: string) {
    const me = this;
    this.process = true;
    this.securityService
      .authenticate(username)
      .subscribe({
        next(res: Principal) {
          console.log("Auth success: ", res);
          me.router.navigate(['/chat']);
        },
        error(err: any) {
          console.log("Auth error: ", err)
          alert("Authentication failed");
        },
        complete() {
          me.process = false;
        }
      });
  }
}
