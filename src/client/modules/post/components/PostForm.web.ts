import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import PostService from '../containers/Post';
import PostEditService from '../containers/PostEdit';

@Component({
  selector: 'post-form',
  template: `
      <form (ngSubmit)="onSubmit()" #postForm="ngForm" name="post">
          <div class="has-normal form-group">
              <label class="form-control-label">Title</label>
              <div>
                  <input [ngModel]="post ? post.title : ''" #title="ngModel" name="title" type="text" placeholder="Title" class="form-control" required>
                  <div *ngIf="!title.valid && title.touched" class="form-control-feedback" style="color: red;">Required</div>
              </div>
          </div>
          <div class="has-normal form-group">
              <label class="form-control-label">Content</label>
              <div>
                  <input [ngModel]="post ? post.content : ''" #content="ngModel" name="content" type="text" placeholder="Content" class="form-control" required>
                  <div *ngIf="!content.valid && content.touched" class="form-control-feedback" style="color: red;">Required</div>
              </div>
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="submitting">Save</button>
      </form>`,
  styles: [
    `
    input.ng-invalid.ng-touched {
        border: 1px solid red;
    }
  `
  ]
})
export default class PostForm implements OnInit, OnDestroy {
  private submitting: boolean = false;
  @Input() public post: any;
  @ViewChild('postForm') public postForm: NgForm;
  private subscription: Subscription;

  constructor(private postService: PostService, private postEditService: PostEditService, private router: Router) {}

  public ngOnInit() {}

  public onSubmit() {
    this.submitting = true;
    const { title, content } = this.postForm.value;
    if (this.post) {
      this.subscription = this.postEditService.editPost(this.post.id, title, content).subscribe(() => {
        this.router.navigate(['/posts']);
      });
    } else {
      this.subscription = this.postEditService.addPost(title, content).subscribe(({ data: { addPost } }: any) => {
        this.router.navigate(['/post', addPost.id]);
        this.submitting = false;
      });
    }
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

// import React from 'react';
// import PropTypes from 'prop-types';
// import { Field, reduxForm } from 'redux-form';
// import { Form, RenderField, Button } from '../../common/components/web';
//
// const required = value => (value ? undefined : 'Required');
//
// const PostForm = ({ handleSubmit, submitting, onSubmit }) => {
//   return (
//     <Form name="post" onSubmit={handleSubmit(onSubmit)}>
//   <Field name="title" component={RenderField} type="text" label="Title" validate={required} />
//   <Field name="content" component={RenderField} type="text" label="Content" validate={required} />
//   <Button color="primary" type="submit" disabled={submitting}>
//     Save
//     </Button>
//     </Form>
// );
// };
//
// PostForm.propTypes = {
//   handleSubmit: PropTypes.func,
//   onSubmit: PropTypes.func,
//   submitting: PropTypes.bool
// };
//
// export default reduxForm({
//   form: 'post',
//   enableReinitialize: true
// })(PostForm);
