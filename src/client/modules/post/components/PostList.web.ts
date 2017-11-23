import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import PostService, { AddPost, DeletePost } from '../containers/Post';

@Component({
  selector: 'posts-view',
  template: `
      <div *ngIf="!loading; else showLoading" class="container">
          <h2>Posts</h2>
          <ausk-link [to]="'/post/0'">
              <button class="btn btn-primary">Add</button>
          </ausk-link>
          <h1></h1>
          <table class="table">
              <thead>
              <tr>
                  <th class="w-100">Title</th>
                  <th class="w-100">Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let post of posts.edges">
                  <td>
                    <ausk-link [className]="'post-link'" [to]="'/post/' + post.node.id">{{ post.node.title }}</ausk-link>
                  </td>
                  <td>
                      <button type="button" class="delete-button btn btn-primary btn-sm" (click)="deletePost(post.node.id)">Delete</button>
                  </td>
              </tr>
              </tbody>
          </table>
          <div>
              <small>({{ posts.edges.length }} / {{ posts.totalCount }})</small>
          </div>
          <button type="button" id="load-more" class="btn btn-primary" *ngIf="posts.pageInfo.hasNextPage" (click)="loadMoreRows()">
              Load more ...
          </button>
      </div>
      <ng-template #showLoading>
          <div class="text-center">Loading...</div>
      </ng-template>
  `
})
export default class PostList implements OnInit, OnDestroy {
  public loading: boolean = true;
  public posts: any = [];
  private subsOnLoad: Subscription;
  private subsOnUpdate: Subscription;
  private subsOnDelete: Subscription;

  constructor(private postService: PostService, private ngZone: NgZone) {}

  public ngOnInit() {
    this.subsOnLoad = this.postService.getPosts(({ data: { posts }, loading }: any) => {
      this.ngZone.run(() => {
        this.loading = loading;
        this.posts = posts;
        this.postService.updateEndCursor(posts.pageInfo.endCursor);
      });
    });

    this.subsOnUpdate = this.postService.subscribeToPosts(({ data: { postsUpdated: { mutation, node } } }: any) => {
      if (mutation === 'CREATED') {
        this.posts = AddPost(this.posts, node);
        this.postService.updateEndCursor(this.postService.getEndCursor() + 1);
      } else if (mutation === 'DELETED') {
        this.posts = DeletePost(this.posts, node);
        this.postService.updateEndCursor(this.postService.getEndCursor() - 1);
      }
    });

    this.postService.updateSubscription(this.subsOnUpdate);
  }

  public ngOnDestroy(): void {
    this.unsubscribe(this.subsOnLoad, this.subsOnDelete);
  }

  public loadMoreRows() {
    this.postService.loadMoreRows();
  }

  public deletePost(id: number) {
    this.unsubscribe(this.subsOnDelete);
    this.subsOnDelete = this.postService.deletePost(id);
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
