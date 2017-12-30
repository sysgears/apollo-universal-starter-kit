import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from '../../common/components/web';
import PostCommentForm from './PostCommentForm';

export default class PostCommentsView extends React.PureComponent {
  static propTypes = {
    postId: PropTypes.number.isRequired,
    comments: PropTypes.array.isRequired,
    comment: PropTypes.object,
    addComment: PropTypes.func.isRequired,
    editComment: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
    onCommentSelect: PropTypes.func.isRequired,
    onFormSubmitted: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired
  };

  hendleEditComment = (id, content) => {
    const { onCommentSelect } = this.props;
    onCommentSelect({ id, content });
  };

  hendleDeleteComment = id => {
    const { comment, onCommentSelect, deleteComment } = this.props;

    if (comment.id === id) {
      onCommentSelect({ id: null, content: '' });
    }

    deleteComment(id);
  };

  onSubmit = () => values => {
    const { comment, postId, addComment, editComment, onCommentSelect, onFormSubmitted } = this.props;

    if (comment.id === null) {
      addComment(values.content, postId);
    } else {
      editComment(comment.id, values.content);
    }

    onCommentSelect({ id: null, content: '' });
    onFormSubmitted();
  };

  render() {
    const { postId, comment, comments } = this.props;

    const columns = [
      {
        title: 'Content',
        dataIndex: 'content',
        key: 'content'
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 120,
        render: (text, record) => (
          <div style={{ width: 120 }}>
            <Button
              color="primary"
              size="sm"
              className="edit-comment"
              onClick={() => this.hendleEditComment(record.id, record.content)}
            >
              Edit
            </Button>{' '}
            <Button
              color="primary"
              size="sm"
              className="delete-comment"
              onClick={() => this.hendleDeleteComment(record.id)}
            >
              Delete
            </Button>
          </div>
        )
      }
    ];

    return (
      <div>
        <h3>Comments</h3>
        <PostCommentForm postId={postId} onSubmit={this.onSubmit()} initialValues={comment} />
        <h1 />
        <Table dataSource={comments} columns={columns} />
      </div>
    );
  }
}
