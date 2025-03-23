import { Directive, Inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { SECURITY_SERVICE, SecurityService } from "./security.service";
import { Principal } from "./data";

@Directive({
  selector: '[isAuthorized]'
})
export class IsAuthorized {

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              @Inject(SECURITY_SERVICE)
              private securityService: SecurityService) {
    securityService.observe()
      .subscribe(principal => {
        this.viewContainer.clear();
        if (!!principal) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      });
  }
}

@Directive({
  selector: '[isAnonymous]'
})
export class IsAnonymous {

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              @Inject(SECURITY_SERVICE)
              private securityService: SecurityService) {
    securityService.observe()
      .subscribe(principal => {
        this.viewContainer.clear();
        if (!principal) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      });
  }
}

@Directive({
  selector: '[hasAuthority]'
})
export class HasAuthority implements OnInit {

  private authority: string | null = null;
  private principal: Principal | null = null;

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              @Inject(SECURITY_SERVICE)
              private securityService: SecurityService) {
  }

  ngOnInit(): void {
    this.securityService.observe()
      .subscribe(principal => {
        this.principal = principal;
        this.render();
      });
  }

  @Input()
  set hasAuthority(value: string) {
    this.authority = value;
    this.render();
  }

  private render() {
    this.viewContainer.clear();
    if (!!this.principal && this.principal.authorities.includes(this.authority || '')) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
