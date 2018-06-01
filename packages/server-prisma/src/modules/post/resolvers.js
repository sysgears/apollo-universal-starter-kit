export default () => ({
  Query: {
    async posts(obj, { limit, after }, context) {
      let posts = await context.db.query.postsConnection(
        {
          orderBy: 'id_DESC',
          first: limit,
          after
        },
        '{ edges {  cursor node { id title content } } }'
      );

      console.log('posts', posts);
      const endCursor = posts.length > 0 ? posts[posts.length - 1].cursor : 0;
      const total = (await context.db.query.posts(null, '{ id }')).length;
      console.log('total', total);
      const hasNextPage = total > after + limit;
      return {
        totalCount: total,
        edges: posts,
        pageInfo: {
          endCursor: endCursor,
          hasNextPage: hasNextPage
        }
      };
    },
    async post(obj, { id }, context, info) {
      return await context.db.query.post({ where: { id } }, info);
    }
  },
  Mutation: {
    async addPost(obj, { input }, context, info) {
      return await context.db.mutation.createPost({
        data: {
          ...input
        },
        info
      });
    },
    async deletePost(obj, { id }, context) {
      return await context.db.mutation.deletePost({ where: { id } }, '{ id }');
    },
    async editPost(obj, { input }, context, info) {
      return await context.db.mutation.updatePost(
        {
          data: {
            title: input.title,
            content: input.content
          },
          where: {
            id: input.id
          }
        },
        info
      );
    },
    async addComment(obj, { input }, context, info) {
      return await context.db.mutation.createComment({
        data: {
          ...input
        },
        info
      });
    }
  }
});
