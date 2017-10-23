import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
                  <div *ngIf="!title.valid && title.touched" class="form-control-feedback">Required</div>
              </div>
          </div>
          <div class="has-normal form-group">
              <label class="form-control-label">Content</label>
              <div>
                  <input [ngModel]="post ? post.content : ''" #content="ngModel" name="content" type="text" placeholder="Content" class="form-control" required>
                  <div *ngIf="!content.valid && content.touched" class="form-control-feedback">Required</div>
              </div>
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="submitting">Save</button>
      </form>`,
  styles: [
    `
    input.ng-invalid.ng-touched {
        color: red;
    }
  `
  ]
})
export default class PostForm implements OnInit, OnDestroy {
  private submitting: boolean = false;
  @Input() public post: any;
  @ViewChild('postForm') public postForm: NgForm;
  private subscription: Subscription;

  constructor(private postEditService: PostEditService, private router: Router) {}

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
        // TODO: add an ability to refresh posts list after adding a new post w/o page reloading
        // this.postEditService.postAdded.next(addPost);
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
