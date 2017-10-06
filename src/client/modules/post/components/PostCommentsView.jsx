/*eslint-disable react/display-name*/

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ListView, ScrollView, Button, Keyboard } from 'react-native';

import PostCommentForm from './PostCommentForm';

function onCommentDelete(comment, deleteComment, onCommentSelect, id) {
  if (comment.id === id) {
    onCommentSelect({ id: null, content: '' });
  }

  deleteComment(id);
}

// Row comparison function
const rowHasChanged = (r1, r2) => r1.id !== r2.id;

// DataSource template object
const ds = new ListView.DataSource({ rowHasChanged });

const renderRow = (onCommentSelect, comment, deleteComment) => rowData => {
  return (
    <View style={styles.row}>
      <Button title={rowData.content} onPress={() => onCommentSelect({ id: rowData.id, content: rowData.content })} />
      <Button title="Delete" onPress={() => onCommentDelete(comment, deleteComment, onCommentSelect, rowData.id)} />
    </View>
  );
};

const onSubmit = (comment, postId, addComment, editComment, onCommentSelect, onFormSubmitted) => values => {
  if (comment.id === null) {
    addComment(values.content, postId);
  } else {
    editComment(comment.id, values.content);
  }

  onCommentSelect({ id: null, content: '' });
  onFormSubmitted();
  Keyboard.dismiss();
};

const PostCommentsView = ({
  postId,
  comment,
  addComment,
  editComment,
  comments,
  onCommentSelect,
  deleteComment,
  onFormSubmitted
}) => {
  const dataSource = comments.length > 0 ? ds.cloneWithRows(comments) : null;
  return (
    <View>
      <Text style={styles.title}>Comments</Text>
      <PostCommentForm
        postId={postId}
        onSubmit={onSubmit(comment, postId, addComment, editComment, onCommentSelect, onFormSubmitted)}
        initialValues={comment}
      />
      {comments.length > 0 && (
        <ScrollView keyboardDismissMode="on-drag">
          <ListView
            style={styles.container}
            dataSource={dataSource}
            renderRow={renderRow(onCommentSelect, comment, deleteComment)}
            removeClippedSubviews={false}
          />
        </ScrollView>
      )}
    </View>
  );
};

PostCommentsView.propTypes = {
  postId: PropTypes.number.isRequired,
  comments: PropTypes.array.isRequired,
  comment: PropTypes.object,
  addComment: PropTypes.func.isRequired,
  editComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  onCommentSelect: PropTypes.func.isRequired,
  onFormSubmitted: PropTypes.func.isRequired,
  subscribeToMore: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    margin: 10
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
  }
});

export default PostCommentsView;
