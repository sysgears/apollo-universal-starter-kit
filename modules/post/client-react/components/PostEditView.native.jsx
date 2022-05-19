import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView, Keyboard } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { translate } from '@gqlapp/i18n-client-react';
import { Loading } from '@gqlapp/look-client-react-native';

import PostForm from './PostForm';
import PostComments from '../containers/PostComments';

const onSubmit = (post, editPost) => (values) => {
  editPost(post.id, values.title, values.content);
  Keyboard.dismiss();
};

const PostEditView = ({ loading, post, route, subscribeToMore, editPost, t }) => {
  let postObj = post;
  // if new post was just added read it from router
  if (!postObj && route.params) {
    postObj = route.params.post;
  }

  if (loading && !postObj) {
    return <Loading text={t('post.loadMsg')} />;
  }
  return (
    <View style={styles.container}>
      <ScrollView keyboardDismissMode="none" keyboardShouldPersistTaps="always">
        <PostForm onSubmit={onSubmit(postObj, editPost)} post={post} />
        {postObj && (
          <PostComments postId={route.params.id} comments={postObj.comments} subscribeToMore={subscribeToMore} />
        )}
        <KeyboardSpacer />
      </ScrollView>
    </View>
  );
};

PostEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  post: PropTypes.object,
  editPost: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  t: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

export default translate('post')(PostEditView);
