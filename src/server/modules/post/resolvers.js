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
            content: post.content,
          }
        });
      });

      let endCursor = edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;

      let values = await Promise.all([context.Post.getTotal(), context.Post.getNextPageFlag(endCursor)]);

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
    },
  },
  Post: {
    comments({ id }, args, context) {
      return context.loaders.getCommentsForPostIds.load(id);
    },
  },
  Mutation: {
    async addPost(obj, { input }, context) {
      let id = await context.Post.addPost(input);
      let post = await context.Post.getPost(id[0]);
      // publish for post list
      pubsub.publish('postsUpdated', { mutation: 'CREATED', id: id[0], node: post });
      return post;
    },
    async deletePost(obj, { id }, context) {
      let post = await context.Post.getPost(id);
      let isDeleted = await context.Post.deletePost(id);
      if (isDeleted) {
        // publish for post list
        pubsub.publish('postsUpdated', { mutation: 'DELETED', id, node: post });
        return { id: post.id };
      } else {
        return { id: null };
      }
    },
    async editPost(obj, { input }, context) {
      await context.Post.editPost(input);
      let post = await context.Post.getPost(input.id);
      // publish for post list
      pubsub.publish('postsUpdated', { mutation: 'UPDATED', id: post.id, node: post });
      // publish for edit post page
      pubsub.publish('postUpdated', post);
      return post;
    },
    async addComment(obj, { input }, context) {
      let id = await context.Post.addComment(input);
      let comment = await context.Post.getComment(id[0]);
      // publish for edit post page
      pubsub.publish('commentUpdated', {
        mutation: 'CREATED',
        id: comment.id,
        postId: input.postId,
        node: comment
      });
      return comment;
    },
    async deleteComment(obj, { input: { id, postId } }, context) {
      await context.Post.deleteComment(id);
      // publish for edit post page
      pubsub.publish('commentUpdated', { mutation: 'DELETED', id, postId, node: null });
      return { id };
    },
    async editComment(obj, { input }, context) {
      await context.Post.editComment(input);
      let comment = await context.Post.getComment(input.id);
      // publish for edit post page
      pubsub.publish('commentUpdated', { mutation: 'UPDATED', id: input.id, postId: input.postId, node: comment });
      return comment;
    },
  },
  Subscription: {
    postUpdated(value) {
      return value;
    },
    postsUpdated(value) {
      return value;
    },
    commentUpdated(value) {
      return value;
    },
  }
});
