import { QueryProps } from 'react-apollo';
import { Post } from './post';
import { FormikBag } from 'formik';

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

interface PostCommentsProps extends QueryProps, CommentOperation, CommentQueryResult, CommentProps {
  comments: Comment[];
}

interface CommentProps {
  postId: number;
}

interface PostCommentFormProps extends CommentQueryResult {
  values: Comment;
  handleSubmit: (values: Comment, formikBag: FormikBag<FormikCommentProps, Comment>) => void;
}

// Operations
interface CommentOperation {
  addComment?: AddCommentFn;
  editComment?: EditCommentFn;
  deleteComment?: DeleteCommentFn;
  onCommentSelect?: OnCommentSelectFn;
  post?: Post;
}

// Queries
interface CommentQueryResult {
  comment: Comment;
}

// Formik values and props
interface FormikCommentProps extends CommentQueryResult, CommentProps {
  onSubmit: any;
}

export { CommentOperation };
export { CommentQueryResult };
export { FormikCommentProps };
export { Comment, PostCommentsProps, CommentProps, PostCommentFormProps };
export { AddCommentFn, DeleteCommentFn, OnCommentSelectFn, EditCommentFn };
