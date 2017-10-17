import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'post-comments-view',
  template: `
        <div>
            <h3>Comments</h3>
            <post-comment-form></post-comment-form>
            <h1></h1>
            <ul class="list-group">
                <li class="d-flex justify-content-between list-group-item">
                    test
                    <div>
                        <a class="badge badge-secondary edit-comment" href="#">Edit</a>
                        &nbsp;
                        <a class="badge badge-secondary delete-comment" href="#">Delete</a>
                    </div>
                </li>
            </ul>
        </div>
  `
})
export class PostCommentsView implements OnInit {
  constructor() {}

  public ngOnInit() {}
}
