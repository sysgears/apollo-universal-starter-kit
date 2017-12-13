import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, Text, View, ScrollView, Keyboard } from 'react-native';
import { SwipeAction } from '../../common/components/native';

import PostCommentForm from './PostCommentForm';

export default class PostCommentsView extends React.PureComponent {
  static propTypes = {
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

  keyExtractor = item => item.id;

  renderItem = ({ item: { id, content } }) => {
    const { comment, deleteComment, onCommentSelect } = this.props;
    return (
      <SwipeAction
        onPress={() => onCommentSelect({ id: id, content: content })}
        right={{
          text: 'Delete',
          onPress: () => this.onCommentDelete(comment, deleteComment, onCommentSelect, id)
        }}
      >
        {content}
      </SwipeAction>
    );
  };

  onCommentDelete = (comment, deleteComment, onCommentSelect, id) => {
    if (comment.id === id) {
      onCommentSelect({ id: null, content: '' });
    }

    deleteComment(id);
  };

  onSubmit = (comment, postId, addComment, editComment, onCommentSelect, onFormSubmitted) => values => {
    if (comment.id === null) {
      addComment(values.content, postId);
    } else {
      editComment(comment.id, values.content);
    }

    onCommentSelect({ id: null, content: '' });
    onFormSubmitted();
    Keyboard.dismiss();
  };

  render() {
    const { postId, comment, addComment, editComment, comments, onCommentSelect, onFormSubmitted } = this.props;

    return (
      <View>
        <Text style={styles.title}>Comments</Text>
        <PostCommentForm
          postId={postId}
          onSubmit={this.onSubmit(comment, postId, addComment, editComment, onCommentSelect, onFormSubmitted)}
          initialValues={comment}
        />
        {comments.length > 0 && (
          <ScrollView style={styles.list} keyboardDismissMode="on-drag">
            <FlatList data={comments} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    margin: 10
  },
  list: {
    paddingTop: 10
  }
});
