import React from 'react';
import { graphql, compose } from 'react-apollo';

import { removeTypename, removeEmpty } from '../../../../../common/utils';
import { ListView } from '../../common/components/crud';
import { updateEntry, deleteEntry } from '../../common/crud';
import { SubCategorySchema } from '../../../../../server/src/modules/subCategory/schema';

import SUBCATEGORY_STATE_QUERY from '../graphql/SubCategoryStateQuery.client.graphql';
import UPDATE_ORDER_BY from '../graphql/UpdateOrderBy.client.graphql';
import SUBCATEGORYS_QUERY from '../graphql/SubCategorysQuery.graphql';
import UPDATE_SUBCATEGORY from '../graphql/UpdateSubCategory.graphql';
import DELETE_SUBCATEGORY from '../graphql/DeleteSubCategory.graphql';
import SORT_SUBCATEGORYS from '../graphql/SortSubCategorys.graphql';
import DELETEMANY_SUBCATEGORYS from '../graphql/DeleteManySubCategorys.graphql';
import UPDATEMANY_SUBCATEGORYS from '../graphql/UpdateManySubCategorys.graphql';

class SubCategory extends React.Component {
  render() {
    return <ListView {...this.props} schema={SubCategorySchema} />;
  }
}

export default compose(
  graphql(SUBCATEGORY_STATE_QUERY, {
    props({ data: { subCategoryState } }) {
      return removeTypename(subCategoryState);
    }
  }),
  graphql(SUBCATEGORYS_QUERY, {
    options: ({ limit, orderBy, filter }) => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: { limit, orderBy, filter: removeEmpty(filter) }
      };
    },
    props: ({ data: { loading, subCategorysConnection, refetch, error, fetchMore } }) => {
      const loadMoreRows = () => {
        return fetchMore({
          variables: {
            offset: subCategorysConnection.edges.length
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.subCategorysConnection.edges;
            const pageInfo = fetchMoreResult.subCategorysConnection.pageInfo;

            return {
              subCategorysConnection: {
                edges: [...previousResult.subCategorysConnection.edges, ...newEdges],
                pageInfo,
                __typename: 'SubCategorysConnection'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return {
        loading,
        data: subCategorysConnection,
        loadMoreRows,
        refetch,
        errors: error ? error.graphQLErrors : null
      };
    }
  }),
  graphql(UPDATE_SUBCATEGORY, {
    props: props => ({
      updateEntry: args => updateEntry(props, args, 'updateSubCategory')
    })
  }),
  graphql(DELETE_SUBCATEGORY, {
    props: props => ({
      deleteEntry: args => deleteEntry(props, args, 'deleteSubCategory')
    })
  }),
  graphql(SORT_SUBCATEGORYS, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      sortEntries: async data => {
        try {
          const {
            data: { sortSubCategorys }
          } = await mutate({
            variables: { data }
          });

          if (sortSubCategorys.errors) {
            return { errors: sortSubCategorys.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(DELETEMANY_SUBCATEGORYS, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      deleteManyEntries: async where => {
        try {
          const {
            data: { deleteManySubCategorys }
          } = await mutate({
            variables: { where }
          });

          if (deleteManySubCategorys.errors) {
            return { errors: deleteManySubCategorys.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(UPDATEMANY_SUBCATEGORYS, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      updateManyEntries: async (data, where) => {
        try {
          const {
            data: { updateManySubCategorys }
          } = await mutate({
            variables: { data: removeEmpty(data), where }
          });

          if (updateManySubCategorys.errors) {
            return { errors: updateManySubCategorys.errors };
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
)(SubCategory);
