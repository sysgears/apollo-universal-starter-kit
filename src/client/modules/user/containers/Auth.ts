import { Component, Input, OnInit } from '@angular/core';
import LoginService from './Login';

@Component({
  selector: 'auth-login',
  template: `
    <menu-item *ngIf="!isAuth">
      <nav-link [name]="'Sign In'" [to]="'/login'"></nav-link>
    </menu-item>
    <menu-item *ngIf="isAuth">
      <nav-link [name]="'Logout'" [to]="''" [type]="'clickable'" (click)="logout()"></nav-link>
    </menu-item>
    <menu-item *ngIf="isAuth">
      <nav-link [name]="profileName" [to]="'/profile'"></nav-link>
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
      <nav-link [name]="'Users'" [to]="'/users'"></nav-link>
    </menu-item>
  `,
  host: {'class': 'ant-menu-item'}
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