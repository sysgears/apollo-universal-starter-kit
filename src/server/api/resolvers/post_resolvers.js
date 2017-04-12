import { pubsub } from '../schema';

const postResolvers = {
  Query: {
    postsQuery(obj, { first, after }, context) {
      let edgesArray = [];
      return context.Post.getPostsPagination(first, after).then(posts => {

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

        let endCursor = edgesArray.length > 0 ? edgesArray[ edgesArray.length - 1 ].cursor : 0;

        return Promise.all([ context.Post.getTotal(), context.Post.getNextPageFlag(endCursor) ]).then((values) => {

          return {
            totalCount: values[ 0 ].count,
            edges: edgesArray,
            pageInfo: {
              endCursor: endCursor,
              hasNextPage: (values[ 1 ].count > 0 ? true : false)
            }
          };
        });
      });
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
    addPost(obj, { input }, context) {
      return context.Post.addPost(input)
        .then((id) => context.Post.getPost(id[ 0 ]))
        .then(post => {
          // publish for post list
          pubsub.publish('postsUpdated', { mutation: 'CREATED', id: post.id, endCursor: input.endCursor, node: post });
          return post;
        });
    },
    deletePost(obj, { input: { id, endCursor } }, context) {
      return context.Post.deletePost(id)
        .then(() => {
          // publish for post list
          pubsub.publish('postsUpdated', { mutation: 'DELETED', id, endCursor: endCursor, node: null });
          return { id };
        });
    },
    editPost(obj, { input }, context) {
      return context.Post.editPost(input)
        .then(() => context.Post.getPost(input.id))
        .then(post => {
          // publish for post list
          pubsub.publish('postsUpdated', { mutation: 'UPDATED', id: input.id, endCursor: input.endCursor, node: post });
          // publish for edit post page
          pubsub.publish('postUpdated', post);
          return post;
        });
    },
    addComment(obj, { input }, context) {
      return context.Post.addComment(input)
        .then((id) => context.Post.getComment(id[ 0 ]))
        .then(comment => {
          // publish for edit post page
          pubsub.publish('commentUpdated', {
            mutation: 'CREATED',
            id: comment.id,
            postId: input.postId,
            node: comment
          });
          return comment;
        });
    },
    deleteComment(obj, { input: { id, postId } }, context) {
      return context.Post.deleteComment(id)
        .then(() => {
          // publish for edit post page
          pubsub.publish('commentUpdated', { mutation: 'DELETED', id, postId, node: null });
          return { id };
        });
    },
    editComment(obj, { input }, context) {
      return context.Post.editComment(input)
        .then(() => context.Post.getComment(input.id))
        .then(comment => {
          // publish for edit post page
          pubsub.publish('commentUpdated', { mutation: 'UPDATED', id: input.id, postId: input.postId, node: comment });
          return comment;
        });
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
};

export default postResolvers;