import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { PostEditService } from '../containers/PostEdit';

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
  private subscription: Subscription = null;

  constructor(private postEditService: PostEditService, private router: Router) {}

  public ngOnInit() {}

  public onSubmit() {
    this.triggerSubmitting();
    const { title, content } = this.postForm.value;
    if (this.post) {
      this.subscription = this.postEditService.editPost(this.post.id, title, content).subscribe({
        next: () => {
          this.router.navigate(['/posts']);
        }
      });
    } else {
      this.subscription = this.postEditService.addPost(title, content).subscribe({
        next: ({ data: { addPost } }: any) => {
          this.router.navigate(['/posts', addPost.id]);
        }
      });
    }
    this.triggerSubmitting();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private triggerSubmitting() {
    this.submitting = !this.submitting;
  }
}
