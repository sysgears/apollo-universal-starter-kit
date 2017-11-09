import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import PostCommentsService from '../containers/PostComments';
import { CommentSelect } from '../reducers/index';

@Component({
  selector: 'post-comment-form',
  template: `
        <form (ngSubmit)="onFormSubmitted()" #commentForm="ngForm" name="comment">
            <div class="form-group">
                <div class="row">
                    <div class="col-2">
                        <label class=" form-control-label">{{ getOperation() }} comment</label>
                    </div>
                    <div class="col-8">
                        <div class="has-normal form-group">
                            <input ngModel name="content" #content="ngModel" type="text" placeholder="Content" class="form-control" required>
                            <div ngClass="content.to" *ngIf="!content.valid && content.touched" class="form-control-feedback" style="color: red;">Required</div>
                        </div>
                    </div>
                    <div class="col-2">
                        <button type="submit" class="float-right btn btn-primary" [disabled]="submitting">Save</button>
                    </div>
                </div>
            </div>
        </form>`,
  styles: [
    `
      input.ng-invalid.ng-touched {
        border: 1px solid red;
      }

    `
  ]
})
export default class PostCommentForm implements OnInit, OnDestroy {
  @ViewChild('commentForm') public commentForm: NgForm;
  @Input() public postId: number;
  private subsOnEdit: Subscription;
  private subscription: Subscription;
  private editMode = false;
  public comment: any;
  public submitting = false;

  constructor(private postCommentsService: PostCommentsService, private store: Store<any>) {}

  public ngOnInit(): void {
    this.subsOnEdit = this.store.select('post').subscribe(({ comment }: any) => {
      this.comment = comment;
      this.editMode = comment.id !== null;
      if (Object.keys(this.commentForm.controls).length) {
        this.commentForm.setValue({
          content: this.comment.content
        });
      }
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe(this.subscription);
  }

  public getOperation() {
    return this.editMode ? 'Edit' : 'Add';
  }

  public onFormSubmitted() {
    this.submitting = true;
    this.unsubscribe(this.subscription);
    const { content } = this.commentForm.value;
    if (this.comment.id !== null) {
      this.subscription = this.postCommentsService.editComment(this.comment.id, this.postId, content).subscribe();
      this.editMode = false;
    } else {
      this.subscription = this.postCommentsService.addComment(content, this.postId).subscribe();
    }
    this.store.dispatch(new CommentSelect({ id: null, content: '' }));
    this.commentForm.reset();
    this.submitting = false;
  }

  private unsubscribe = (...subscriptions: Subscription[]) => {
    subscriptions.forEach((subscription: Subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  };
}

// import React from 'react';
// import PropTypes from 'prop-types';
// import { Field, reduxForm } from 'redux-form';
// import { Form, RenderField, Row, Col, Label, Button } from '../../common/components/web';
//
// const required = value => (value ? undefined : 'Required');
//
// const PostCommentForm = ({ handleSubmit, submitting, initialValues, onSubmit }) => {
//   let operation = 'Add';
//   if (initialValues.id !== null) {
//     operation = 'Edit';
//   }
//
//   return (
//     <Form name="comment" onSubmit={handleSubmit(onSubmit)}>
//   <Row>
//     <Col xs="2">
//     <Label>{operation} comment</Label>
//   </Col>
//   <Col xs="8">
//   <Field name="content" component={RenderField} type="text" validate={required} />
//   </Col>
//   <Col xs="2">
//   <Button color="primary" type="submit" className="float-right" disabled={submitting}>
//     Save
//     </Button>
//     </Col>
//     </Row>
//     </Form>
// );
// };
//
// PostCommentForm.propTypes = {
//   handleSubmit: PropTypes.func,
//   initialValues: PropTypes.object,
//   onSubmit: PropTypes.func,
//   submitting: PropTypes.bool
// };
//
// export default reduxForm({
//   form: 'comment',
//   enableReinitialize: true
// })(PostCommentForm);
