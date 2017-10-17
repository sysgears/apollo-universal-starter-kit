import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'post-comment-form',
  template: `
        <form name="comment" class="">
            <div class="form-group">
                <div class="row">
                    <div class="col-2">
                        <label class=" form-control-label">Add comment</label>
                    </div>
                    <div class="col-8">
                        <div class="has-normal form-group">
                            <input type="text" name="content" value="" placeholder="Content" class="form-control"></div>
                    </div>
                    <div class="col-2">
                        <button type="submit" class="float-right btn btn-primary">Save</button>
                    </div>
                </div>
            </div>
        </form>
  `
})
export class PostCommentForm implements OnInit {
  constructor() {}

  public ngOnInit() {}
}
