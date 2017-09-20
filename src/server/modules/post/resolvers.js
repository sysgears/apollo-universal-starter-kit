import { withFilter } from 'graphql-subscriptions';

const POST_UPDATED_TOPIC = 'post_updated';
const POSTS_UPDATED_TOPIC = 'posts_updated';
const COMMENT_UPDATED_TOPIC = 'comment_updated';

export default pubsub => ({
  Query: {
    async postsQuery(obj, { limit, after }, context) {
      let edgesArray = [];
      let posts = await context.Post.getPostsPagination(limit, after);

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
    post(obj, { id }, context) {
      return context.Post.getPost(id);
    }
  },
  Post: {
    comments({ id }, args, context) {
      return context.loaders.getCommentsForPostIds.load(id);
    }
  },
  Mutation: {
    async addPost(obj, { input }, context) {
      const [id] = await context.Post.addPost(input);
      const post = await context.Post.getPost(id);
      // publish for post list
      pubsub.publish(POSTS_UPDATED_TOPIC, {
        updatePosts: {
          mutation: 'CREATED',
          id,
          node: post
        }
      });
      return post;
    },
    async deletePost(obj, { id }, context) {
      const post = await context.Post.getPost(id);
      const isDeleted = await context.Post.deletePost(id);
      if (isDeleted) {
        // publish for post list
        pubsub.publish(POSTS_UPDATED_TOPIC, {
          updatePosts: {
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
    async editPost(obj, { input }, context) {
      await context.Post.editPost(input);
      const post = await context.Post.getPost(input.id);
      // publish for post list
      pubsub.publish(POSTS_UPDATED_TOPIC, {
        updatePosts: {
          mutation: 'UPDATED',
          id: post.id,
          node: post
        }
      });
      // publish for edit post page
      pubsub.publish(POST_UPDATED_TOPIC, { updatePost: post });
      return post;
    },
    async addComment(obj, { input }, context) {
      const [id] = await context.Post.addComment(input);
      const comment = await context.Post.getComment(id);
      // publish for edit post page
      pubsub.publish(COMMENT_UPDATED_TOPIC, {
        updateComment: {
          mutation: 'CREATED',
          id: comment.id,
          postId: input.postId,
          node: comment
        }
      });
      return comment;
    },
    async deleteComment(obj, { input: { id, postId } }, context) {
      await context.Post.deleteComment(id);
      // publish for edit post page
      pubsub.publish(COMMENT_UPDATED_TOPIC, {
        updateComment: {
          mutation: 'DELETED',
          id,
          postId,
          node: null
        }
      });
      return { id };
    },
    async editComment(obj, { input }, context) {
      await context.Post.editComment(input);
      const comment = await context.Post.getComment(input.id);
      // publish for edit post page
      pubsub.publish(COMMENT_UPDATED_TOPIC, {
        updateComment: {
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
    updatePost: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(POST_UPDATED_TOPIC),
        (payload, variables) => {
          return payload.updatePost.id === variables.id;
        }
      )
    },
    updatePosts: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(POSTS_UPDATED_TOPIC),
        (payload, variables) => {
          return variables.endCursor <= payload.updatePosts.id;
        }
      )
    },
    updateComment: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(COMMENT_UPDATED_TOPIC),
        (payload, variables) => {
          return payload.updateComment.postId === variables.postId;
        }
      )
    }
  }
});
