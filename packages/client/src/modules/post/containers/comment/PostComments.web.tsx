import React from 'react';
import { compose } from 'react-apollo';

import PostCommentsView from '../../components/comment/PostCommentsView.web';
import { PostCommentsProps } from '../../types';

import {
  withCommentAdding,
  withCommentEditing,
  withCommentDeleting,
  withCommentState,
  getSubscriptionCommentOptions
} from '../../graphql';

class PostComments extends React.Component<PostCommentsProps, any> {
  public subscription: any;
  constructor(props: PostCommentsProps) {
    super(props);
    this.subscription = null;
  }

  public componentWillReceiveProps(nextProps: PostCommentsProps) {
    // Check if props have changed and, if necessary, stop the subscription
    if (this.subscription && this.props.postId !== nextProps.postId) {
      this.subscription = null;
    }

    // Subscribe or re-subscribe
    if (!this.subscription) {
      this.subscribeToCommentList(nextProps.postId);
    }
  }

  public componentWillUnmount() {
    this.props.onCommentSelect({ id: null, content: '', postId: this.props.postId });

    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  public subscribeToCommentList = (postId: number) => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore(getSubscriptionCommentOptions(postId));
  };

  public render() {
    return <PostCommentsView {...this.props} />;
  }
}

export default compose(withCommentAdding, withCommentEditing, withCommentDeleting, withCommentState)(PostComments);
