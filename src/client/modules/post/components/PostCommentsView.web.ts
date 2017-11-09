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
  private subsOnUpdate: Subscription;
  private subsOnDelete: Subscription;
  @Input() public post: any;

  constructor(private postCommentsService: PostCommentsService, private store: Store<any>) {}

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
    this.unsubscribe(this.subsOnUpdate, this.subsOnDelete);
  }

  public onCommentSelect(comment: any) {
    this.store.dispatch(new CommentSelect({ id: comment.id, content: comment.content }));
  }

  public onCommentDelete(id: number) {
    this.unsubscribe(this.subsOnDelete);
    this.subsOnDelete = this.postCommentsService.deleteComment(id, this.post.id).subscribe((result: any) => {
      this.store.dispatch(new CommentSelect({ id: null, content: '' }));
    });
  }

  private unsubscribe = (...subscriptions: Subscription[]) => {
    subscriptions.forEach((subscription: Subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  };
}

// import React from "react";
// import PropTypes from "prop-types";
// import { ListGroup, ListGroupItem, Button } from "reactstrap";
//
// import PostCommentForm from "./PostCommentForm";
//
// function renderComments(comments, onCommentSelect, comment, deleteComment) {
//   return comments.map(({ id, content }) => {
//     return (
//       <ListGroupItem className="d-flex justify-content-between" key={id}>
//     {content}
//     <div>
//     <Button color="primary" size="sm" className="badge badge-secondary edit-comment" onClick={() => onCommentSelect({ id, content })} href="#">
//       Edit
//       </Button>{' '}
//       <Button
//     color="primary"
//     size="sm"
//     className="badge badge-secondary delete-comment"
//     onClick={() => onCommentDelete(comment, deleteComment, onCommentSelect, id)}
//     href="#"
//       >
//       Delete
//       </Button>
//       </div>
//       </ListGroupItem>
//   );
//   });
// }
//
// function onCommentDelete(comment, deleteComment, onCommentSelect, id) {
//   if (comment.id === id) {
//     onCommentSelect({ id: null, content: "" });
//   }
//
//   deleteComment(id);
// }
//
// const onSubmit = (comment, postId, addComment, editComment, onCommentSelect, onFormSubmitted) => values => {
//   if (comment.id === null) {
//     addComment(values.content, postId);
//   } else {
//     editComment(comment.id, values.content);
//   }
//
//   onCommentSelect({ id: null, content: "" });
//   onFormSubmitted();
// };
//
// const PostCommentsView = ({
//                             postId,
//                             comment,
//                             addComment,
//                             editComment,
//                             comments,
//                             onCommentSelect,
//                             deleteComment,
//                             onFormSubmitted
//                           }) => {
//   return (
//     <div>
//       <h3>Comments</h3>
//     <PostCommentForm
//   postId={postId}
//   onSubmit={onSubmit(comment, postId, addComment, editComment, onCommentSelect, onFormSubmitted)}
//   initialValues={comment}
//   />
//   <h1 />
//   <ListGroup>{renderComments(comments, onCommentSelect, comment, deleteComment)}</ListGroup>
//   </div>
// );
// };
//
// PostCommentsView.propTypes = {
//   postId: PropTypes.number.isRequired,
//   comments: PropTypes.array.isRequired,
//   comment: PropTypes.object.isRequired,
//   addComment: PropTypes.func.isRequired,
//   editComment: PropTypes.func.isRequired,
//   deleteComment: PropTypes.func.isRequired,
//   onCommentSelect: PropTypes.func.isRequired,
//   onFormSubmitted: PropTypes.func.isRequired,
//   subscribeToMore: PropTypes.func.isRequired
// };
//
// export default PostCommentsView;
