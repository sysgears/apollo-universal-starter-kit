import { withFilter } from 'graphql-subscriptions';
import { createBatchResolver } from 'graphql-resolve-batch';

const POST_SUBSCRIPTION = 'post_subscription';
const POSTS_SUBSCRIPTION = 'posts_subscription';
const COMMENT_SUBSCRIPTION = 'comment_subscription';

const subscriptionFn = (type, name, mutation, id, node, pubsub) => {
  pubsub.publish(type, {
    [name]: {
      mutation: mutation,
      id,
      node
    }
  });
};

export default pubsub => ({
  Query: {
    async posts(obj, { limit, after }, context) {
      let edgesArray = [];
      let posts = await context.Post.postsPagination(limit, after);

      posts.map(post => {
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
          endCursor: endCursor,
          hasNextPage: values[1].count > 0
        }
      };
    },
    post(obj, { id }, context) {
      return context.Post.post(id);
    }
  },
  Post: {
    comments: createBatchResolver((sources, args, context) => {
      return context.Post.getCommentsForPostIds(sources.map(({ id }) => id));
    })
  },
  Mutation: {
    async addPost(obj, { input }, context) {
      const [id] = await context.Post.addPost(input);
      const post = await context.Post.post(id);
      // publish for post list
      subscriptionFn(POSTS_SUBSCRIPTION, 'postsUpdated', 'CREATED', id, post, pubsub);
      return post;
    },
    async deletePost(obj, { id }, context) {
      const post = await context.Post.post(id);
      const isDeleted = await context.Post.deletePost(id);
      if (isDeleted) {
        // publish for post list
        subscriptionFn(POSTS_SUBSCRIPTION, 'postsUpdated', 'CREATED', id, post, pubsub);
        return { id: post.id };
      } else {
        return { id: null };
      }
    },
    async editPost(obj, { input }, context) {
      await context.Post.editPost(input);
      const post = await context.Post.post(input.id);
      // publish for post list
      subscriptionFn(POSTS_SUBSCRIPTION, 'postsUpdated', 'CREATED', post.id, post, pubsub);
      // publish for edit post page
      pubsub.publish(POST_SUBSCRIPTION, { postUpdated: post });
      return post;
    },
    async addComment(obj, { input }, context) {
      const [id] = await context.Post.addComment(input);
      const comment = await context.Post.getComment(id);
      // publish for edit post page
      subscriptionFn(COMMENT_SUBSCRIPTION, 'commentUpdated', 'CREATED', comment.id, comment, pubsub);
      return comment;
    },
    async deleteComment(obj, { input: { id } }, context) {
      const comment = await context.Post.getComment(id);
      await context.Post.deleteComment(id);
      // publish for edit post page
      subscriptionFn(COMMENT_SUBSCRIPTION, 'commentUpdated', 'DELETED', id, comment, pubsub);
      return { id };
    },
    async editComment(obj, { input }, context) {
      await context.Post.editComment(input);
      const comment = await context.Post.getComment(input.id);
      // publish for edit post page
      subscriptionFn(COMMENT_SUBSCRIPTION, 'commentUpdated', 'UPDATED', input.id, comment, pubsub);
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
          return payload.commentUpdated.node.postId === variables.postId;
        }
      )
    }
  }
});
