import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import PostForm from './PostForm';
import PostComments from '../containers/PostComments';

const onSubmit = (post, addPost, editPost) => values => {
  if (post) {
    editPost(post.id, values.title, values.content);
  } else {
    addPost(values.title, values.content);
  }
};

const PostEditView = ({ loading, post, navigation, subscribeToMore, addPost, editPost }) => {
  let postObj = post;

  // if new post was just added read it from router
  if (!postObj && navigation.state) {
    postObj = navigation.state.params.post;
  }

  if (loading && !postObj) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <PostForm onSubmit={onSubmit(postObj, addPost, editPost)} initialValues={postObj ? postObj : {}} />
        {postObj && (
          <PostComments
            postId={navigation.state.params.id}
            comments={postObj.comments}
            subscribeToMore={subscribeToMore}
          />
        )}
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
  subscribeToMore: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  }
});

export default PostEditView;
