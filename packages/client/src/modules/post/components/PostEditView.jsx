import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Loading } from '../../common/components/native';

import translate from '../../../i18n';
import PostForm from './PostForm';
import PostComments from '../containers/PostComments';

const onSubmit = (post, addPost, editPost) => values => {
  if (post) {
    editPost(post.id, values.title, values.content);
  } else {
    addPost(values.title, values.content);
  }
};

const PostEditView = ({ loading, post, navigation, subscribeToMore, addPost, editPost, t }) => {
  let postObj = post;

  // if new post was just added read it from router
  if (!postObj && navigation.state) {
    postObj = navigation.state.params.post;
  }

  if (loading && !postObj) {
    return <Loading text={t('post.loadMsg')} />;
  } else {
    return (
      <View style={styles.container}>
        <ScrollView>
          <PostForm onSubmit={onSubmit(postObj, addPost, editPost)} post={post} />
          {postObj && (
            <PostComments
              postId={navigation.state.params.id}
              comments={postObj.comments}
              subscribeToMore={subscribeToMore}
            />
          )}
        </ScrollView>
      </View>
    );
  }
};

PostEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  post: PropTypes.object,
  addPost: PropTypes.func.isRequired,
  editPost: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  t: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});

export default translate('post')(PostEditView);
