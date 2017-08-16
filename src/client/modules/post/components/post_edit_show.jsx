import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

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
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>
          Loading...
        </Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>
          {post ? 'Edit' : 'Create'} Post
        </Text>
        <PostForm onSubmit={onSubmit(post, addPost, editPost)} initialValues={post} />
      </View>
    );
  }
};

PostEditShow.propTypes = {
  loading: PropTypes.bool.isRequired,
  post: PropTypes.object,
  addPost: PropTypes.func.isRequired,
  editPost: PropTypes.func.isRequired,
  //match: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  element: {
    paddingTop: 30
  },
  box: {
    textAlign: 'center',
    marginLeft: 15,
    marginRight: 15
  },
});

export default PostEditShow;
