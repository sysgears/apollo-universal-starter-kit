import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ProfileService } from '../containers/Profile';

@Component({
  selector: 'profile-view',
  template: `
    <div *ngIf="loading" class="text-center">Loading...</div>
    <div *ngIf="!loading && currentUser">
      <layout-center>
        <h1 class="text-center">Profile</h1>
        <ausk-card>
          <card-group>
            <card-title>User Name:</card-title>
            <card-text>{{currentUser.username}}</card-text>
          </card-group>
          <card-group>
            <card-title>Email:</card-title>
            <card-text>{{currentUser.email}}</card-text>
          </card-group>
          <card-group>
            <card-title>Role:</card-title>
            <card-text>{{currentUser.role}}</card-text>
          </card-group>
          <card-group *ngIf="currentUser.profile && currentUser.profile.firstName">
            <card-title>Full Name:</card-title>
            <card-text>{{currentUser.profile.fullName}}</card-text>
          </card-group>
        </ausk-card>
      </layout-center>
    </div>
    <div *ngIf="!loading && !currentUser">
      <h2>No current user logged in</h2>
    </div>
  `
})
export class ProfileView implements OnInit, OnDestroy {
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
