import { Component, Input, OnInit } from '@angular/core';
import PostCommentsService from '../containers/PostComments';

@Component({
  selector: 'post-comments-view',
  template: `
        <div>
            <h3>Comments</h3>
            <post-comment-form></post-comment-form>
            <h1></h1>
            <ul class="list-group" *ngFor="let comment of post.comments">
                <li class="d-flex justify-content-between list-group-item">
                    {{ comment.content }}
                    <div>
                        <a class="badge badge-secondary edit-comment" (click)="onCommentSelect(comment)">Edit</a>
                        &nbsp;
                        <a class="badge badge-secondary delete-comment" (click)="onCommentDelete(comment.id)">Delete</a>
                    </div>
                </li>
            </ul>
        </div>`,
  styles: [
    `
    a {
        cursor: pointer;
    }
  `
  ]
})
export default class PostCommentsView implements OnInit {
  @Input() public post: any;

  constructor(private postCommentsService: PostCommentsService) {}

  public ngOnInit() {}

  public onCommentSelect(comment: any) {
    this.postCommentsService.startedEditing.next(comment);
  }

  public onCommentDelete(id: number) {
    this.postCommentsService
      .deleteComment(id, this.post.id)
      .subscribe()
      .unsubscribe();
  }
}
