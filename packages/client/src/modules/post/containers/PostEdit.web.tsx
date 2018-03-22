import React from 'react';
import { graphql, compose, OptionProps } from 'react-apollo';
import { ApolloError } from 'apollo-client';
import { History } from 'history';

import PostEditView from '../components/PostEditView.web';
import { AddPost } from './Post.web';
import { PostOperation, PostQuery, PostEditProps, PostQueryResult as PostOperationResult } from '../types';

import POST_QUERY from '../graphql/PostQuery.graphql';
import ADD_POST from '../graphql/AddPost.graphql';
import EDIT_POST from '../graphql/EditPost.graphql';
import POST_SUBSCRIPTION from '../graphql/PostSubscription.graphql';

export interface PostProps {
  history: History;
}

class PostEdit extends React.Component<PostEditProps, any> {
  public subscription: any;
  constructor(props: PostEditProps) {
    super(props);
    this.subscription = null;
  }

  public componentWillReceiveProps(nextProps: PostEditProps) {
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

    this.subscription = subscribeToMore({
      document: POST_SUBSCRIPTION,
      variables: { id: postId }
    });
  };

  public render() {
    return <PostEditView {...this.props} />;
  }
}

export default compose(
  graphql<PostQuery>(POST_QUERY, {
    options: ({ match, navigation }) => {
      let id: number = 0;
      if (match) {
        id = match.params.id;
      } else if (navigation) {
        id = navigation.state.params.id;
      }

      return {
        variables: { id }
      };
    },
    props({ data: { loading, error, post, subscribeToMore } }) {
      if (error) {
        throw new ApolloError(error);
      }
      return { loading, post, subscribeToMore };
    }
  }),
  graphql(ADD_POST, {
    props: ({ ownProps: { history }, mutate }: OptionProps<PostProps, PostOperation>) => ({
      addPost: async (title: string, content: string) => {
        const { data } = await mutate({
          variables: { input: { title, content } },
          optimisticResponse: {
            __typename: 'Mutation',
            addPost: {
              __typename: 'Post',
              id: null,
              title,
              content,
              comments: []
            }
          },
          updateQueries: {
            posts: (prev: PostOperationResult, { mutationResult: { data: { addPost } } }) => {
              return AddPost(prev, addPost);
            }
          }
        });
        if (history) {
          return history.push('/post/' + data.addPost.id, {
            post: data.addPost
          });
        }
      }
    })
  }),
  graphql(EDIT_POST, {
    props: ({ ownProps: { history }, mutate }: OptionProps<PostProps, PostOperation>) => ({
      editPost: async (id: number, title: string, content: string) => {
        await mutate({
          variables: { input: { id, title, content } }
        });
        if (history) {
          return history.push('/posts');
        }
      }
    })
  })
)(PostEdit);
