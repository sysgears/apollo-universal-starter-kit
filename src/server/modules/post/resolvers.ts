import { PubSub, withFilter } from 'graphql-subscriptions';
import { PostInput } from './sql';

const POST_SUBSCRIPTION = 'post_subscription';
const POSTS_SUBSCRIPTION = 'posts_subscription';
const COMMENT_SUBSCRIPTION = 'comment_subscription';

export interface PostParams {
  id?: number;
  limit?: number;
  after?: number;
  input?: PostInput;
}

export default (pubsub: PubSub) => ({
  Query: {
    async posts(obj: any, args: PostParams, context: any) {
      const edgesArray: any[] = [];
      const posts = await context.Post.postsPagination(args.limit, args.after);

      posts.map((post: any) => {
        edgesArray.push({
          cursor: post.id,
          node: {
            id: post.id,
            title: post.title,
            content: post.content
          }
        });
      });

      const endCursor = edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;

      const values = await Promise.all([context.Post.getTotal(), context.Post.getNextPageFlag(endCursor)]);

      return {
        totalCount: values[0].count,
        edges: edgesArray,
        pageInfo: {
          endCursor,
          hasNextPage: values[1].count > 0
        }
      };
    },
    post(obj: any, args: PostParams, context: any) {
      return context.Post.post(args.id);
    }
  },
  Post: {
    comments({ id }: any, args: PostParams, context: any) {
      return context.loaders.getCommentsForPostIds.load(id);
    }
  },
  Mutation: {
    async addPost(obj: any, args: PostParams, context: any) {
      const [id] = await context.Post.addPost(args.input);
      const post = await context.Post.post(id);
      // publish for post list
      pubsub.publish(POSTS_SUBSCRIPTION, {
        postsUpdated: {
          mutation: 'CREATED',
          id,
          node: post
        }
      });
      return post;
    },
    async deletePost(obj: any, args: PostParams, context: any) {
      const post = await context.Post.post(args.id);
      const isDeleted = await context.Post.deletePost(args.id);
      if (isDeleted) {
        // publish for post list
        pubsub.publish(POSTS_SUBSCRIPTION, {
          postsUpdated: {
            mutation: 'DELETED',
            id: args.id,
            node: post
          }
        });
        return { id: post.id };
      } else {
        return { id: null };
      }
    },
    async editPost(obj: any, args: PostParams, context: any) {
      await context.Post.editPost(args.input);
      const post = await context.Post.post(args.input.id);
      // publish for post list
      pubsub.publish(POSTS_SUBSCRIPTION, {
        postsUpdated: {
          mutation: 'UPDATED',
          id: post.id,
          node: post
        }
      });
      // publish for edit post page
      pubsub.publish(POST_SUBSCRIPTION, { postUpdated: post });
      return post;
    },
    async addComment(obj: any, args: PostParams, context: any) {
      const [id] = await context.Post.addComment(args.input);
      const comment = await context.Post.getComment(id);
      // publish for edit post page
      pubsub.publish(COMMENT_SUBSCRIPTION, {
        commentUpdated: {
          mutation: 'CREATED',
          id: comment.id,
          postId: args.input.postId,
          node: comment
        }
      });
      return comment;
    },
    async deleteComment(obj: any, args: PostParams, context: any) {
      await context.Post.deleteComment(args.id);
      // publish for edit post page
      pubsub.publish(COMMENT_SUBSCRIPTION, {
        commentUpdated: {
          mutation: 'DELETED',
          id: args.input.id,
          postId: args.input.postId,
          node: null
        }
      });
      return { id: args.input.id };
    },
    async editComment(obj: any, args: PostParams, context: any) {
      await context.Post.editComment(args.input);
      const comment = await context.Post.getComment(args.input.id);
      // publish for edit post page
      pubsub.publish(COMMENT_SUBSCRIPTION, {
        commentUpdated: {
          mutation: 'UPDATED',
          id: args.input.id,
          postId: args.input.postId,
          node: comment
        }
      });
      return comment;
    }
  },
  Subscription: {
    postUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(POST_SUBSCRIPTION),
        (payload, variables) => {
          return payload.postUpdated.id === variables.id;
        }
      )
    },
    postsUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(POSTS_SUBSCRIPTION),
        (payload, variables) => {
          return variables.endCursor <= payload.postsUpdated.id;
        }
      )
    },
    commentUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(COMMENT_SUBSCRIPTION),
        (payload, variables) => {
          return payload.commentUpdated.postId === variables.postId;
        }
      )
    }
  }
});
