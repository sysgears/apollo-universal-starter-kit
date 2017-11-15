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
  styles: [`input.ng-invalid.ng-touched {border: 1px solid red;}`]
})
export default class PostCommentForm implements OnInit, OnDestroy {
  @ViewChild('commentForm') public commentForm: NgForm;
  @Input() public postId: number;
  public comment: any;
  public submitting = false;
  private editMode = false;
  private subsOnEdit: Subscription;
  private subscription: Subscription;

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
    this.unsubscribe(this.subsOnEdit, this.subscription);
  }

  public getOperation() {
    return this.editMode ? 'Edit' : 'Add';
  }

  public onFormSubmitted() {
    this.submitting = true;
    this.unsubscribe(this.subscription);
    const { content } = this.commentForm.value;
    if (this.comment) {
      this.subscription = this.postCommentsService.editComment(this.comment.id, this.postId, content);
      this.editMode = false;
      this.comment = null;
    } else {
      this.subscription = this.postCommentsService.addComment(content, this.postId);
    }
    this.commentForm.reset();
    this.subscription.unsubscribe();
    this.submitting = false;
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
