import React from 'react'
import { graphql, compose, withApollo } from 'react-apollo'
import update from 'react-addons-update'
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap'

import COMMENT_ADD from '../graphql/post_comment_add.graphql'
import COMMENT_EDIT from '../graphql/post_comment_edit.graphql'

class CommentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { id: null, content: '' };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ id: nextProps.comment.id, content: nextProps.comment.content });
  }

  onSubmit(event) {
    event.preventDefault();
    const { postId, addComment, editComment } = this.props;

    if (this.state.id === null) {
      addComment(this.state.content, postId);
    }
    else {
     editComment(this.state.id, this.state.content);
    }

    this.setState({ id: null, content: '' });
  }

  render() {
    let operation = 'Add';
    if (this.state.id !== null) {
      operation = 'Edit';
    }

    return (
      <Form onSubmit={this.onSubmit.bind(this)}>
        <FormGroup>
          <Row>
            <Col xs="2"><Label>{operation} acomment</Label></Col>
            <Col xs="8"><Input onChange={event => this.setState({ content: event.target.value })}
                               value={this.state.content}/></Col>
            <Col xs="2"><Button color="primary" type="submit" className="float-right">
              Submit
            </Button></Col>
          </Row>
        </FormGroup>
      </Form>
    );
  }
}

CommentForm.propTypes = {
  comment: React.PropTypes.object,
  addComment: React.PropTypes.func.isRequired,
  editComment: React.PropTypes.func.isRequired,
};

const CommentFormWithApollo = withApollo(compose(
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
                  $push: [ mutationResult.data.addComment ],
                }
              }
            });
          }
        },
      })
    })
  }),
  graphql(COMMENT_EDIT, {
    props: ({ ownProps, mutate }) => ({
      editComment: (id, content) => mutate({
        variables: { id, content },
        optimisticResponse: {
          __typename: 'Mutation',
          editComment: {
            id: id,
            content: content,
            __typename: 'Comment',
          },
        }
      }),
    })
  }),
)(CommentForm));

export default CommentFormWithApollo;