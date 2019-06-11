import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Keyboard,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { translate } from '@gqlapp/i18n-client-react';
import { SwipeAction } from '@gqlapp/look-client-react-native';

import PostCommentForm from './PostCommentForm';

const PostCommentsView = ({
  postId,
  comment,
  deleteComment,
  addComment,
  editComment,
  comments,
  onCommentSelect,
  t
}) => {
  const keyExtractor = item => `${item.id}`;

  const renderItemIOS = ({ item: { id, content } }) => (
    <SwipeAction
      onPress={() => onCommentSelect({ id: id, content: content })}
      right={{
        text: t('comment.btn.del'),
        onPress: () => onCommentDelete(comment, deleteComment, onCommentSelect, id)
      }}
    >
      {content}
    </SwipeAction>
  );

  const renderItemAndroid = ({ item: { id, content } }) => (
    <TouchableWithoutFeedback onPress={() => onCommentSelect({ id: id, content: content })}>
      <View style={styles.postWrapper}>
        <Text style={styles.text}>{content}</Text>
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => onCommentDelete(comment, deleteComment, onCommentSelect, id)}
        >
          <FontAwesome name="trash" size={20} style={{ color: '#3B5998' }} />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );

  const onCommentDelete = (comment, deleteComment, onCommentSelect, id) => {
    if (comment.id === id) {
      onCommentSelect({ id: null, content: '' });
    }

    deleteComment(id);
  };

  const onSubmit = (comment, postId, addComment, editComment, onCommentSelect) => values => {
    if (comment.id === null) {
      addComment(values.content, postId);
    } else {
      editComment(comment.id, values.content);
    }

    onCommentSelect({ id: null, content: '' });
    Keyboard.dismiss();
  };

  const renderItem = Platform.OS === 'android' ? renderItemAndroid : renderItemIOS;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('comment.title')}</Text>
      <PostCommentForm
        postId={postId}
        onSubmit={onSubmit(comment, postId, addComment, editComment, onCommentSelect)}
        comment={comment}
      />
      {comments.length > 0 && (
        <View style={styles.list} keyboardDismissMode="on-drag">
          <FlatList data={comments} keyExtractor={keyExtractor} renderItem={renderItem} />
        </View>
      )}
    </View>
  );
};

PostCommentsView.propTypes = {
  item: PropTypes.object,
  postId: PropTypes.number.isRequired,
  comments: PropTypes.array.isRequired,
  comment: PropTypes.object,
  addComment: PropTypes.func.isRequired,
  editComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  onCommentSelect: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('post')(PostCommentsView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    margin: 10
  },
  list: {
    paddingTop: 10,
    paddingHorizontal: 15
  },
  text: {
    fontSize: 18
  },
  iconWrapper: {
    backgroundColor: 'transparent',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  postWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#000',
    borderBottomWidth: 0.3,
    height: 50,
    paddingLeft: 7
  }
});
