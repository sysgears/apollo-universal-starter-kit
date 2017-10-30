import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import PostService from '../containers/Post';

@Component({
  selector: 'posts-view',
  template: `
      <div *ngIf="!loading; else showLoading" class="container">
          <h2>Posts</h2>
          <a [routerLink]="['/post/0']">
              <button class="btn btn-primary">Add</button>
          </a>
          <h1></h1>
          <ul class="list-group">
              <li class="d-flex justify-content-between list-group-item" *ngFor="let post of renderPosts()">
                  <div>
                      <a [routerLink]="['/post', post.id]" class="post-link">{{ post.title }}</a>
                  </div>
                  <div>
                      <a class="badge badge-secondary delete-button" style="cursor: pointer;"
                         (click)="deletePost(post.id)">Delete</a>
                  </div>
              </li>
          </ul>
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
  public posts: any;
  public endCursor = 0;
  private subsOnLoad: Subscription;

  constructor(private postService: PostService, private ngZone: NgZone) {}

  public ngOnInit() {
    this.subsOnLoad = this.postService.getPosts().subscribe(({ data: { posts }, loading }: any) => {
      this.ngZone.run(() => {
        this.posts = posts;
        this.loading = loading;
        this.endCursor = this.posts.pageInfo.endCursor;
      });
    });
  }

  public ngOnDestroy(): void {
    this.subsOnLoad.unsubscribe();
  }

  public renderPosts() {
    return this.posts.edges.map((edge: any): any => {
      return { id: edge.node.id, title: edge.node.title };
    });
  }

  public loadMoreRows() {
    this.postService.loadMoreRows(this.endCursor);
  }

  public deletePost(id: number) {
    this.postService
      .deletePost(id)
      .subscribe()
      .unsubscribe();
  }
}
