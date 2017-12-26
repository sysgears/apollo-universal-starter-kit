import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { assign, pick } from 'lodash';
import { Subscription } from 'rxjs/Subscription';

import { FormGroupState } from 'ngrx-forms';
import { FormInput } from '../../ui-bootstrap/components/Form';
import { ItemType } from '../../ui-bootstrap/components/FormItem';
import { CellData, ColumnData, ElemType } from '../../ui-bootstrap/components/Table';
import { PostCommentsService, AddComment, DeleteComment, UpdateComment } from '../containers/PostComments';
import { CommentFormData, CommentSelect, FillCommentFormAction, ResetCommentFormAction } from '../reducers/index';

@Component({
  selector: 'post-comments-view',
  template: `
    <div>
      <h3>Comments</h3>
      <ausk-form [onSubmit]="onSubmit"
                 [formName]="'commentForm'"
                 [formState]="formState"
                 [loading]="loading"
                 [form]="form"
                 [btnName]="'Save'">
      </ausk-form>

      <h1></h1>
      <ausk-table
          [columns]="columns"
          [rows]="rows">
      </ausk-table>
    </div>`
})
export class PostCommentsView implements OnInit, OnDestroy {
  @Input() public post: any;

  public comment: any;
  public loading: boolean = true;
  public submitting: boolean = false;
  public formState: FormGroupState<CommentFormData>;
  public form: FormInput[];

  private subsOnUpdate: Subscription;
  private subsOnDelete: Subscription;
  private subsOnEdit: Subscription;

  private columns: ColumnData[] = [{ title: 'Content' }, { title: 'Actions', width: 50, columnSpan: 2 }];
  private rows: CellData[];

  constructor(private postCommentsService: PostCommentsService, private ngZone: NgZone, private store: Store<any>) {
    store.select(s => s.commentForm).subscribe((res: any) => {
      this.formState = res;
    });
  }

  public ngOnInit() {
    this.subsOnEdit = this.store.select('post').subscribe(({ comment }: any) => {
      this.rows = this.createRows(this.post);

      this.ngZone.run(() => {
        this.updateForm(comment);
      });
    });

    this.subsOnUpdate = this.postCommentsService.subscribeToCommentList(
      this.post.id,
      ({ data: { commentUpdated: { mutation, node, id } } }: any) => {
        if (mutation === 'CREATED') {
          this.post = AddComment(this.post, node);
        } else if (mutation === 'UPDATED') {
          this.post = UpdateComment(this.post, node);
        } else if (mutation === 'DELETED') {
          this.post = DeleteComment(this.post, id);
        }
        this.rows = this.createRows(this.post);
      }
    );
  }

  public ngOnDestroy(): void {
    this.unsubscribe(this.subsOnUpdate, this.subsOnDelete);
  }

  public onCommentSelect = (comment: any) => {
    this.store.dispatch(new CommentSelect(comment));
  };

  public onCommentDelete = (id: number) => {
    this.unsubscribe(this.subsOnDelete);
    this.subsOnDelete = this.postCommentsService.deleteComment(id, this.post.id);
  };

  public onSubmit = (commentForm: any) => {
    this.submitting = true;
    this.unsubscribe(this.subsOnEdit);
    const { content } = commentForm;

    this.subsOnEdit =
      this.comment && this.comment.id
        ? this.postCommentsService.editComment(this.comment.id, this.post.id, content)
        : this.postCommentsService.addComment(content, this.post.id);

    this.updateForm({});
    this.unsubscribe(this.subsOnEdit);
    this.submitting = false;
  };

  private createRows = (post: any) =>
    post.comments.map((comment: any) => {
      return [
        {
          type: ElemType.Text,
          text: comment.content
        },
        {
          type: ElemType.Button,
          text: 'Edit',
          callback: () => this.onCommentSelect(comment)
        },
        {
          type: ElemType.Button,
          text: 'Delete',
          callback: () => this.onCommentDelete(comment.id)
        }
      ];
    });

  private updateForm = (comment: any) => {
    this.comment = comment;
    this.form = this.createForm(`${comment.id ? 'Edit' : 'Add'} Comment`);
    this.loading = false;
    const action =
      comment && comment.id
        ? new FillCommentFormAction(assign({}, pick(comment, ['content'])))
        : new ResetCommentFormAction();
    this.store.dispatch(action);
  };

  private createForm = (label: string) => {
    return [
      {
        id: 'content-input',
        name: 'content',
        value: '',
        type: 'text',
        label,
        placeholder: 'Comment',
        inputType: ItemType.INPUT,
        minLength: 1,
        required: true
      }
    ];
  };

  private unsubscribe = (...subscriptions: Subscription[]) => {
    subscriptions.forEach((subscription: Subscription) => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
    });
  };
}
