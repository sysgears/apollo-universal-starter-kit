import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import translate from '../../../i18n';
import { PageLayout } from '../../common/components/web';
import PostForm from './PostForm';
import PostComments from '../containers/PostComments';
import settings from '../../../../../../settings';

const onSubmit = (post, addPost, editPost) => values => {
  if (post) {
    editPost(post.id, values.title, values.content);
  } else {
    addPost(values.title, values.content);
  }
};

const PostEditView = ({ loading, post, match, location, subscribeToMore, addPost, editPost, t }) => {
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
        <Link id="back-button" to="/posts">
          {t('post.btn.back')}
        </Link>
        <h2>
          {t(`post.label.${post ? 'edit' : 'create'}`)} {t('post.label.post')}
        </h2>
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

PostEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  post: PropTypes.object,
  addPost: PropTypes.func.isRequired,
  editPost: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('post')(PostEditView);
