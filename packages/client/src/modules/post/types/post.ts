import { RouteComponentProps } from 'react-router';
import { QueryProps } from 'react-apollo';
import { ApolloQueryResult } from 'apollo-client';
import { Comment } from './comment';
import { Location, History } from 'history';
import { EntityList, PageInfo } from '../../../../../common/types';
import { NavigationScreenProps } from 'react-navigation';
import { FormikBag } from 'formik';

// Post types

type AddPostFn = (title: string, content: string) => any;
type EditPostFn = (id: number, title: string, content: string) => any;
type DeletePostFn = (id: number) => any;
type LoadMoreRowsFn = () => Promise<ApolloQueryResult<any>>;

// Models
interface Post {
  id: number;
  content: string;
  title: string;
  comments: Comment[];
}

interface PostProps
  extends PostQueryResult,
    PostOperation,
    RouteComponentProps<any>,
    QueryProps,
    NavigationScreenProps {}

interface PostFormProps extends PostFormikProps {
  handleSubmit: (values: Post, formikBag: FormikBag<PostFormikProps, Post>) => void;
  submitting?: boolean;
  values: Post;
}

// Operations
interface PostOperation {
  addPost: AddPostFn;
  editPost: EditPostFn;
  deletePost: DeletePostFn;
}

// Queries
interface PostQueryResult {
  post: Post;
  loadMoreRows: LoadMoreRowsFn;
  posts: EntityList<Post>;
}

// Formik props
interface PostFormikProps {
  onSubmit: (post: Post, addPost: AddPostFn, editPost: EditPostFn) => void;
  post: Post;
}

export { PostQueryResult };
export { PostOperation };
export { PostFormikProps };
export { EditPostFn, AddPostFn, LoadMoreRowsFn };
export { Post, PostProps, PostFormProps };
