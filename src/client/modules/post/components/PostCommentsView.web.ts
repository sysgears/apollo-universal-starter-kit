import { Component, Input, OnInit } from '@angular/core';
import PostCommentsService from '../containers/PostComments';

@Component({
  selector: 'post-comments-view',
  template: `
        <div>
            <h3>Comments</h3>
            <post-comment-form [postId]="post.id"></post-comment-form>
            <h1></h1>
            <ul class="list-group" *ngFor="let comment of post.comments">
                <li class="d-flex justify-content-between list-group-item">
                    {{ comment.content }}
                    <div>
                        <button class="edit-comment btn btn-primary btn-sm" (click)="onCommentSelect(comment)">Edit</button>
                        &nbsp;
                        <button class="delete-comment  btn btn-primary btn-sm" (click)="onCommentDelete(comment.id)">Delete</button>
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
    this.postCommentsService.deleteComment(id, this.post.id).subscribe();
  }
}
