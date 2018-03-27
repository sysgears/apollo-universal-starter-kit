import { QueryProps } from 'react-apollo';

/* Entities */
interface Comment {
  id?: number;
  content?: string;
}

/* Graphql types */
interface CommentUpdatedPayload {
  id: number;
  mutation: string;
  node: Comment;
}

interface CommentUpdatedResult {
  commentUpdated: CommentUpdatedPayload;
}

/* Types */
type AddCommentFn = (content: string, postId: number) => any;
type EditCommentFn = (id: number, content: string) => any;
type DeleteCommentFn = (id: number) => any;
type OnCommentSelectFn = (comment: Comment) => any;

/* Component props */
interface CommentQueryResult {
  comment: Comment;
}

interface CommentOperation {
  addComment: AddCommentFn;
  editComment: EditCommentFn;
  deleteComment: DeleteCommentFn;
  onCommentSelect: OnCommentSelectFn;
}

interface PostCommentsProps extends QueryProps, CommentOperation, CommentQueryResult {
  comments: Comment[];
  postId: number;
}

interface CommentFormProps {
  onSubmit: (options?: any) => void;
  postId: number;
  comment: Comment;
}

export { CommentOperation };
export { CommentQueryResult };
export { CommentFormProps };
export { CommentUpdatedResult };
export { Comment, PostCommentsProps };
export { AddCommentFn, DeleteCommentFn, OnCommentSelectFn, EditCommentFn };
