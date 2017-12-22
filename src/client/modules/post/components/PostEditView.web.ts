import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { assign, pick } from 'lodash';
import { Subscription } from 'rxjs/Subscription';

import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { FormInput } from '../../ui-bootstrap/components/Form';
import { ItemType } from '../../ui-bootstrap/components/FormItem';
import { PostEditService } from '../containers/PostEdit';
import { FillPostFormAction, PostFormData, PostFormState, ResetPostFormAction } from '../reducers/index';

@Component({
  selector: 'post-edit-view',
  template: `
      <div *ngIf="!loading; else showLoading">
          <ausk-link [id]="'back-button'" [to]="'/posts'">Back</ausk-link>
          <h2>{{ title }}</h2>
          <ausk-form [onSubmit]="onSubmit"
                     [formName]="'postForm'"
                     [formState]="formState"
                     [loading]="loading"
                     [form]="form"
                     [btnName]="'Save'">
          </ausk-form>
          <br/>
          <post-comments-view *ngIf="post && post.id" [post]="post"></post-comments-view>
      </div>
      <ng-template #showLoading>
          <div class="text-center">Loading...</div>
      </ng-template>`
})
export class PostEditView implements OnInit, OnDestroy {
  public loading: boolean = true;
  public submitting: boolean = false;
  public title: string;
  public post: any;
  public alerts: any[] = [];
  private subsOnChange: Subscription;
  private subsOnLoad: Subscription;

  public formState: FormGroupState<PostFormData>;
  public form: FormInput[];

  constructor(
    private postEditService: PostEditService,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private router: Router,
    private store: Store<PostFormState>
  ) {
    store.select(s => s.postForm).subscribe((res: any) => {
      this.formState = res;
    });
  }

  public ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.subsOnLoad = this.postEditService.getPost(+params.id, ({ data: { post }, loading }: any) => {
        this.ngZone.run(() => {
          this.post = post || {};
          this.form = this.createForm();
          this.loading = loading;
          this.title = post ? 'Edit Post' : 'Create Post';
          const action = post
            ? new FillPostFormAction(assign({}, pick(post, ['title', 'content'])))
            : new ResetPostFormAction();
          this.store.dispatch(action);
        });
      });
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe(this.subsOnLoad, this.subsOnChange);
  }

  public onSubmit = (form: any) => {
    this.submitting = true;
    this.unsubscribe(this.subsOnChange);
    const { title, content } = form;
    if (this.post && this.post.id) {
      this.subsOnChange = this.postEditService.editPost(this.post.id, title, content, () => {
        this.store.dispatch(new ResetPostFormAction());
        this.router.navigate(['/posts']);
      });
    } else {
      this.subsOnChange = this.postEditService.addPost(title, content, ({ data: { addPost } }: any) => {
        this.store.dispatch(new ResetPostFormAction());
        this.submitting = false;
        this.router.navigate(['/post', addPost.id]);
      });
    }
  };

  private createForm = () => {
    return [
      {
        id: 'title-input',
        name: 'title',
        value: 'Title',
        type: 'text',
        label: 'Title',
        placeholder: 'Title',
        inputType: ItemType.INPUT,
        minLength: 1,
        required: true
      },
      {
        id: 'content-input',
        name: 'content',
        value: 'Content',
        type: 'text',
        label: 'Content',
        placeholder: 'Content',
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
