import { PubSub, withFilter } from 'graphql-subscriptions';
import { createBatchResolver } from 'graphql-resolve-batch';
// interfaces
import { Post, Comment, Identifier } from './sql';

interface Edges {
  cursor: number;
  node: Post & Identifier;
}

interface PostsParams {
  limit: number;
  after: number;
}

interface PostInput {
  input: Post;
}

interface PostInputWithId {
  input: Post & Identifier;
}

interface CommentInput {
  input: Comment;
}

interface CommentInputWithId {
  input: Comment & Identifier;
}

const POST_SUBSCRIPTION = 'post_subscription';
const POSTS_SUBSCRIPTION = 'posts_subscription';
const COMMENT_SUBSCRIPTION = 'comment_subscription';

export default (pubsub: PubSub) => ({
  Query: {
    async posts(obj: any, { limit, after }: PostsParams, context: any) {
      const edgesArray: Edges[] = [];
      const posts = await context.Post.postsPagination(limit, after);
      const total = (await context.Post.getTotal()).count;
      const hasNextPage = total > after + limit;

      posts.map((post: Post & Identifier, index: number) => {
        edgesArray.push({
          cursor: after + index,
          node: post
        });
      });
      const endCursor = edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;

      return {
        totalCount: total,
        edges: edgesArray,
        pageInfo: {
          endCursor,
          hasNextPage
        }
      };
    },
    post(obj: any, { id }: Identifier, context: any) {
      return context.Post.post(id);
    }
  },
  Post: {
    comments: createBatchResolver((sources, args, context) => {
      return context.Post.getCommentsForPostIds(sources.map(({ id }) => id));
    })
  },
  Mutation: {
    async addPost(obj: any, { input }: PostInput, context: any) {
      const [id] = await context.Post.addPost(input);
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
    async deletePost(obj: any, { id }: Identifier, context: any) {
      const post = await context.Post.post(id);
      const isDeleted = await context.Post.deletePost(id);
      if (isDeleted) {
        // publish for post list
        pubsub.publish(POSTS_SUBSCRIPTION, {
          postsUpdated: {
            mutation: 'DELETED',
            id,
            node: post
          }
        });
        // publish for edit post page
        pubsub.publish(POST_SUBSCRIPTION, {
          postUpdated: {
            mutation: 'DELETED',
            id,
            node: post
          }
        });
        return { id: post.id };
      } else {
        return { id: null };
      }
    },
    async editPost(obj: any, { input }: PostInputWithId, context: any) {
      await context.Post.editPost(input);
      const post = await context.Post.post(input.id);
      // publish for post list
      pubsub.publish(POSTS_SUBSCRIPTION, {
        postsUpdated: {
          mutation: 'UPDATED',
          id: post.id,
          node: post
        }
      });
      // publish for edit post page
      pubsub.publish(POST_SUBSCRIPTION, {
        postUpdated: {
          mutation: 'UPDATED',
          id: post.id,
          node: post
        }
      });
      return post;
    },
    async addComment(obj: any, { input }: CommentInput, context: any) {
      const [id] = await context.Post.addComment(input);
      const comment = await context.Post.getComment(id);
      // publish for edit post page
      pubsub.publish(COMMENT_SUBSCRIPTION, {
        commentUpdated: {
          mutation: 'CREATED',
          id: comment.id,
          postId: input.postId,
          node: comment
        }
      });
      return comment;
    },
    async deleteComment(obj: any, { input: { id, postId } }: CommentInputWithId, context: any) {
      await context.Post.deleteComment(id);
      // publish for edit post page
      pubsub.publish(COMMENT_SUBSCRIPTION, {
        commentUpdated: {
          mutation: 'DELETED',
          id,
          postId,
          node: null
        }
      });
      return { id };
    },
    async editComment(obj: any, { input }: CommentInputWithId, context: any) {
      await context.Post.editComment(input);
      const comment = await context.Post.getComment(input.id);
      // publish for edit post page
      pubsub.publish(COMMENT_SUBSCRIPTION, {
        commentUpdated: {
          mutation: 'UPDATED',
          id: input.id,
          postId: input.postId,
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
