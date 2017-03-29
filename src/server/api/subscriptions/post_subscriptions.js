const postSetupFunctions = {
  commentUpdated: (options, args) => ({
    commentUpdated: {
      filter: comment => args.postId === comment.postId
    },
  }),
};

export default  postSetupFunctions;