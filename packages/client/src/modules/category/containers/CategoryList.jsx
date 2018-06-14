import React from 'react';
import { graphql, compose } from 'react-apollo';

import { removeTypename, removeEmpty } from '../../../../../common/utils';
import { ListView } from '../../common/components/crud';
import { updateEntry, deleteEntry } from '../../common/crud';
import { CategorySchema } from '../../../../../server/src/modules/category/schema';

import CATEGORY_STATE_QUERY from '../graphql/CategoryStateQuery.client.graphql';
import UPDATE_ORDER_BY from '../graphql/UpdateOrderBy.client.graphql';
import CATEGORYS_QUERY from '../graphql/CategorysQuery.graphql';
import UPDATE_CATEGORY from '../graphql/UpdateCategory.graphql';
import DELETE_CATEGORY from '../graphql/DeleteCategory.graphql';
import SORT_CATEGORYS from '../graphql/SortCategorys.graphql';
import DELETEMANY_CATEGORYS from '../graphql/DeleteManyCategorys.graphql';
import UPDATEMANY_CATEGORYS from '../graphql/UpdateManyCategorys.graphql';

class Category extends React.Component {
  render() {
    return <ListView {...this.props} schema={CategorySchema} />;
  }
}

export default compose(
  graphql(CATEGORY_STATE_QUERY, {
    props({ data: { categoryState } }) {
      return removeTypename(categoryState);
    }
  }),
  graphql(CATEGORYS_QUERY, {
    options: ({ limit, orderBy, filter }) => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: { limit, orderBy, filter: removeEmpty(filter) }
      };
    },
    props: ({ data: { loading, categorysConnection, refetch, error, fetchMore } }) => {
      const loadMoreRows = () => {
        return fetchMore({
          variables: {
            offset: categorysConnection.edges.length
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.categorysConnection.edges;
            const pageInfo = fetchMoreResult.categorysConnection.pageInfo;

            return {
              categorysConnection: {
                edges: [...previousResult.categorysConnection.edges, ...newEdges],
                pageInfo,
                __typename: 'CategorysConnection'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return { loading, data: categorysConnection, loadMoreRows, refetch, errors: error ? error.graphQLErrors : null };
    }
  }),
  graphql(UPDATE_CATEGORY, {
    props: props => ({
      updateEntry: args => updateEntry(props, args, 'updateCategory')
    })
  }),
  graphql(DELETE_CATEGORY, {
    props: props => ({
      deleteEntry: args => deleteEntry(props, args, 'deleteCategory')
    })
  }),
  graphql(SORT_CATEGORYS, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      sortEntries: async data => {
        try {
          const {
            data: { sortCategorys }
          } = await mutate({
            variables: { data }
          });

          if (sortCategorys.errors) {
            return { errors: sortCategorys.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(DELETEMANY_CATEGORYS, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      deleteManyEntries: async where => {
        try {
          const {
            data: { deleteManyCategorys }
          } = await mutate({
            variables: { where }
          });

          if (deleteManyCategorys.errors) {
            return { errors: deleteManyCategorys.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(UPDATEMANY_CATEGORYS, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      updateManyEntries: async (data, where) => {
        try {
          const {
            data: { updateManyCategorys }
          } = await mutate({
            variables: { data: removeEmpty(data), where }
          });

          if (updateManyCategorys.errors) {
            return { errors: updateManyCategorys.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(UPDATE_ORDER_BY, {
    props: ({ mutate }) => ({
      onOrderBy: orderBy => {
        mutate({ variables: { orderBy } });
      }
    })
  })
)(Category);
