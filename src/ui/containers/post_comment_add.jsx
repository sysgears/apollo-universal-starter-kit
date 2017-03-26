import React from 'react'
import { graphql, compose, withApollo } from 'react-apollo'
import update from 'react-addons-update'

import COMMENT_ADD from '../graphql/post_comment_add.graphql'

class CommentAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = { content: '' };
  }

  onSubmit(event) {
    event.preventDefault();
    const { postId, addComment } = this.props;

    addComment(this.state.content, postId);

    this.setState({ content: ''});
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <label>Add acomment</label>
        <input onChange={event => this.setState({ content: event.target.value })}
               value={this.state.content}/>
      </form>
    );
  }
}

CommentAdd.propTypes = {
  addComment: React.PropTypes.func.isRequired,
};

const CommentAddWithApollo = withApollo(compose(
  graphql(COMMENT_ADD, {
    props: ({ ownProps, mutate }) => ({
      addComment: (content, postId) => mutate({
        variables: { content, postId },
        optimisticResponse: {
          addComment: {
            id: null,
            content: content,
            __typename: 'Comment',
          },
        },
        updateQueries: {
          getPost: (prev, { mutationResult }) => {
            return update(prev, {
              post: {
                comments: {
                  $push: [mutationResult.data.addComment],
                }
              }
            });
          }
        },
      })
    })
  })
)(CommentAdd));

export default CommentAddWithApollo;