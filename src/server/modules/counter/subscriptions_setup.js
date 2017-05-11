export default {
  countUpdated: () => ({
    // Run the query each time count updated
    countUpdated: {
      filter: () => {
        return true;
      }
    }
  })
};
