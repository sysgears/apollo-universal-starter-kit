import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'post-form',
  template: `
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
  `
})
export default class PostForm implements OnInit {
  public post: { id: number; title: string; content: string; postId: number };

  constructor() {}

  public ngOnInit() {}
}
