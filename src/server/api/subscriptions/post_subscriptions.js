const postSetupFunctions = {
  postUpdated: (options, args) => ({
    postUpdated: {
      filter: post => args.id == post.id
    },
  }),
  postsUpdated: (options, args) => ({
    postsUpdated: () => true
  }),
  commentUpdated: (options, args) => ({
    commentUpdated: {
      filter: comment => args.postId === comment.postId
    },
  }),
};

export default  postSetupFunctions;