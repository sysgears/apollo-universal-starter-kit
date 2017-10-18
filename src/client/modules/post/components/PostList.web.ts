import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { PostService } from '../containers/Post';

@Component({
  selector: 'posts-view',
  template: `
      <div *ngIf="!loading; else showLoading" class="container">
          <h2>Posts</h2>
          <a [routerLink]="['/post/0']">
              <button class="btn btn-primary">Add</button>
          </a>
          <h1></h1>
          <ul class="list-group">
              <li class="d-flex justify-content-between list-group-item" *ngFor="let post of renderPosts()">
                  <div>
                      <a [routerLink]="['/post', post.id]" class="post-link">{{ post.title }}</a>
                  </div>
                  <div>
                      <a class="badge badge-secondary delete-button" style="cursor: pointer;" (click)="deletePost(post.id)">Delete</a>
                  </div>
              </li>
          </ul>
          <div>
              <small>({{ posts.edges.length }} / {{ posts.totalCount }})</small>
          </div>
          <button type="button" id="load-more" class="btn btn-primary" *ngIf="hasNextPage()" (click)="loadMoreRows()">Load more ...</button>
      </div>
      <ng-template #showLoading>
          <div class="text-center">Loading...</div>
      </ng-template>
	`
})
export class PostList implements OnInit {
  public loading: boolean = true;
  public posts: any;
  public endCursor: number;

  constructor(private postService: PostService, private ngZone: NgZone) {}

  public ngOnInit() {
    this.endCursor = this.posts ? this.posts.pageInfo.endCursor : 0;
    this.postService.subscribeToPostList(this.endCursor, this.subscribeCb);
    this.postService.getPosts(this.getPostsCb);
  }

  public renderPosts() {
    return this.posts.edges.map((edge: any): any => {
      return { id: edge.node.id, title: edge.node.title };
    });
  }

  public loadMoreRows() {
    this.postService.loadMoreRows(this.posts.pageInfo.endCursor);
  }

  public hasNextPage() {
    return this.posts.pageInfo.hasNextPage;
  }

  public deletePost(id: number) {
    this.postService.deletePost(id);
  }

  /* Callbacks */

  private subscribeCb = (res: any) => {
    this.posts = res.data.postsUpdated;
  };

  private getPostsCb = (res: any) => {
    this.ngZone.run(() => {
      this.posts = res.data.posts;
      this.loading = res.loading;
      this.endCursor = this.posts.pageInfo.endCursor;
    });
  };
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
