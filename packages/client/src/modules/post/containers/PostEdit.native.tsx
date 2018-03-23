import React from 'react';
import { compose } from 'react-apollo';

import PostEditView from '../components/PostEditView.native';
import { PostProps } from '../types';
import { withPost, withPostAdding, withPostEditing, getSubscriptionPostOptions } from '../graphql';

class PostEdit extends React.Component<PostProps, any> {
  public subscription: any;
  constructor(props: PostProps) {
    super(props);
    this.subscription = null;
  }

  public componentWillReceiveProps(nextProps: PostProps) {
    if (!nextProps.loading) {
      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && this.props.post.id !== nextProps.post.id) {
        this.subscription();
        this.subscription = null;
      }

      // Subscribe or re-subscribe
      if (!this.subscription && nextProps.post) {
        this.subscribeToPostEdit(nextProps.post.id);
      }
    }
  }

  public componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  public subscribeToPostEdit = (postId: number) => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore(getSubscriptionPostOptions(postId));
  };

  public render() {
    return <PostEditView {...this.props} />;
  }
}

export default compose(withPost, withPostAdding, withPostEditing)(PostEdit);
