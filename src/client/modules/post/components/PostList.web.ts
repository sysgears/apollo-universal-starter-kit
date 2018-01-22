import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { CellData, ColumnData, ElemType } from '../../common/components/Table';
import PostService, { AddPost, DeletePost } from '../containers/Post';

@Component({
  selector: 'posts-view',
  template: `
    <div *ngIf="!loading; else showLoading" class="container">
      <h2>Posts</h2>
      <ausk-link [to]="'/post/0'">
        <ausk-button>Add</ausk-button>
      </ausk-link>
      <h1></h1>

      <ausk-table
          [columns]="columns"
          [rows]="rows">
      </ausk-table>

      <div>
        <small>({{ posts.edges.length }} / {{ posts.totalCount }})</small>
      </div>
      <ausk-button *ngIf="posts.pageInfo.hasNextPage" (click)="loadMoreRows()">
        Load more ...
      </ausk-button>
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
  private columns: ColumnData[] = [{ title: 'Title' }, { title: 'Actions', width: '50px' }];
  private rows: CellData[];

  constructor(private postService: PostService, private ngZone: NgZone) {}

  public ngOnInit() {
    this.subsOnLoad = this.postService.getPosts(({ data: { posts }, loading }: any) => {
      this.ngZone.run(() => {
        this.loading = loading;
        this.posts = posts;
        this.postService.updateEndCursor(posts.pageInfo.endCursor);
        this.rows = this.posts.edges.map((item: any) => {
          return [
            {
              type: [ElemType.Link],
              text: [item.node.title],
              link: [`/post/${item.node.id}`]
            },
            {
              type: [ElemType.Button],
              text: ['Delete'],
              callback: [() => this.deletePost(item.node.id)]
            }
          ];
        });
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
