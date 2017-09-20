import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';

import PostCommentForm from './PostCommentForm';

function renderComments(comments, onCommentSelect, comment, deleteComment) {
  return comments.map(({ id, content }) => {
    return (
      <ListGroupItem className="justify-content-between" key={id}>
        {content}
        <div>
          <span
            className="badge badge-default badge-pill edit-comment"
            onClick={() => onCommentSelect({ id, content })}
          >
            Edit
          </span>
          <span
            className="badge badge-default badge-pill delete-comment"
            onClick={() => onCommentDelete(comment, deleteComment, onCommentSelect, id)}
          >
            Delete
          </span>
        </div>
      </ListGroupItem>
    );
  });
}

function onCommentDelete(comment, deleteComment, onCommentSelect, id) {
  if (comment.id === id) {
    onCommentSelect({ id: null, content: '' });
  }

  deleteComment(id);
}

const onSubmit = (comment, postId, addComment, editComment, onCommentSelect, onFormSubmitted) => values => {
  if (comment.id === null) {
    addComment(values.content, postId);
  } else {
    editComment(comment.id, values.content);
  }

  onCommentSelect({ id: null, content: '' });
  onFormSubmitted();
};

const PostCommentsView = ({
  postId,
  comment,
  addComment,
  editComment,
  comments,
  onCommentSelect,
  deleteComment,
  onFormSubmitted
}) => {
  return (
    <div>
      <h3>Comments</h3>
      <PostCommentForm
        postId={postId}
        onSubmit={onSubmit(comment, postId, addComment, editComment, onCommentSelect, onFormSubmitted)}
        initialValues={comment}
      />
      <h1 />
      <ListGroup>{renderComments(comments, onCommentSelect, comment, deleteComment)}</ListGroup>
    </div>
  );
};

PostCommentsView.propTypes = {
  postId: PropTypes.number.isRequired,
  comments: PropTypes.array.isRequired,
  comment: PropTypes.object.isRequired,
  addComment: PropTypes.func.isRequired,
  editComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  onCommentSelect: PropTypes.func.isRequired,
  onFormSubmitted: PropTypes.func.isRequired,
  subscribeToMore: PropTypes.func.isRequired
};

export default PostCommentsView;
