/*eslint-disable react/display-name*/

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ListView, ScrollView, Button } from 'react-native';

import CommentForm from './post_comment_form';

// Row comparison function
const rowHasChanged = (r1, r2) => r1.id !== r2.id;

// DataSource template object
const ds = new ListView.DataSource({ rowHasChanged });

const renderRow = (onCommentSelect, comment, deleteComment) => ({ id, content }) => {
  return (
    <View style={styles.row}>
      <Text>
        {content}
      </Text>
      <Button title="Edit" onPress={() => onCommentSelect({ id, content })} />
      <Button title="Delete" onPress={() => onCommentDelete(comment, deleteComment, onCommentSelect, id)} />
    </View>
  );
};

function onCommentDelete(comment, deleteComment, onCommentSelect, id) {
  if (comment.id === id) {
    onCommentSelect({ id: null, content: '' });
  }

  deleteComment(id);
}

const onSubmit = (comment, postId, addComment, editComment, onCommentSelect, onFormSubmitted) => (values) => {
  if (comment.id === null) {
    addComment(values.content, postId);
  }
  else {
    editComment(comment.id, values.content);
  }

  onCommentSelect({ id: null, content: '' });
  onFormSubmitted();
};

const PostCommentsShow = ({ postId, comment, addComment, editComment, comments, onCommentSelect, deleteComment, onFormSubmitted }) => {
  const dataSource = ds.cloneWithRows(comments);
  return (
    <ScrollView>
      <Text>Comments</Text>
      {<CommentForm postId={postId} onSubmit={onSubmit(comment, postId, addComment, editComment, onCommentSelect, onFormSubmitted)} initialValues={comment} />}
      <ListView
        style={styles.container}
        dataSource={dataSource}
        renderRow={renderRow(onCommentSelect, comment, deleteComment)}
        removeClippedSubviews={false}
      />
    </ScrollView>
  );
};

PostCommentsShow.propTypes = {
  postId: PropTypes.number.isRequired,
  comments: PropTypes.array.isRequired,
  comment: PropTypes.object,
  addComment: PropTypes.func.isRequired,
  editComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  onCommentSelect: PropTypes.func.isRequired,
  onFormSubmitted: PropTypes.func.isRequired,
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
  row: {
    padding: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
});

export default PostCommentsShow;