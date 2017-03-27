import React from 'react'
import { graphql, compose, withApollo } from 'react-apollo'
import update from 'react-addons-update'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'

import POST_ADD from '../graphql/post_add.graphql'

class PostAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = { title: '', content: '' };
  }

  onSubmit(event) {
    event.preventDefault();
    const { addPost } = this.props;

    addPost(this.state.title, this.state.content);
  }

  render() {
    return (
      <div className="mt-4 mb-4">
        <Link to="/posts">Back</Link>
        <h2>Create Post</h2>
        <form onSubmit={this.onSubmit.bind(this)}>
          <label>Title</label>
          <input type="text" onChange={event => this.setState({ title: event.target.value })}
                 value={this.state.title}/>
          <label>Contnent</label>
          <input type="text" onChange={event => this.setState({ content: event.target.value })}
                 value={this.state.content}/>
          <Button color="primary" type="submit">
            Submit
          </Button>
        </form>
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
            id: null,
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
                  $push: [edge],
                },
                pageInfo: {
                  endCursor: {
                    $set: mutationResult.data.addPost.id
                  }
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