import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

import PageLayout from '../../../app/page_layout';
import PostForm from '../components/post_form';
import POST_ADD from '../graphql/post_add.graphql';

import { AddPost } from './post';

class PostAdd extends React.Component {
  onSubmit = (values) => {
    const { addPost } = this.props;

    addPost(values.title, values.content);
  }

  renderMetaData = () => (
    <Helmet
      title="Apollo Starter Kit - Add post"
      meta={[{
        name: 'description',
        content: 'Add new post example page'
      }]}/>
  );

  render() {
    return (
      <PageLayout>
        {this.renderMetaData()}
        <Link to="/posts">Back</Link>
        <h2>Create Post</h2>
        <PostForm onSubmit={this.onSubmit}/>
      </PageLayout>
    );
  }
}

PostAdd.propTypes = {
  addPost: PropTypes.func.isRequired
};

export default compose(
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
      }
    })
  })
)(PostAdd);
