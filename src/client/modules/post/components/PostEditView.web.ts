import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'post-edit-view',
  template: `
        <div class="container">
            <a id="back-button" [routerLink]="['/posts']">Back</a>
            <h2>Create Post</h2>
            <post-form></post-form>
            <br/>
            <post-comments-view></post-comments-view>
        </div>
  `
})
export class PostEditView implements OnInit {
  public post: { id: number; title: string; content: string; postId: number };

  constructor() {}

  public ngOnInit() {}
}
