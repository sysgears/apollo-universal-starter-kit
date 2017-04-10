export default {
  postUpdated: (options, args) => ({
    postUpdated: {
      filter: post => args.id == post.id
    },
  }),
  postsUpdated: (options, args) => ({
    postsUpdated: {
      filter: post => args.endCursor <= post.id
    }
  }),
  commentUpdated: (options, args) => ({
    commentUpdated: {
      filter: comment => args.postId === comment.postId
    },
  }),
};