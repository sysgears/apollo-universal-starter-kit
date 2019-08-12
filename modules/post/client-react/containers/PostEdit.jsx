import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import { compose } from '@gqlapp/core-common';

import PostEditView from '../components/PostEditView';

import POST_QUERY from '../graphql/PostQuery.graphql';
import EDIT_POST from '../graphql/EditPost.graphql';
import POST_SUBSCRIPTION from '../graphql/PostSubscription.graphql';

class PostEdit extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    post: PropTypes.object,
    subscribeToMore: PropTypes.func.isRequired,
    history: PropTypes.object,
    navigation: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidMount() {
    if (!this.props.loading) {
      this.initPostEditSubscription();
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.loading) {
      let prevPostId = prevProps.post ? prevProps.post.id : null;
      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && prevPostId !== this.props.post.id) {
        this.subscription();
        this.subscription = null;
      }
      this.initPostEditSubscription();
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
      this.subscription = null;
    }
  }

  initPostEditSubscription() {
    if (!this.subscription && this.props.post) {
      this.subscribeToPostEdit(this.props.post.id);
    }
  }

  subscribeToPostEdit = postId => {
    const { subscribeToMore, history, navigation } = this.props;

    this.subscription = subscribeToMore({
      document: POST_SUBSCRIPTION,
      variables: { id: postId },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              postUpdated: { mutation }
            }
          }
        }
      ) => {
        if (mutation === 'DELETED') {
          if (history) {
            return history.push('/posts');
          } else if (navigation) {
            return navigation.goBack();
          }
        }
        return prev;
      }
    });
  };

  render() {
    return <PostEditView {...this.props} />;
  }
}

export default compose(
  graphql(POST_QUERY, {
    options: props => {
      let id = 0;
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        variables: { id: Number(id) }
      };
    },
    props({ data: { loading, error, post, subscribeToMore } }) {
      if (error) throw new Error(error);
      return { loading, post, subscribeToMore };
    }
  }),
  graphql(EDIT_POST, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      editPost: async (id, title, content) => {
        await mutate({
          variables: { input: { id, title: title.trim(), content: content.trim() } }
        });
        if (history) {
          return history.push('/posts');
        }
        if (navigation) {
          return navigation.navigate('PostList');
        }
      }
    })
  })
)(PostEdit);
