import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import PostEditView from '../components/PostEditView';

import POST_QUERY from '../graphql/PostQuery.graphql';
import EDIT_POST from '../graphql/EditPost.graphql';
import POST_SUBSCRIPTION from '../graphql/PostSubscription.graphql';

class PostEdit extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    post: PropTypes.object,
    subscribeToMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
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

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  subscribeToPostEdit = postId => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: POST_SUBSCRIPTION,
      variables: { id: postId }
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
        id = props.match.params.id !== 'new' ? props.match.params.id : 0;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        variables: { id }
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
          return navigation.goBack();
        }
      }
    })
  })
)(PostEdit);
