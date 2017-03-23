import React from 'react'
import { graphql, compose, withApollo } from 'react-apollo'
import { Link } from 'react-router-dom'

import POST_ADD from '../graphql/post_add.graphql'
import POSTS_QUERY from '../graphql/posts_get.graphql'

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
          <input type="text" onChange={event => this.setState({ title: event.target.value })} value={this.state.title} />
          <label>Contnent</label>
          <input type="text" onChange={event => this.setState({ content: event.target.value })} value={this.state.content} />
          <button type="submit" className="btn btn-primary">Submit</button>
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
        refetchQueries: [{
          query: POSTS_QUERY,
          variables: { first: 10, after: 0 }
        }]
      }).then( () => ownProps.history.push('/posts')),
    })
  })
)(PostAdd));

export default PostAddWithApollo;