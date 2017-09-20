import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Button } from 'reactstrap';

import PageLayout from '../../../app/PageLayout';

function renderPosts(posts, deletePost) {
  return posts.edges.map(({ node: { id, title } }) => {
    return (
      <ListGroupItem className="justify-content-between" key={id}>
        <span>
          <Link className="post-link" to={`/post/${id}`}>
            {title}
          </Link>
        </span>
        <span className="badge badge-default badge-pill delete-button" onClick={deletePost(id)}>
          Delete
        </span>
      </ListGroupItem>
    );
  });
}

function renderLoadMore(posts, loadMoreRows) {
  if (posts.pageInfo.hasNextPage) {
    return (
      <Button id="load-more" color="primary" onClick={loadMoreRows}>
        Load more ...
      </Button>
    );
  }
}

const PostList = ({ loading, posts, deletePost, loadMoreRows }) => {
  const renderMetaData = () => (
    <Helmet
      title="Apollo Starter Kit - Posts list"
      meta={[
        {
          name: 'description',
          content: 'Apollo Fullstack Starter Kit - List of all posts example page'
        }
      ]}
    />
  );

  if (loading) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">Loading...</div>
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        {renderMetaData()}
        <h2>Posts</h2>
        <Link to="/post/0">
          <Button color="primary">Add</Button>
        </Link>
        <h1 />
        <ListGroup>{renderPosts(posts, deletePost)}</ListGroup>
        <div>
          <small>
            ({posts.edges.length} / {posts.totalCount})
          </small>
        </div>
        {renderLoadMore(posts, loadMoreRows)}
      </PageLayout>
    );
  }
};

PostList.propTypes = {
  loading: PropTypes.bool.isRequired,
  posts: PropTypes.object,
  deletePost: PropTypes.func.isRequired,
  loadMoreRows: PropTypes.func.isRequired
};

export default PostList;
