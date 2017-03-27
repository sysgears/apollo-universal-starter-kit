import React from 'react'
import { graphql, compose, withApollo } from 'react-apollo'
import update from 'react-addons-update'
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom'
import { Form, FormGroup, Label, Button } from 'reactstrap'

import log from '../../log'
import POST_ADD from '../graphql/post_add.graphql'

class PostAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = { title: '', content: '' };
  }

  onSubmit(values) {
    const { addPost } = this.props;

    addPost(values.title, values.content);
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="mt-4 mb-4">
        <Link to="/posts">Back</Link>
        <h2>Create Post</h2>

        <Form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <FormGroup>
            <Label htmlFor="title">Title</Label>
            <Field name="title" className="form-control" component="input" type="text"/>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="content">Contnent</Label>
            <Field name="content" className="form-control" component="input" type="text"/>
          </FormGroup>
          <Button color="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

PostAdd.propTypes = {
  addPost: React.PropTypes.func.isRequired,
};

const PostAddWithApollo = withApollo(compose(
  reduxForm({
    form: 'contact'
  }),
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
                  $push: [ edge ],
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