import { Component } from '@angular/core';

@Component({
  selector: 'posts-view',
  template: `
      <div id="content" class="container">
        <h2>Posts</h2>
        <a href="/post/0">
          <button class="btn btn-primary">Add</button>
        </a>
        <h1></h1>
        <ul class="list-group">
          <li class="d-flex justify-content-between list-group-item" *ngFor="let post of posts">
              <div>
                  <a href="/post/{{ post }}" class="post-link">Post title {{ post }}</a>
              </div>
              <div>
                  <a href="#" class="badge badge-secondary delete-button">Delete</a>
              </div>
          </li>
        </ul>
        <div>
          <small>(10 / 20)</small>
        </div>
        <button type="button" id="load-more" class="btn btn-primary">Load more ...</button>
      </div>
  `
})
export class PostList {
  public posts = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11];
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
