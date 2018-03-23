import { QueryProps } from 'react-apollo';
import { Post } from './post';
import { FormikBag } from 'formik';

// Comment types
type AddCommentFn = (content: string, postId: number) => any;
type EditCommentFn = (id: number, content: string) => any;
type DeleteCommentFn = (id: number) => any;
type OnCommentSelectFn = (comment: Comment) => void;

export { AddCommentFn, DeleteCommentFn, OnCommentSelectFn, EditCommentFn };

// Models
interface Comment {
  id?: number;
  content: string;
}

interface PostCommentsProps extends QueryProps, CommentOperation, CommentQueryResult {
  postId: number;
  comments: Comment[];
}

interface CommentProps {
  postId: number;
}

interface PostCommentFormProps {
  values: CommentValues;
  handleSubmit: (values: CommentValues, formikBag: FormikBag<FormikCommentProps, CommentValues>) => void;
  comment: Comment;
}

interface CommentFormSchema {
  content: any[];
}

export { Comment, PostCommentsProps, CommentProps, PostCommentFormProps, CommentFormSchema };

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

// Formik values and props
interface CommentValues {
  content: string;
}

interface FormikCommentProps {
  onSubmit: () => void;
  comment: Comment;
}

export { CommentValues, FormikCommentProps };
