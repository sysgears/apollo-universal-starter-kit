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
import { translate } from '@module/i18n-client-react';
import { SwipeAction } from '@module/look-client-react-native';

import PostCommentForm from './PostCommentForm';

class PostCommentsView extends React.PureComponent {
  static propTypes = {
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

  keyExtractor = item => `${item.id}`;

  renderItemIOS = ({ item: { id, content } }) => {
    const { comment, deleteComment, onCommentSelect, t } = this.props;
    return (
      <SwipeAction
        onPress={() => onCommentSelect({ id: id, content: content })}
        right={{
          text: t('comment.btn.del'),
          onPress: () => this.onCommentDelete(comment, deleteComment, onCommentSelect, id)
        }}
      >
        {content}
      </SwipeAction>
    );
  };

  renderItemAndroid = ({ item: { id, content } }) => {
    const { deleteComment, onCommentSelect, comment } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => onCommentSelect({ id: id, content: content })}>
        <View style={styles.postWrapper}>
          <Text style={styles.text}>{content}</Text>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => this.onCommentDelete(comment, deleteComment, onCommentSelect, id)}
          >
            <FontAwesome name="trash" size={20} style={{ color: '#3B5998' }} />
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  onCommentDelete = (comment, deleteComment, onCommentSelect, id) => {
    if (comment.id === id) {
      onCommentSelect({ id: null, content: '' });
    }

    deleteComment(id);
  };

  onSubmit = (comment, postId, addComment, editComment, onCommentSelect) => values => {
    if (comment.id === null) {
      addComment(values.content, postId);
    } else {
      editComment(comment.id, values.content);
    }

    onCommentSelect({ id: null, content: '' });
    Keyboard.dismiss();
  };

  render() {
    const { postId, comment, addComment, editComment, comments, onCommentSelect, t } = this.props;
    const renderItem = Platform.OS === 'android' ? this.renderItemAndroid : this.renderItemIOS;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t('comment.title')}</Text>
        <PostCommentForm
          postId={postId}
          onSubmit={this.onSubmit(comment, postId, addComment, editComment, onCommentSelect)}
          comment={comment}
        />
        {comments.length > 0 && (
          <View style={styles.list} keyboardDismissMode="on-drag">
            <FlatList data={comments} keyExtractor={this.keyExtractor} renderItem={renderItem} />
          </View>
        )}
      </View>
    );
  }
}

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
