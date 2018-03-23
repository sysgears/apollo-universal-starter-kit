import { match as Match } from 'react-router';
import { QueryProps } from 'react-apollo';
import { Comment } from './comment';
import { Location, History } from 'history';
import { EntityList, PageInfo } from '../../../../../common/types';
import { NavigationScreenProp } from 'react-navigation';
import { FormikBag } from 'formik';

// Post types

type AddPostFn = (title: string, content: string) => any;
type EditPostFn = (id: number, title: string, content: string) => any;
type DeletePostFn = (id: number) => any;
type LoadMoreRowsFn = () => boolean;

export { EditPostFn, AddPostFn, LoadMoreRowsFn };

// Models
interface Post {
  id: number;
  content: string;
  title: string;
  comments: Comment[];
}

interface Posts {
  posts?: EntityList<Post>;
  pageInfo: PageInfo;
}

interface PostEditProps extends PostQuery {
  addPost: AddPostFn;
  editPost: EditPostFn;
  match: Match<any>;
  navigation: NavigationScreenProp<any>;
  location: Location;
  comments: Comment[];
}

interface PostProps extends PostQueryResult {
  deletePost: DeletePostFn;
  navigation: NavigationScreenProp<any>;
}

interface PostFormProps {
  handleSubmit: (values: PostValues, formikBag: FormikBag<PostFormikProps, PostValues>) => void;
  submitting?: boolean;
  values: any;
  post: Post;
  onSubmit: any;
}

interface PostFormSchema {
  title: any[];
  content: any[];
}

export { Post, Posts, PostEditProps, PostProps, PostFormProps, PostFormSchema };

// Operations
interface PostOperation {
  addPost?: Post;
  editPost?: (id: number, title: string, content: string) => void;
}

interface PostOperationResult {
  deletePost: DeletePostFn;
}

interface PostEditOptionProps {
  navigation?: NavigationScreenProp<any>;
  history?: History;
}

export { PostOperation, PostOperationResult, PostEditOptionProps };

// Queries
interface PostQuery extends QueryProps {
  post: Post;
  loading: boolean;
}

interface PostQueryResult extends QueryProps {
  loadMoreRows: LoadMoreRowsFn;
  loading: boolean;
  posts: EntityList<Post>;
}

export { PostQuery, PostQueryResult };

// Formik props and values

interface PostValues {
  title: string;
  content: string;
}

interface PostFormikProps {
  onSubmit: (post: Post, addPost: AddPostFn, editPost: EditPostFn) => void;
  post: any;
}

export { PostValues, PostFormikProps };
