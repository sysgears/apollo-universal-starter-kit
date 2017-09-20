import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import PostEditView from '../components/PostEditView';
import { AddPost } from './Post';

import POST_QUERY from '../graphql/PostQuery.graphql';
import ADD_POST from '../graphql/AddPost.graphql';
import EDIT_POST from '../graphql/EditPost.graphql';
import POST_SUBSCRIPTION from '../graphql/PostSubscription.graphql';

class PostEdit extends React.Component {
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

  subscribeToPostEdit = postId => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: POST_SUBSCRIPTION,
      variables: { id: postId }
    });
  };

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  render() {
    return <PostEditView {...this.props} />;
  }
}

PostEdit.propTypes = {
  loading: PropTypes.bool.isRequired,
  post: PropTypes.object,
  addPost: PropTypes.func.isRequired,
  editPost: PropTypes.func.isRequired,
  subscribeToMore: PropTypes.func.isRequired
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
        variables: { id }
      };
    },
    props({ data: { loading, post, subscribeToMore } }) {
      return { loading, post, subscribeToMore };
    }
  }),
  graphql(ADD_POST, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      addPost: async (title, content) => {
        let postData = await mutate({
          variables: { input: { title, content } },
          optimisticResponse: {
            addPost: {
              id: -1,
              title: title,
              content: content,
              comments: [],
              __typename: 'Post'
            }
          },
          updateQueries: {
            posts: (prev, { mutationResult: { data: { addPost } } }) => {
              return AddPost(prev, addPost);
            }
          }
        });

        if (history) {
          return history.push('/post/' + postData.data.addPost.id, {
            post: postData.data.addPost
          });
        } else if (navigation) {
          return navigation.setParams({
            id: postData.data.addPost.id,
            post: postData.data.addPost
          });
        }
      }
    })
  }),
  graphql(EDIT_POST, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      editPost: async (id, title, content) => {
        await mutate({
          variables: { input: { id, title, content } }
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
