import React from 'react'
import { graphql, compose, withApollo } from 'react-apollo'
import update from 'react-addons-update'
import { Link } from 'react-router-dom'

import PostForm from './post_form'

import POST_ADD from '../graphql/post_add.graphql'

class PostAdd extends React.Component {
  onSubmit(values) {
    const { addPost } = this.props;

    addPost(values.title, values.content);
  }

  render() {
    return (
      <div>
        <Link to="/posts">Back</Link>
        <h2>Create Post</h2>
        <PostForm onSubmit={this.onSubmit.bind(this)}/>
      </div>
    );
  }
}

PostAdd.propTypes = {
  addPost: React.PropTypes.func.isRequired,
};

const PostAddWithApollo = withApollo(compose(
  graphql(POST_ADD, {
    props: ({ ownProps, mutate }) => ({
      addPost: (title, content) => mutate({
        variables: { title, content },
        optimisticResponse: {
          addPost: {
            id: -1,
            title: title,
            content: content,
            comments: [],
            __typename: 'Post',
          },
        },
        updateQueries: {
          getPosts: (prev, { mutationResult }) => {
            const edge = {
              cursor: mutationResult.data.addPost.id,
              node: {
                id: mutationResult.data.addPost.id,
                title: mutationResult.data.addPost.title,
                content: mutationResult.data.addPost.content,
                comments: [],
                __typename: 'Post'
              },
              __typename: 'Edges'
            };

            return update(prev, {
              postsQuery: {
                totalCount: {
                  $set: prev.postsQuery.totalCount + 1
                },
                edges: {
                  $unshift: [ edge ],
                }
              }
            });
          }
        }
      }).then(() => ownProps.history.push('/posts')),
    })
  })
)(PostAdd));

export default PostAddWithApollo;