import React from 'react';
import { graphql, compose, OptionProps } from 'react-apollo';
import { SubscribeToMoreOptions, ApolloError } from 'apollo-client';

import PostEditView from '../components/PostEditView.web';
import { AddPost } from './Post';

import POST_QUERY from '../graphql/PostQuery.graphql';
import ADD_POST from '../graphql/AddPost.graphql';
import EDIT_POST from '../graphql/EditPost.graphql';
import POST_SUBSCRIPTION from '../graphql/PostSubscription.graphql';

export type AddPostFn = (title: string, content: string) => any;
export type EditPostFn = (id: number, title: string, content: string) => any;
export type DeletePostFn = (id: number) => any;

export interface PostEditProps {
  loading: boolean;
  post: Post;
  subscribeToMore: (option: SubscribeToMoreOptions) => void;
  addPost: AddPostFn;
  editPost: EditPostFn;
  match: any;
  location: any;
  comments: Comment[];
}

interface PostOperation {
  addPost?: Post;
  editPost?: (id: number, title: string, content: string) => void;
}

interface Post {
  id: number;
  content: string;
  title: string;
  comments: Comment[];
}

export interface PostQuery {
  post: Post;
}

export interface Comment {
  id?: number;
  content: string;
}

export interface AddPostResponse {
  history: any;
  navigation: any;
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
    props: ({ ownProps: { history, navigation }, mutate }: OptionProps<AddPostResponse, PostOperation>) => ({
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
            posts: (prev: PostQuery, { mutationResult: { data: { addPost } } }) => {
              return AddPost(prev, addPost);
            }
          }
        });

        if (history) {
          return history.push('/post/' + data.addPost.id, {
            post: data.addPost
          });
        } else if (navigation) {
          return navigation.setParams({
            id: data.addPost.id,
            post: data.addPost
          });
        }
      }
    })
  }),
  graphql(EDIT_POST, {
    props: ({ ownProps: { history, navigation }, mutate }: OptionProps<AddPostResponse, PostOperation>) => ({
      editPost: async (id: number, title: string, content: string) => {
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
