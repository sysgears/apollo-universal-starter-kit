import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

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
  styles: [`input.ng-invalid.ng-touched {border: 1px solid red;}`]
})
export default class PostForm implements OnDestroy {
  @Input() public post: any;
  @ViewChild('postForm') public postForm: NgForm;
  private submitting: boolean = false;
  private subscription: Subscription;

  constructor(private postEditService: PostEditService, private router: Router) {}

  public onSubmit() {
    this.submitting = true;
    this.unsubscribe(this.subscription);
    const { title, content } = this.postForm.value;
    if (this.post) {
      this.subscription = this.postEditService.editPost(this.post.id, title, content, () => {
        this.router.navigate(['/posts']);
      });
    } else {
      this.subscription = this.postEditService.addPost(title, content, ({ data: { addPost } }: any) => {
        this.router.navigate(['/post', addPost.id]);
        this.submitting = false;
      });
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribe(this.subscription);
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
