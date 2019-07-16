/* eslint-disable react/display-name */

import React from 'react';
import PropTypes from 'prop-types';
import { translate } from '@gqlapp/i18n-client-react';
import { Table, Button } from '@gqlapp/look-client-react';

import PostCommentForm from './PostCommentForm';

const PostCommentsView = ({
  postId,
  comments,
  comment,
  t,
  onCommentSelect,
  deleteComment,
  addComment,
  editComment
}) => {
  const columns = [
    {
      title: t('comment.column.content'),
      dataIndex: 'content',
      key: 'content'
    },
    {
      title: t('comment.column.actions'),
      key: 'actions',
      width: 120,
      render: (text, record) => (
        <div style={{ width: 120 }}>
          <Button
            color="primary"
            size="sm"
            className="edit-comment"
            onClick={() => onCommentSelect({ id: record.id, content: record.content })}
          >
            {t('comment.btn.edit')}
          </Button>{' '}
          <Button color="primary" size="sm" className="delete-comment" onClick={() => handleDeleteComment(record.id)}>
            {t('comment.btn.del')}
          </Button>
        </div>
      )
    }
  ];

  const handleDeleteComment = id => {
    if (comment.id === id) {
      onCommentSelect({ id: null, content: '' });
    }
    deleteComment(id);
  };

  const onSubmit = () => values => {
    if (comment.id === null) {
      addComment(values.content, postId);
    } else {
      editComment(comment.id, values.content);
    }
    onCommentSelect({ id: null, content: '' });
  };

  return (
    <div>
      <h3>{t('comment.title')}</h3>
      <PostCommentForm postId={postId} onSubmit={onSubmit()} initialValues={comment} comment={comment} />
      <h1 />
      <Table dataSource={comments} columns={columns} />
    </div>
  );
};

PostCommentsView.propTypes = {
  postId: PropTypes.number.isRequired,
  comments: PropTypes.array.isRequired,
  comment: PropTypes.object,
  addComment: PropTypes.func.isRequired,
  editComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  onCommentSelect: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('post')(PostCommentsView);
