import React from 'react';
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Keyboard,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  ListRenderItem,
  ListRenderItemInfo
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SwipeAction } from '../../../common/components/native';

import PostCommentForm from './PostCommentForm.native';
import {
  PostCommentsProps,
  Comment,
  AddCommentFn,
  DeleteCommentFn,
  EditCommentFn,
  OnCommentSelectFn
} from '../../types';

export default class PostCommentsView extends React.PureComponent<PostCommentsProps, any> {
  public keyExtractor = (item: Comment) => `${item.id}`;

  public renderItemIOS = ({ item: { id, content } }: ListRenderItemInfo<Comment>) => {
    const { comment, deleteComment, onCommentSelect } = this.props;
    return (
      <SwipeAction
        onPress={() => onCommentSelect({ id, content })}
        right={{
          text: 'Delete',
          onPress: () => this.onCommentDelete(comment, deleteComment, onCommentSelect, id)
        }}
      >
        {content}
      </SwipeAction>
    );
  };

  public renderItemAndroid = ({ item: { id, content } }: ListRenderItemInfo<Comment>) => {
    const { deleteComment, onCommentSelect, comment } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => onCommentSelect({ id, content })}>
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

  public onCommentDelete = (
    comment: Comment,
    deleteComment: DeleteCommentFn,
    onCommentSelect: OnCommentSelectFn,
    id: number
  ) => {
    if (comment.id === id) {
      onCommentSelect({ id: null, content: '' });
    }

    deleteComment(id);
  };

  public onSubmit = (
    comment: Comment,
    postId: number,
    addComment: AddCommentFn,
    editComment: EditCommentFn,
    onCommentSelect: OnCommentSelectFn
  ) => (values: Comment) => {
    if (comment.id === null) {
      addComment(values.content, postId);
    } else {
      editComment(comment.id, values.content);
    }

    onCommentSelect({ id: null, content: '' });
    Keyboard.dismiss();
  };

  public render() {
    const { postId, comment, addComment, editComment, comments, onCommentSelect } = this.props;
    const renderItem: ListRenderItem<Comment> = Platform.OS === 'android' ? this.renderItemAndroid : this.renderItemIOS;

    return (
      <View>
        <Text style={styles.title}>Comments</Text>
        <PostCommentForm
          postId={postId}
          onSubmit={this.onSubmit(comment, postId, addComment, editComment, onCommentSelect)}
          comment={comment}
        />
        {comments.length > 0 && (
          <View style={styles.list}>
            <FlatList data={comments} keyExtractor={this.keyExtractor} renderItem={renderItem} />
          </View>
        )}
      </View>
    );
  }
}

const styles: any = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    margin: 10
  },
  list: {
    paddingTop: 10
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
    backgroundColor: '#fff',
    borderBottomColor: '#000',
    borderBottomWidth: 0.3,
    height: 50,
    paddingLeft: 7
  }
});
