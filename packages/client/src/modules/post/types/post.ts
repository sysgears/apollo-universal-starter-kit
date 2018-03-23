import { match as Match } from 'react-router';
import { QueryProps } from 'react-apollo';
import { Comment } from './comment';
import { Location, History } from 'history';
import { EntityList, PageInfo } from '../../../../../common/types';
import { NavigationScreenProp } from 'react-navigation';

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

export { Post, Posts, PostEditProps, PostProps };

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

// Formik values

interface PostValues {
  title: string;
  content: string;
}

export { PostValues };