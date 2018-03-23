import { SubscribeToMoreOptions } from 'apollo-client';
import { QueryProps } from 'react-apollo';
import { Post } from './post';

// Comment types
type AddCommentFn = (content: string, postId: number) => any;
type EditCommentFn = (id: number, content: string) => any;
type DeleteCommentFn = (id: number) => any;
type OnCommentSelectFn = (comment: Comment) => void;

// Models
interface Comment {
  id?: number;
  content: string;
}

interface PostCommentsProps extends QueryProps, CommentOperation {
  postId: number;
  comments: Comment[];
  comment: Comment;
}

interface CommentProps {
  postId: number;
}

export { Comment, PostCommentsProps, CommentProps}

// Operations
interface CommentOperation {
  addComment?: AddCommentFn;
  editComment?: EditCommentFn;
  deleteComment?: DeleteCommentFn;
  onCommentSelect?: OnCommentSelectFn;
}

interface CommentOperationResult {
  post: Post;
}

export { CommentOperation, CommentOperationResult }

// Queries
interface CommentQueryResult {
  comment: Comment;
}

export { CommentQueryResult };
