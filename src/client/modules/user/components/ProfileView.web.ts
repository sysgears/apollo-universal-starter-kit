import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import ProfileService from '../containers/Profile';

@Component({
  selector: 'profile-view',
  template: `
    <div *ngIf="loading" class="text-center">Loading...</div>
    <div id="content" *ngIf="!loading" class="container">
      <h2>Profile</h2>
      <p>username: {{currentUser.username}}</p>
      <p>email: {{currentUser.email}}</p>
      <p>is admin: {{currentUser.isAdmin}}</p>
    </div>
  `
})
export default class ProfileView implements OnInit, OnDestroy {
  public loading: boolean = true;
  public currentUser: any = {};
  private subsOnCurrentUser: Subscription;

  constructor(private profileService: ProfileService, private ngZone: NgZone) {}

  public ngOnInit(): void {
    this.subsOnCurrentUser = this.profileService.getCurrentUser(({ data: { currentUser }, loading }: any) => {
      this.ngZone.run(() => {
        this.currentUser = currentUser;
        this.loading = loading;
      });
    });
  }

  public ngOnDestroy(): void {
    this.subsOnCurrentUser.unsubscribe();
  }
}
