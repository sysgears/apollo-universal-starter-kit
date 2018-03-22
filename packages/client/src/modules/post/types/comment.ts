import { SubscribeToMoreOptions } from 'apollo-client';
import { Post } from './post';

type SubscriptionToMoreFn = (option: SubscribeToMoreOptions) => void;

// Comment types
type AddCommentFn = (content: string, postId: number) => any;
type EditCommentFn = (id: number, content: string) => any;
type DeleteCommentFn = (id: number) => any;
type OnCommentSelectFn = (comment: Comment) => void;

interface Comment {
  id?: number;
  content: string;
}

interface CommentOperation {
  addComment?: AddCommentFn;
  editComment?: EditCommentFn;
  deleteComment?: DeleteCommentFn;
  onCommentSelect?: OnCommentSelectFn;
}

interface CommentQueryResult {
  comment: Comment;
}

interface PostCommentsProps {
  postId: number;
  comments: Comment[];
  comment: Comment;
  onCommentSelect: OnCommentSelectFn;
  subscribeToMore: SubscriptionToMoreFn;
  addComment: AddCommentFn;
  editComment: EditCommentFn;
  deleteComment: DeleteCommentFn;
}

interface CommentProps {
  postId: number;
}

interface CommentOperationResult {
  post: Post;
}

export { Comment, CommentOperation, CommentQueryResult, PostCommentsProps, CommentProps, CommentOperationResult };
