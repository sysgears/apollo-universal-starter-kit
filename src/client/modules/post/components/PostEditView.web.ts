import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import PostEditService from '../containers/PostEdit';

@Component({
  selector: 'post-edit-view',
  template: `
      <div *ngIf="!loading; else showLoading" class="container">
          <a id="back-button" [routerLink]="['/posts']">Back</a>
          <h2>{{ title }} Post</h2>
          <post-form [post]="post"></post-form>
          <br/>
          <post-comments-view *ngIf="post" [post]="post"></post-comments-view>
      </div>
      <ng-template #showLoading>
          <div class="text-center">Loading...</div>
      </ng-template>`
})
export default class PostEditView implements OnInit {
  public loading: boolean = true;
  public title: string;
  public post: any;

  constructor(private postEditService: PostEditService, private route: ActivatedRoute, private ngZone: NgZone) {}

  public ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.postEditService.getPost(+params.id).subscribe(({ data: { post }, loading }: any) => {
        this.ngZone.run(() => {
          this.post = post;
          this.loading = loading;
          this.title = !this.post ? 'Create' : 'Edit';
        });
      });
    });
  }
}

// import React from 'react';
// import PropTypes from 'prop-types';
// import Helmet from 'react-helmet';
// import { Link } from 'react-router-dom';
//
// import { PageLayout } from '../../common/components/web';
// import PostForm from './PostForm';
// import PostComments from '../containers/PostComments';
//
// const onSubmit = (post, addPost, editPost) => values => {
//   if (post) {
//     editPost(post.id, values.title, values.content);
//   } else {
//     addPost(values.title, values.content);
//   }
// };
//
// const PostEditView = ({ loading, post, match, location, subscribeToMore, addPost, editPost }) => {
//   let postObj = post;
//
//   // if new post was just added read it from router
//   if (!postObj && location.state) {
//     postObj = location.state.post;
//   }
//
//   const renderMetaData = () => (
//     <Helmet
//       title="Apollo Starter Kit - Edit post"
//   meta={[
//     {
//       name: 'description',
//       content: 'Edit post example page'
//     }
//     ]}
//   />
// );
//
//   if (loading && !postObj) {
//     return (
//       <PageLayout>
//         {renderMetaData()}
//       <div className="text-center">Loading...</div>
//     </PageLayout>
//   );
//   } else {
//     return (
//       <PageLayout>
//         {renderMetaData()}
//       <Link id="back-button" to="/posts">
//       Back
//       </Link>
//       <h2>{post ? 'Edit' : 'Create'} Post</h2>
//     <PostForm onSubmit={onSubmit(postObj, addPost, editPost)} initialValues={postObj} />
//     <br />
//     {postObj && (
//       <PostComments
//         postId={Number(match.params.id)}
//     comments={postObj.comments}
//     subscribeToMore={subscribeToMore}
//     />
//   )}
//     </PageLayout>
//   );
//   }
// };
//
// PostEditView.propTypes = {
//   loading: PropTypes.bool.isRequired,
//   post: PropTypes.object,
//   addPost: PropTypes.func.isRequired,
//   editPost: PropTypes.func.isRequired,
//   match: PropTypes.object.isRequired,
//   location: PropTypes.object.isRequired,
//   subscribeToMore: PropTypes.func.isRequired
// };
//
// export default PostEditView;
