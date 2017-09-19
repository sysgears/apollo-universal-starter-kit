import { withFilter, PubSub } from "graphql-subscriptions";
import {PostInput} from "./sql";

const POST_UPDATED_TOPIC = "post_updated";
const POSTS_UPDATED_TOPIC = "posts_updated";
const COMMENT_UPDATED_TOPIC = "comment_updated";

export interface PostParams {
  id?:    number;
  input?: PostInput
}

export default (pubsub: PubSub) => ({
  Query: {
    async postsQuery(obj: any, args: any, context: any) {
      let edgesArray: any[] = [];
      let posts = await context.Post.getPostsPagination(args.limit, args.after);

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

      const endCursor =
        edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;

      const values = await Promise.all([
        context.Post.getTotal(),
        context.Post.getNextPageFlag(endCursor)
      ]);

      return {
        totalCount: values[0].count,
        edges: edgesArray,
        pageInfo: {
          endCursor: endCursor,
          hasNextPage: values[1].count > 0
        }
      };
    },
    post(obj: any, args: PostParams, context: any) {
      return context.Post.getPost(args.id);
    }
  },
  Post: {
    comments(obj: any, args: PostParams, context: any) {
      return context.loaders.getCommentsForPostIds.load(obj.id);
    }
  },
  Mutation: {
    async addPost(obj: any, args: PostParams, context: any) {
      const [id] = await context.Post.addPost(args.input);
      const post = await context.Post.getPost(id);
      // publish for post list
      pubsub.publish(POSTS_UPDATED_TOPIC, {
        postsUpdated: {
          mutation: 'CREATED',
          id,
          node: post
        }
      });
      return post;
    },
    async deletePost(obj: any, args: PostParams, context: any) {
      const post = await context.Post.getPost(args.id);
      const isDeleted = await context.Post.deletePost(args.id);
      if (isDeleted) {
        // publish for post list
        pubsub.publish(POSTS_UPDATED_TOPIC, {
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
      const post = await context.Post.getPost(args.input.id);
      // publish for post list
      pubsub.publish(POSTS_UPDATED_TOPIC, {
        postsUpdated: {
          mutation: 'UPDATED',
          id: post.id,
          node: post
        }
      });
      // publish for edit post page
      pubsub.publish(POST_UPDATED_TOPIC, { postUpdated: post });
      return post;
    },
    async addComment(obj: any, args: PostParams, context: any) {
      const [id] = await context.Post.addComment(args.input);
      const comment = await context.Post.getComment(id);
      // publish for edit post page
      pubsub.publish(COMMENT_UPDATED_TOPIC, {
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
      await context.Post.deleteComment(args.input.id);
      // publish for edit post page
      pubsub.publish(COMMENT_UPDATED_TOPIC, {
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
      pubsub.publish(COMMENT_UPDATED_TOPIC, {
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
        () => pubsub.asyncIterator(POST_UPDATED_TOPIC),
        (payload, variables) => {
          return payload.postUpdated.id === variables.id;
        }
      )
    },
    postsUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(POSTS_UPDATED_TOPIC),
        (payload, variables) => {
          return variables.endCursor <= payload.postsUpdated.id;
        }
      )
    },
    commentUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(COMMENT_UPDATED_TOPIC),
        (payload, variables) => {
          return payload.commentUpdated.postId === variables.postId;
        }
      )
    }
  }
});
