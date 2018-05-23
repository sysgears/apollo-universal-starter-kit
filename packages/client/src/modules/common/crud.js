export const updateEntry = async ({ ownProps: { refetch }, mutate }, { data, where }, updateEntryName) => {
  console.log('data:', data);
  console.log('where:', where);
  try {
    const {
      data: { [updateEntryName]: updateEntry }
    } = await mutate({
      variables: { data, where }
    });

    if (updateEntry.errors) {
      return { errors: updateEntry.errors };
    }

    refetch();

    return updateEntry;
  } catch (e) {
    console.log(e.graphQLErrors);
  }
};

export const deleteEntry = async ({ ownProps: { refetch }, mutate }, { where }, deleteEntryName) => {
  try {
    const {
      data: { [deleteEntryName]: deleteEntry }
    } = await mutate({
      variables: { where }
    });

    if (deleteEntry.errors) {
      return { errors: deleteEntry.errors };
    }

    refetch();

    return deleteEntry;
  } catch (e) {
    console.log(e.graphQLErrors);
  }
};
