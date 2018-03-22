import { SubscribeToMoreOptions } from 'apollo-client';
import { match as Match } from 'react-router';
import { Comment } from './comment';
import { EntityList } from '../../../../../common/types';

// Post types

type AddPostFn = (title: string, content: string) => any;
type EditPostFn = (id: number, title: string, content: string) => any;
type DeletePostFn = (id: number) => any;

interface Post {
  id: number;
  content: string;
  title: string;
  comments: Comment[];
}

interface PostOperation {
  addPost?: Post;
  editPost?: (id: number, title: string, content: string) => void;
}

interface PostQuery {
  post: Post;
  loading: boolean;
  subscribeToMore: (option: SubscribeToMoreOptions) => void;
}

interface PostEditProps {
  loading: boolean;
  post: Post;
  subscribeToMore: (option: SubscribeToMoreOptions) => void;
  addPost: AddPostFn;
  editPost: EditPostFn;
  match: Match<any>;
  navigation: any;
  location: Location;
  comments: Comment[];
}

interface PostProps {
  loading: boolean;
  posts: EntityList<Post>;
  subscribeToMore: (option: SubscribeToMoreOptions) => void;
}

interface PostQueryResult extends PostProps {
  loadMoreRows: () => EntityList<Post>;
}

interface PostOperationResult {
  deletePost: (id: number) => any;
}

export { Post, PostOperation, PostQuery, PostEditProps, PostProps, PostQueryResult, PostOperationResult };
