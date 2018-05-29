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
        variables: { id }
      };
    },
    props({ data: { loading, error, post, subscribeToMore } }) {
      if (error) throw new Error(error);
      return { loading, post, subscribeToMore };
    }
  }),
  graphql(ADD_POST, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      addPost: async (title, content) => {
        let postData = await mutate({
          variables: { input: { title, content } },
          optimisticResponse: {
            __typename: 'Mutation',
            addPost: {
              __typename: 'Post',
              id: null,
              title: title,
              content: content,
              comments: []
            }
          },
          updateQueries: {
            posts: (
              prev,
              {
                mutationResult: {
                  data: { addPost }
                }
              }
            ) => {
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
