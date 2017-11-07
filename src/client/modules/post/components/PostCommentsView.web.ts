import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import PostCommentsService, { AddComment, DeleteComment, UpdateComment } from '../containers/PostComments';

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
  public subsOnUpdate: Subscription;
  @Input() public post: any;

  constructor(private postCommentsService: PostCommentsService) {}

  public ngOnInit() {
    this.subsOnUpdate = this.postCommentsService
      .subscribeToCommentList(this.post.id)
      .subscribe(({ commentUpdated: { mutation, node, id } }: any) => {
        if (mutation === 'CREATED') {
          this.post = AddComment(this.post, node);
        } else if (mutation === 'UPDATED') {
          this.post = UpdateComment(this.post, node);
        } else if (mutation === 'DELETED') {
          this.post = DeleteComment(this.post, id);
        }
      });
  }

  public ngOnDestroy(): void {
    this.subsOnUpdate.unsubscribe();
  }

  public onCommentSelect(comment: any) {
    this.postCommentsService.startedEditing.next(comment);
  }

  public onCommentDelete(id: number) {
    this.postCommentsService.deleteComment(id, this.post.id).subscribe();
  }
}
