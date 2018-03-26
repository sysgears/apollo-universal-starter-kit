import { QueryProps } from 'react-apollo';
import { Post } from './post';
import { FormikBag } from 'formik';

/* Entities */
interface Comment {
  id?: number;
  content: string;
}

/* Component props */
interface CommentUpdatedProps {
  id: number;
  mutation: string;
  node: Comment;
}

interface CommentUpdatedResult {
  commentUpdated: CommentUpdatedProps;
}

interface CommentQueryResult {
  comment: Comment;
}

interface CommentOperation {
  addComment?: AddCommentFn;
  editComment?: EditCommentFn;
  deleteComment?: DeleteCommentFn;
  onCommentSelect?: OnCommentSelectFn;
}

interface PostCommentsProps extends QueryProps, CommentOperation, CommentQueryResult {
  comments: Comment[];
  postId: number;
}

interface CommentFormikProps {
  onSubmit: (options?: any) => void;
  postId: number;
  comment: Comment;
}

interface PostCommentFormProps extends PostCommentsProps {
  values: Comment;
  handleSubmit: (values: Comment, formikBag: FormikBag<CommentFormikProps, Comment>) => void;
}

/* Types */
type AddCommentFn = (content: string, postId: number) => any;
type EditCommentFn = (id: number, content: string) => any;
type DeleteCommentFn = (id: number) => any;
type OnCommentSelectFn = (comment: Comment) => void;

export { CommentOperation };
export { CommentQueryResult };
export { CommentFormikProps };
export { CommentUpdatedResult };
export { Comment, PostCommentsProps, PostCommentFormProps };
export { AddCommentFn, DeleteCommentFn, OnCommentSelectFn, EditCommentFn };
