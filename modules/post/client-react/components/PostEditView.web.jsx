import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { translate } from '@gqlapp/i18n-client-react';
import { PageLayout } from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';

import PostForm from './PostForm';
import PostComments from '../containers/PostComments';

const onSubmit = (post, editPost) => values => {
  editPost(post.id, values.title, values.content);
};

const PostEditView = ({ loading, post, match, location, subscribeToMore, editPost, t }) => {
  let postObj = post;
  // if new post was just added read it from router
  if (!postObj && location.state) {
    postObj = location.state.post;
  }

  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - ${t('post.title')}`}
      meta={[
        {
          name: 'description',
          content: t('post.meta')
        }
      ]}
    />
  );

  if (loading && !postObj) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">{t('post.loadMsg')}</div>
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        {renderMetaData()}
        <Link to="/posts">{t('post.btn.back')}</Link>
        <h2>
          {t(`post.label.edit`)} {t('post.label.post')}
        </h2>
        <PostForm onSubmit={onSubmit(postObj, editPost)} post={post} />
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

PostEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  post: PropTypes.object,
  editPost: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('post')(PostEditView);
