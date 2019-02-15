import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';

import PostEditView from '../components/PostEditView';

import POST_QUERY from '../graphql/PostQuery.graphql';
import EDIT_POST from '../graphql/EditPost.graphql';
import POST_SUBSCRIPTION from '../graphql/PostSubscription.graphql';

const subscribeToPostEdit = (subscribeToMore, postId, history, navigation) =>
  subscribeToMore({
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

const PostEdit = props => {
  useEffect(() => {
    if (props.post) {
      const {
        subscribeToMore,
        post: { id },
        history,
        navigation
      } = props;
      const subscribe = subscribeToPostEdit(subscribeToMore, id, history, navigation);
      return () => subscribe();
    }
  });

  return <PostEditView {...props} />;
};

PostEdit.propTypes = {
  loading: PropTypes.bool.isRequired,
  post: PropTypes.object,
  subscribeToMore: PropTypes.func.isRequired,
  history: PropTypes.object,
  navigation: PropTypes.object
};

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
