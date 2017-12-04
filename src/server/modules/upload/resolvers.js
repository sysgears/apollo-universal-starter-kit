/*eslint-disable no-unused-vars*/
export default pubsub => ({
  Query: {
    files(obj, args, { Upload }) {
      return Upload.files();
    }
  },
  Mutation: {
    uploadFile: async (obj, { file }, { Upload }) => {
      const ok = await Upload.saveFile(file);
      console.log(file);
      return ok;
    }
  },
  Subscription: {}
});
