import React from 'react';
import { Table, Button } from '../../common/components/web';
import PostCommentForm from './PostCommentForm.web';

import { PostCommentsProps, Comment } from '../types';

export default class PostCommentsView extends React.PureComponent<PostCommentsProps, any> {
  public handleEditComment = (id: number, content: string) => {
    const { onCommentSelect } = this.props;
    onCommentSelect({ id, content });
  };

  public handleDeleteComment = (id: number) => {
    const { comment, onCommentSelect, deleteComment } = this.props;

    if (comment.id === id) {
      onCommentSelect({ id: null, content: '' });
    }

    deleteComment(id);
  };

  public onSubmit = () => (values: Comment) => {
    const { comment, postId, addComment, editComment, onCommentSelect } = this.props;

    if (comment.id === null) {
      addComment(values.content, postId);
    } else {
      editComment(comment.id, values.content);
    }

    onCommentSelect({ id: null, content: '' });
  };

  public render() {
    const { postId, comments, comment } = this.props;
    const columns: any[] = [
      {
        title: 'Content',
        dataIndex: 'content',
        key: 'content'
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 120,
        render: (text: string, record: Comment) => (
          <div style={{ width: 120 }}>
            <Button
              color="primary"
              size="sm"
              className="edit-comment"
              onClick={() => this.handleEditComment(record.id, record.content)}
            >
              Edit
            </Button>{' '}
            <Button
              color="primary"
              size="sm"
              className="delete-comment"
              onClick={() => this.handleDeleteComment(record.id)}
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
        <PostCommentForm postId={postId} onSubmit={this.onSubmit()} comment={comment} />
        <h1 />
        <Table dataSource={comments} columns={columns} />
      </div>
    );
  }
}
