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

export const mergeFilter = (filter, defaults, schema) => {
  let mergeFilter = filter;
  if (!filter.hasOwnProperty('searchText')) {
    const { searchText, ...restFilters } = defaults.testModuleState.filter;
    mergeFilter = { ...restFilters, ...filter };
  }

  for (const key of schema.keys()) {
    const value = schema.values[key];
    const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;
    if (hasTypeOf(Boolean)) {
      if (mergeFilter[key] === 'true') {
        mergeFilter[key] = true;
      } else if (filter[key] === 'false') {
        mergeFilter[key] = false;
      }
    }
  }

  return mergeFilter;
};
