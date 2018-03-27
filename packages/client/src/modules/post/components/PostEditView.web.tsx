import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { PageLayout } from '../../common/components/web';
import PostForm from './PostForm.web';
import PostComments from '../containers/PostComments.web';
import settings from '../../../../../../settings';

import { PostProps, AddPostFn, EditPostFn, Post } from '../types';

const onSubmit = (post: Post, addPost: AddPostFn, editPost: EditPostFn) => (values: Post) => {
  if (post) {
    editPost(post.id, values.title, values.content);
  } else {
    addPost(values.title, values.content);
  }
};

const PostEditView = ({ loading, post, match, location, subscribeToMore, addPost, editPost }: PostProps) => {
  let postObj: Post = post;
  // if new post was just added read it from router
  if (!postObj && location.state) {
    postObj = location.state.post;
  }

  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - Edit post`}
      meta={[
        {
          name: 'description',
          content: 'Edit post example page'
        }
      ]}
    />
  );

  if (loading && !postObj) {
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
        <Link id="back-button" to="/posts">
          Back
        </Link>
        <h2>{post ? 'Edit' : 'Create'} Post</h2>
        <PostForm onSubmit={onSubmit(postObj, addPost, editPost)} post={post} />
        <br />
        {postObj && (
          <PostComments
            postId={Number(match.params.id)}
            comments={postObj.comments}
            subscribeToMore={subscribeToMore}
          />
        )}
      </PageLayout>
    );
  }
};

export default PostEditView;
