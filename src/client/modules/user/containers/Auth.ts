import { Component, Input, OnInit } from '@angular/core';
import LoginService from './Login';

@Component({
  selector: 'auth-login',
  template: `
    <menu-item *ngIf="!isAuth" class="nav-item">
      <span class="nav-link">
        <nav-link [name]="'Login'" [className]="''" [to]="'/login'"></nav-link> /
        <nav-link [name]="'Register'" [className]="''" [to]="'/register'"></nav-link>
      </span>
    </menu-item>
    <menu-item *ngIf="isAuth">
        <span class="nav-link">
          <a href="#" (click)="logout()">Logout</a>
        </span>
    </menu-item>
    <menu-item *ngIf="isAuth">
      <nav-link [name]="profileName" [to]="'/profile'">
        <a href="#" routerLink="/profile" routerLinkActive="active">{{profileName}}</a>
      </nav-link>
    </menu-item>
  `,
  styles: ['menu-item { float: right; display: inline-block; }']
})
class AuthLogin implements OnInit {
  public isAuth: boolean = false;
  public profileName: string;
  public logout: any = this.logoutFn;

  constructor(private loginService: LoginService) {}

  public ngOnInit(): void {
    this.setAuth();
    this.loginService.setLoginEventCb(this.setAuth);
    this.loginService.setLogoutEventCb(this.setAuth);
  }

  private setAuth = () => {
    this.isAuth = this.loginService.checkAuth();
    this.profileName = this.loginService.profileName();
  };

  private logoutFn() {
    this.loginService.logout(() => {
      window.localStorage.setItem('token', null);
      window.localStorage.setItem('refreshToken', null);
    });
  }
}

/* tslint:disable */
@Component({
  selector: 'auth-nav',
  template: `
    <menu-item *ngIf="isAuth">
      <nav-link [name]="'Users'" [to]="'/users'" [className]="'nav-link'"></nav-link>
    </menu-item>
  `
})
class AuthNav implements OnInit {
  @Input() public role: string;
  public isAuth: boolean = false;

  constructor(private loginService: LoginService) {}

  public ngOnInit(): void {
    this.setAuth();
    this.loginService.setLoginEventCb(this.setAuth);
    this.loginService.setLogoutEventCb(this.setAuth);
  }

  private setAuth = () => {
    this.isAuth = this.loginService.checkAuth(this.role);
  };
}

export { AuthLogin };
export { AuthNav };