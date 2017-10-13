import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'post-edit-view',
  template: `
        <div class="container">
            <a id="back-button" [routerLink]="['/posts']">Back</a>
            <h2>Create Post</h2>
            <form name="post" class="">
                <div class="has-normal form-group">
                    <label class="form-control-label">Title</label>
                    <div>
                        <input type="text" name="title" value="" placeholder="Title" class="form-control">
                    </div>
                </div>
                <div class="has-normal form-group">
                    <label class="form-control-label">Content</label>
                    <div>
                        <input type="text" name="content" value="" placeholder="Content" class="form-control">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Save</button>
            </form>
            <ul class="list-group" *ngIf="post">
                <li class="d-flex justify-content-between list-group-item">
                    <div>
                        <a href="#" class="badge badge-secondary edit-comment">Edit</a>&nbsp;<a class="badge badge-secondary delete-comment" href="#">Delete</a>
                    </div>
                </li>
            </ul>
        </div>
  `
})
export class PostEditView implements OnInit {
  public post: { id: number; title: string; content: string; postId: number };

  constructor() {}

  public ngOnInit() {}
}
