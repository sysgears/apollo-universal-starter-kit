import React from 'react';
import { compose } from 'react-apollo';

import PostList from '../components/PostList.web';
import { PostProps } from '../types';

import { withPostList, withPostDeleting, getSubscriptionOptions } from '../graphql';

class PostComponent extends React.Component<PostProps, any> {
  public subscription: any;
  constructor(props: PostProps) {
    super(props);
    this.subscription = null;
  }

  public componentWillReceiveProps(nextProps: PostProps) {
    if (!nextProps.loading) {
      const endCursor: number = this.props.posts ? this.props.posts.pageInfo.endCursor : 0;
      const nextEndCursor: number = nextProps.posts.pageInfo.endCursor;

      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && endCursor !== nextEndCursor) {
        this.subscription();
        this.subscription = null;
      }

      // Subscribe or re-subscribe
      if (!this.subscription) {
        this.subscribeToPostList(nextEndCursor);
      }
    }
  }

  public componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  public subscribeToPostList = (endCursor: number) => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore(getSubscriptionOptions(endCursor));
  };

  public render() {
    return <PostList {...this.props} />;
  }
}

export default compose(withPostList, withPostDeleting)(PostComponent);
