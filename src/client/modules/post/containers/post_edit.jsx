import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import PostEditShow from '../components/post_edit_show';
import { AddPost } from './post';

import POST_QUERY from '../graphql/post_get.graphql';
import POST_ADD from '../graphql/post_add.graphql';
import POST_EDIT from '../graphql/post_edit.graphql';
import POST_SUBSCRIPTION from '../graphql/post_subscription.graphql';

class PostEdit extends React.Component {
  constructor(props) {
    super(props);

    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading && this.props.post) {
      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && this.props.post.id !== nextProps.post.id) {
        this.subscription();
        this.subscription = null;
      }

      // Subscribe or re-subscribe
      if (!this.subscription) {
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
    return <PostEditShow {...this.props} />;
  }
}

PostEdit.propTypes = {
  loading: PropTypes.bool.isRequired,
  post: PropTypes.object,
  addPost: PropTypes.func.isRequired,
  editPost: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
};

export default compose(
  graphql(POST_QUERY, {
    options: (props) => {
      return {
        variables: { id: props.match.params.id }
      };
    },
    props({ data: { loading, post, subscribeToMore } }) {
      return { loading, post, subscribeToMore };
    }
  }),
  graphql(POST_ADD, {
    props: ({ ownProps: { history }, mutate }) => ({
      addPost: async (title, content) => {
        await mutate({
          variables: { input: { title, content } },
          optimisticResponse: {
            addPost: {
              id: -1,
              title: title,
              content: content,
              __typename: 'Post',
            },
          },
          updateQueries: {
            getPosts: (prev, { mutationResult: { data: { addPost } } }) => {
              return AddPost(prev, addPost);
            }
          }
        });

        return history.push('/posts');
        //return history.push('/post/' + postData.data.addPost.id);
      }
    })
  }),
  graphql(POST_EDIT, {
    props: ({ ownProps: { history }, mutate }) => ({
      editPost: async (id, title, content) => {
        await mutate({
          variables: { input: { id, title, content } }
        });

        return history.push('/posts');
      }
    })
  })
)(PostEdit);
