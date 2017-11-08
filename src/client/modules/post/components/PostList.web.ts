import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import PostService, { AddPost, DeletePost } from '../containers/Post';

@Component({
  selector: 'posts-view',
  template: `
      <div *ngIf="!loading; else showLoading" class="container">
          <h2>Posts</h2>
          <a [routerLink]="['/post/0']">
              <button class="btn btn-primary">Add</button>
          </a>
          <h1></h1>
          <table class="table">
              <thead>
              <tr>
                  <th class="w-100">Title</th>
                  <th class="w-100">Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let post of renderPosts()">
                  <td>
                      <a [routerLink]="['/post', post.id]" class="post-link">{{ post.title }}</a>
                  </td>
                  <td>
                      <button type="button" class="delete-button btn btn-primary btn-sm" (click)="deletePost(post.id)">Delete</button>
                  </td>
              </tr>
              </tbody>
          </table>
          <div>
              <small>({{ posts.edges.length }} / {{ posts.totalCount }})</small>
          </div>
          <button type="button" id="load-more" class="btn btn-primary" *ngIf="posts.pageInfo.hasNextPage" (click)="loadMoreRows()">
              Load more ...
          </button>
      </div>
      <ng-template #showLoading>
          <div class="text-center">Loading...</div>
      </ng-template>
  `
})
export default class PostList implements OnInit, OnDestroy {
  public loading: boolean = true;
  public posts: any = [];
  private subsOnLoad: Subscription;
  private subsOnUpdate: Subscription;

  constructor(private postService: PostService, private ngZone: NgZone) {}

  public ngOnInit() {
    this.subsOnLoad = this.postService.getPosts().subscribe(({ data: { posts }, loading }: any) => {
      this.ngZone.run(() => {
        this.loading = loading;
        this.posts = posts;
        this.postService.updateEndCursor(posts.pageInfo.endCursor);
      });
    });
    this.subsOnUpdate = this.postService.subscribeToPosts().subscribe(({ postsUpdated: { mutation, node } }: any) => {
      if (mutation === 'CREATED') {
        this.posts = AddPost(this.posts, node);
        this.postService.updateEndCursor(this.postService.getEndCursor() + 1);
      } else if (mutation === 'DELETED') {
        this.posts = DeletePost(this.posts, node);
        this.postService.updateEndCursor(this.postService.getEndCursor() - 1);
      }
    });

    this.postService.updateSubscription(this.subsOnUpdate);
  }

  public ngOnDestroy(): void {
    this.subsOnLoad.unsubscribe();
  }

  public renderPosts() {
    if (this.posts.edges.length === 0) {
      return [];
    }
    return this.posts.edges.map((edge: any): any => {
      return { id: edge.node.id, title: edge.node.title };
    });
  }

  public loadMoreRows() {
    this.postService.loadMoreRows();
  }

  public deletePost(id: number) {
    this.postService
      .deletePost(id)
      .subscribe()
      .unsubscribe();
  }
}

// import React from 'react';
// import PropTypes from 'prop-types';
// import Helmet from 'react-helmet';
// import { Link } from 'react-router-dom';
// import { ListGroup, ListGroupItem, Button } from 'reactstrap';
//
// import PageLayout from '../../../app/PageLayout';
//
// function renderPosts(posts, deletePost) {
//   return posts.edges.map(({ node: { id, title } }) => {
//     return (
//       <ListGroupItem className="d-flex justify-content-between" key={id}>
//     <div>
//       <Link className="post-link" to={`/post/${id}`}>
//     {title}
//     </Link>
//     </div>
//     <div>
//     <Button color="primary" size="sm" className="badge badge-secondary delete-button" onClick={deletePost(id)} href="#">
//       Delete
//       </Button>
//       </div>
//       </ListGroupItem>
//   );
//   });
// }
//
// function renderLoadMore(posts, loadMoreRows) {
//   if (posts.pageInfo.hasNextPage) {
//     return (
//       <Button id="load-more" color="primary" onClick={loadMoreRows}>
//       Load more ...
//     </Button>
//   );
//   }
// }
//
// const PostList = ({ loading, posts, deletePost, loadMoreRows }) => {
//   const renderMetaData = () => (
//     <Helmet
//       title="Apollo Starter Kit - Posts list"
//   meta={[
//     {
//       name: 'description',
//       content: 'Apollo Fullstack Starter Kit - List of all posts example page'
//     }
//     ]}
//   />
// );
//
//   if (loading) {
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
//       <h2>Posts</h2>
//       <Link to="/post/0">
//     <Button color="primary">Add</Button>
//       </Link>
//       <h1 />
//       <ListGroup>{renderPosts(posts, deletePost)}</ListGroup>
//       <div>
//       <small>
//         ({posts.edges.length} / {posts.totalCount})
//     </small>
//     </div>
//     {renderLoadMore(posts, loadMoreRows)}
//     </PageLayout>
//   );
//   }
// };
//
// PostList.propTypes = {
//   loading: PropTypes.bool.isRequired,
//   posts: PropTypes.object,
//   deletePost: PropTypes.func.isRequired,
//   loadMoreRows: PropTypes.func.isRequired
// };
//
// export default PostList;
