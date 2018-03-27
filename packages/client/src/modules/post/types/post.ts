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

/* Graphql types */
interface PostsUpdatedPayload {
  mutation: string;
  node: Post;
}

interface PostsUpdatedResult {
  postsUpdated: PostsUpdatedPayload;
}

/* Types */
type AddPostFn = (title: string, content: string) => any;
type EditPostFn = (id: number, title: string, content: string) => any;
type DeletePostFn = (id: number) => any;
type LoadMoreRowsFn = () => Promise<ApolloQueryResult<any>>;

/* Component props */
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

interface PostFormProps {
  onSubmit: (post: Post, addPost: AddPostFn, editPost: EditPostFn) => void;
  post: Post;
  submitting?: boolean;
}

export { PostOperation };
export { PostQueryResult };
export { PostsUpdatedResult };
export { EditPostFn, AddPostFn, LoadMoreRowsFn };
export { Post, PostProps, PostFormProps };
