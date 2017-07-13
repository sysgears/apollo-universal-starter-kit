import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

import PageLayout from '../../../app/page_layout';
import PostForm from '../components/post_form';
import PostComments from './post_comments';
import POST_QUERY from '../graphql/post_get.graphql';
import POST_EDIT from '../graphql/post_edit.graphql';
import POST_SUBSCRIPTION from '../graphql/post_subscription.graphql';

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

  onSubmit = (values) => {
    const { post, editPost } = this.props;

    editPost(post.id, values.title, values.content);
  }

  renderMetaData = () => (
    <Helmet
      title="Apollo Starter Kit - Edit post"
      meta={[{
        name: 'description',
        content: 'Edit post example page'
      }]} />
  );

  render() {
    const { loading, post, match, subscribeToMore } = this.props;

    if (loading) {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <div>
            Loading...
          </div>
        </PageLayout>
      );
    } else {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <Link id="back-button" to="/posts">Back</Link>
          <h2>Edit Post</h2>
          <PostForm onSubmit={this.onSubmit} initialValues={post}/>
          <br/>
          <PostComments postId={match.params.id} comments={post.comments} subscribeToMore={subscribeToMore}/>
        </PageLayout>
      );
    }
  }
}

PostEdit.propTypes = {
  loading: PropTypes.bool.isRequired,
  post: PropTypes.object,
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
