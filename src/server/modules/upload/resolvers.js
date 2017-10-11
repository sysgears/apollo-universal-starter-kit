/*eslint-disable no-unused-vars*/
export default pubsub => ({
  Query: {},
  Mutation: {
    uploadFile: (obj, { file }, context) => {
      console.log(file);
      return true;
    }
  },
  Subscription: {}
});
