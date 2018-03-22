import { SubscribeToMoreOptions } from 'apollo-client';
import { match as Match } from 'react-router';
import { Comment } from './comment';
import { Location } from 'history';
import { EntityList, PageInfo } from '../../../../../common/types';
import { NavigationScreenProp } from 'react-navigation';

// Post types

type AddPostFn = (title: string, content: string) => any;
type EditPostFn = (id: number, title: string, content: string) => any;
type DeletePostFn = (id: number) => any;
type LoadMoreRowsFn = () => boolean;

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
  navigation: NavigationScreenProp<any>;
  location: Location;
  comments: Comment[];
}

interface PostProps {
  loadMoreRows: LoadMoreRowsFn;
  deletePost: DeletePostFn;
  loading: boolean;
  posts: EntityList<Post>;
  subscribeToMore: (option: SubscribeToMoreOptions) => void;
  navigation: NavigationScreenProp<any>;
}

interface PostQueryResult {
  loadMoreRows: () => EntityList<Post>;
  loading: boolean;
  subscribeToMore: (option: SubscribeToMoreOptions) => void;
  posts: EntityList<Post>;
}

interface PostOperationResult {
  deletePost: (id: number) => any;
}

interface PostListProps {
  loading: boolean;
  posts?: EntityList<Post>;
  deletePost: DeletePostFn;
  loadMoreRows: LoadMoreRowsFn;
  navigation: NavigationScreenProp<any>;
}

export {
  Post,
  Posts,
  PostOperation,
  PostQuery,
  PostEditProps,
  PostProps,
  PostQueryResult,
  PostOperationResult,
  PostListProps,
  LoadMoreRowsFn,
  EditPostFn,
  AddPostFn
};
