import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import PageLayout from '../../../app/page_layout';
import PostForm from './post_form';
import PostComments from '../containers/post_comments';

const onSubmit = (post, addPost, editPost) => (values) => {
  if (post) {
    editPost(post.id, values.title, values.content);
  }
  else {
    addPost(values.title, values.content);
  }
};

const PostEditShow = ({ loading, post, match, subscribeToMore, addPost, editPost }) => {

  const renderMetaData = () => (
    <Helmet
      title="Apollo Starter Kit - Edit post"
      meta={[{
        name: 'description',
        content: 'Edit post example page'
      }]} />
  );

  if (loading) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">
          Loading...
        </div>
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        {renderMetaData()}
        <Link id="back-button" to="/posts">Back</Link>
        <h2>{post ? 'Edit' : 'Create'} Post</h2>
        <PostForm onSubmit={onSubmit(post, addPost, editPost)} initialValues={post} />
        <br />
        {post &&
        <PostComments postId={match.params.id} comments={post.comments} subscribeToMore={subscribeToMore} />
        }
      </PageLayout>
    );
  }
};

PostEditShow.propTypes = {
  loading: PropTypes.bool.isRequired,
  post: PropTypes.object,
  addPost: PropTypes.func.isRequired,
  editPost: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
};

export default PostEditShow;
