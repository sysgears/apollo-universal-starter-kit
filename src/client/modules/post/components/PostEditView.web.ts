import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import PostEditService from '../containers/PostEdit';

@Component({
  selector: 'post-edit-view',
  template: `
      <div *ngIf="!loading; else showLoading">
          <a id="back-button" [routerLink]="['/posts']">Back</a>
          <h2>{{ title }} Post</h2>
          <post-form [post]="post"></post-form>
          <br/>
          <post-comments-view *ngIf="post" [post]="post"></post-comments-view>
      </div>
      <ng-template #showLoading>
          <div class="text-center">Loading...</div>
      </ng-template>`
})
export default class PostEditView implements OnInit, OnDestroy {
  public loading: boolean = true;
  public title: string;
  public post: any;
  private subsOnLoad: Subscription;

  constructor(private postEditService: PostEditService, private route: ActivatedRoute, private ngZone: NgZone) {}

  public ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.subsOnLoad = this.postEditService.getPost(+params.id, ({ data: { post }, loading }: any) => {
        this.ngZone.run(() => {
          this.post = post;
          this.loading = loading;
          this.title = !this.post ? 'Create' : 'Edit';
        });
      });
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe(this.subsOnLoad);
  }

  private unsubscribe = (...subscriptions: Subscription[]) => {
    subscriptions.forEach((subscription: Subscription) => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
    });
  };
}
