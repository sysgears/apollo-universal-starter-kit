import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import PostCommentsService, { AddComment, DeleteComment, UpdateComment } from '../containers/PostComments';
import { CommentSelect } from '../reducers/index';

@Component({
  selector: 'post-comments-view',
  template: `
        <div>
            <h3>Comments</h3>
            <post-comment-form [postId]="post.id"></post-comment-form>
            <h1></h1>
            <table class="table">
                <thead>
                <tr>
                    <th class="w-100">Content</th>
                    <th class="w-100">Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let comment of post.comments">
                    <td>{{ comment.content }}</td>
                    <td>
                        <div style="width: 120px;">
                            <button type="button" class="edit-comment btn btn-primary btn-sm" (click)="onCommentSelect(comment)">Edit</button>
                            <button type="button" class="delete-comment btn btn-primary btn-sm" (click)="onCommentDelete(comment.id)">Delete</button>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>`
})
export default class PostCommentsView implements OnInit, OnDestroy {
  @Input() public post: any;
  private subsOnUpdate: Subscription;
  private subsOnDelete: Subscription;

  constructor(private postCommentsService: PostCommentsService, private store: Store<any>) {}

  public ngOnInit() {
    this.subsOnUpdate = this.postCommentsService.subscribeToCommentList(
      this.post.id,
      ({ data: { commentUpdated: { mutation, node, id } } }: any) => {
        if (mutation === 'CREATED') {
          this.post = AddComment(this.post, node);
        } else if (mutation === 'UPDATED') {
          this.post = UpdateComment(this.post, node);
        } else if (mutation === 'DELETED') {
          this.post = DeleteComment(this.post, id);
        }
      }
    );
  }

  public ngOnDestroy(): void {
    this.unsubscribe(this.subsOnUpdate, this.subsOnDelete);
  }

  public onCommentSelect(comment: any) {
    this.store.dispatch(new CommentSelect(comment));
  }

  public onCommentDelete(id: number) {
    this.unsubscribe(this.subsOnDelete);
    this.subsOnDelete = this.postCommentsService.deleteComment(id, this.post.id);
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
