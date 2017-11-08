import { Component, Input, OnInit } from '@angular/core';
import LoginService from './Login';

@Component({
  selector: 'auth-login',
  template: `
    <li *ngIf="!isAuth" class="nav-item">
      <span class="nav-link">
        <a aria-current="false" routerLink="/login">Login</a> / <a aria-current="false" routerLink="/register">Register</a>
      </span>
    </li>
    <li *ngIf="isAuth" class="nav-item">
      <span class="nav-link">
        <a href="#" (click)="logout()">Logout</a>
      </span>
    </li>
    <li *ngIf="isAuth" class="nav-item">
      <span class="nav-link">
        <a href="#" routerLink="/profile" routerLinkActive="active">{{profileName}}</a>
      </span>
    </li>
  `,
  styles: ['li { float: right; display: inline-block; }']
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
    <li *ngIf="isAuth" class="nav-item">
      <span class="nav-link">
        <a aria-current="false" routerLink="/users" [routerLinkActive]="['active']">Users</a>
      </span>
    </li>
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