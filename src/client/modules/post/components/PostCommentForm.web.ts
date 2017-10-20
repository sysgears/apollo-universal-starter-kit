import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import PostCommentsService from '../containers/PostComments';

@Component({
  selector: 'post-comment-form',
  template: `
        <form (ngSubmit)="onSubmit()" #commentForm="ngForm" name="comment">
            <div class="form-group">
                <div class="row">
                    <div class="col-2">
                        <label class=" form-control-label">{{ operation }} comment</label>
                    </div>
                    <div class="col-8">
                        <div class="has-normal form-group">
                            <input ngModel name="content" type="text" placeholder="Content" class="form-control" required></div>
                    </div>
                    <div class="col-2">
                        <button type="submit" class="float-right btn btn-primary" [disabled]="submitting">Save</button>
                    </div>
                </div>
            </div>
        </form>
  `
})
export default class PostCommentForm implements OnInit, OnDestroy {
  @ViewChild('commentForm') public commentForm: NgForm;
  private subsOnEdit: Subscription;
  public comment: any;
  public operation = 'Add';
  public submitting = false;

  constructor(private postCommentsService: PostCommentsService) {}

  public ngOnInit(): void {
    this.subsOnEdit = this.postCommentsService.startedEditing.subscribe((comment: any) => {
      this.comment = comment;
      this.operation = 'Edit';
      this.commentForm.setValue({
        content: this.comment.content
      });
    });
  }

  public ngOnDestroy(): void {
    this.subsOnEdit.unsubscribe();
  }

  public onSubmit() {
    this.submitting = true;
  }
}
