import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import PostForm from './PostForm.native';
import PostComments from '../containers/PostComments.native';

import { PostProps, AddPostFn, EditPostFn, Post } from '../types';

const onSubmit = (post: Post, addPost: AddPostFn, editPost: EditPostFn) => (values: Post) => {
  if (post) {
    editPost(post.id, values.title, values.content);
  } else {
    addPost(values.title, values.content);
  }
};

const PostEditView = ({ loading, post, navigation, subscribeToMore, addPost, editPost }: PostProps) => {
  let postObj: Post = post;

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
      <ScrollView style={styles.container}>
        <PostForm onSubmit={onSubmit(postObj, addPost, editPost)} post={post} />
        {postObj && (
          <PostComments
            postId={navigation.state.params.id}
            comments={postObj.comments}
            subscribeToMore={subscribeToMore}
          />
        )}
      </ScrollView>
    );
  }
};

const styles: any = StyleSheet.create({
  container: {
    flexDirection: 'column'
  }
});

export default PostEditView;
