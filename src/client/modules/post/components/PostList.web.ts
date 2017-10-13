import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'posts-view',
  template: `
      <div class="container">
          <h2>Posts</h2>
          <a [routerLink]="['/post/0']">
              <button class="btn btn-primary">Add</button>
          </a>
          <h1></h1>
          <ul class="list-group">
              <li class="d-flex justify-content-between list-group-item" *ngFor="let post of loadedPosts">
                  <div>
                      <a [routerLink]="['/post', post.id]" class="post-link">{{ post.title }}</a>
                  </div>
                  <div>
                      <a class="badge badge-secondary delete-button" style="cursor: pointer;" (click)="deletePost(post.id)">Delete</a>
                  </div>
              </li>
          </ul>
          <div>
              <small>({{ loadedCount }} / {{ totalCount }})</small>
          </div>
          <button type="button" id="load-more" class="btn btn-primary" *ngIf="hasNextPage()" (click)="loadMoreRows()">Load more ...</button>
      </div>
	`
})
export class PostList implements OnInit {
  // Only for test
  public postIndexes = Array.from(new Array(20), (val, index) => index + 1);
  public totalCount: number;
  public posts: Array<{ id: number; title: string; content: string; postId: number }> = [];
  public loadedCount = 10;
  public loadedPosts: Array<{ id: number; title: string; content: string; postId: number }>;

  constructor() {}

  public ngOnInit() {
    for (const index of this.postIndexes) {
      this.posts.push({ id: index, title: `Post title ${index}`, content: 'test', postId: index });
    }
    this.loadedPosts = this.posts
      .slice()
      .reverse()
      .slice(0, this.loadedCount);
    this.totalCount = this.posts.length;
  }

  public loadMoreRows() {
    const remainingCount = this.totalCount - (this.loadedCount + 10);
    if (remainingCount > 0) {
      this.loadedCount = this.loadedCount + 10;
      this.loadedPosts = this.posts
        .slice()
        .reverse()
        .slice(0, this.loadedCount);
    } else {
      this.loadedCount = this.totalCount;
      this.loadedPosts = this.posts.slice().reverse();
    }
  }

  public hasNextPage() {
    return this.totalCount > this.loadedCount;
  }

  public deletePost(id: number) {
    this.posts = this.posts.filter(post => post.id !== id);
    this.loadedPosts = this.loadedPosts.filter(post => post.id !== id);
    this.loadedCount--;
    this.totalCount--;
  }
}

// import React from 'react';
// import PropTypes from 'prop-types';
// import Helmet from 'react-helmet';
// import { Link } from 'react-router-dom';
// import { ListGroup, ListGroupItem, Button } from 'reactstrap';

// import PageLayout from '../../../app/PageLayout';
//
// function renderPosts(posts, deletePost) {
//     return posts.edges.map(({ node: { id, title } }) => {
//         return (
//             <ListGroupItem className="d-flex justify-content-between" key={id}>
//         <div>
//             <Link className="post-link" to={`/post/${id}`}>
//         {title}
//         </Link>
//         </div>
//         <div>
//         <span className="badge badge-secondary delete-button" onClick={deletePost(id)}>
//             Delete
//             </span>
//             </div>
//             </ListGroupItem>
//     );
//     });
// }
//
// function renderLoadMore(posts, loadMoreRows) {
//     if (posts.pageInfo.hasNextPage) {
//         return (
//             <Button id="load-more" color="primary" onClick={loadMoreRows}>
//             Load more ...
//         </Button>
//     );
//     }
// }
//
// const PostList = ({ loading, posts, deletePost, loadMoreRows }) => {
//     const renderMetaData = () => (
//         <Helmet
//             title="Apollo Starter Kit - Posts list"
//     meta={[
//         {
//             name: 'description',
//             content: 'Apollo Fullstack Starter Kit - List of all posts example page'
//         }
//         ]}
//     />
// );
//
//     if (loading) {
//         return (
//             <PageLayout>
//                 {renderMetaData()}
//             <div className="text-center">Loading...</div>
//         </PageLayout>
//     );
//     } else {
//         return (
//             <PageLayout>
//                 {renderMetaData()}
//             <h2>Posts</h2>
//             <Link to="/post/0">
//         <Button color="primary">Add</Button>
//             </Link>
//             <h1 />
//             <ListGroup>{renderPosts(posts, deletePost)}</ListGroup>
//             <div>
//             <small>
//                 ({posts.edges.length} / {posts.totalCount})
//         </small>
//         </div>
//         {renderLoadMore(posts, loadMoreRows)}
//         </PageLayout>
//     );
//     }
// };
//
// PostList.propTypes = {
//     loading: PropTypes.bool.isRequired,
//     posts: PropTypes.object,
//     deletePost: PropTypes.func.isRequired,
//     loadMoreRows: PropTypes.func.isRequired
// };

// export default PostList;
