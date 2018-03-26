import { RouteComponentProps } from 'react-router';
import { QueryProps } from 'react-apollo';
import { ApolloQueryResult } from 'apollo-client';
import { Comment } from './comment';
import { EntityList } from '../../../../../common/types';
import { NavigationScreenProps } from 'react-navigation';

/* Entities */
interface Post {
  id?: number;
  content: string;
  title: string;
  comments?: Comment[];
}

/* Component props */
interface PostItemRenderProps {
  node: Post;
}

interface PostsUpdatedProps {
  mutation: string;
  node: Post;
}

interface PostsUpdatedResult {
  postsUpdated: PostsUpdatedProps;
}

interface PostQueryResult {
  post: Post;
  loadMoreRows: LoadMoreRowsFn;
  posts: EntityList<Post>;
}

interface PostOperation {
  addPost: AddPostFn;
  editPost: EditPostFn;
  deletePost: DeletePostFn;
}

interface PostProps
  extends PostQueryResult,
    PostOperation,
    RouteComponentProps<any>,
    QueryProps,
    NavigationScreenProps {}

interface PostFormikProps {
  onSubmit: (post: Post, addPost: AddPostFn, editPost: EditPostFn) => void;
  post: Post;
}

interface PostFormProps {
  submitting?: boolean;
}

/* Types */
type AddPostFn = (title: string, content: string) => any;
type EditPostFn = (id: number, title: string, content: string) => any;
type DeletePostFn = (id: number) => any;
type LoadMoreRowsFn = () => Promise<ApolloQueryResult<any>>;

export { PostOperation };
export { PostQueryResult };
export { PostFormikProps };
export { PostsUpdatedResult, PostItemRenderProps };
export { EditPostFn, AddPostFn, LoadMoreRowsFn };
export { Post, PostProps, PostFormProps };
