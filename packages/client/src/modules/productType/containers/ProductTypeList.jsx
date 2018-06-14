import React from 'react';
import { graphql, compose } from 'react-apollo';

import { removeTypename, removeEmpty } from '../../../../../common/utils';
import { ListView } from '../../common/components/crud';
import { updateEntry, deleteEntry } from '../../common/crud';
import { ProductTypeSchema } from '../../../../../server/src/modules/productType/schema';

import PRODUCTTYPE_STATE_QUERY from '../graphql/ProductTypeStateQuery.client.graphql';
import UPDATE_ORDER_BY from '../graphql/UpdateOrderBy.client.graphql';
import PRODUCTTYPES_QUERY from '../graphql/ProductTypesQuery.graphql';
import UPDATE_PRODUCTTYPE from '../graphql/UpdateProductType.graphql';
import DELETE_PRODUCTTYPE from '../graphql/DeleteProductType.graphql';
import SORT_PRODUCTTYPES from '../graphql/SortProductTypes.graphql';
import DELETEMANY_PRODUCTTYPES from '../graphql/DeleteManyProductTypes.graphql';
import UPDATEMANY_PRODUCTTYPES from '../graphql/UpdateManyProductTypes.graphql';

class ProductType extends React.Component {
  render() {
    return <ListView {...this.props} schema={ProductTypeSchema} />;
  }
}

export default compose(
  graphql(PRODUCTTYPE_STATE_QUERY, {
    props({ data: { productTypeState } }) {
      return removeTypename(productTypeState);
    }
  }),
  graphql(PRODUCTTYPES_QUERY, {
    options: ({ limit, orderBy, filter }) => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: { limit, orderBy, filter: removeEmpty(filter) }
      };
    },
    props: ({ data: { loading, productTypesConnection, refetch, error, fetchMore } }) => {
      const loadMoreRows = () => {
        return fetchMore({
          variables: {
            offset: productTypesConnection.edges.length
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.productTypesConnection.edges;
            const pageInfo = fetchMoreResult.productTypesConnection.pageInfo;

            return {
              productTypesConnection: {
                edges: [...previousResult.productTypesConnection.edges, ...newEdges],
                pageInfo,
                __typename: 'ProductTypesConnection'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return {
        loading,
        data: productTypesConnection,
        loadMoreRows,
        refetch,
        errors: error ? error.graphQLErrors : null
      };
    }
  }),
  graphql(UPDATE_PRODUCTTYPE, {
    props: props => ({
      updateEntry: args => updateEntry(props, args, 'updateProductType')
    })
  }),
  graphql(DELETE_PRODUCTTYPE, {
    props: props => ({
      deleteEntry: args => deleteEntry(props, args, 'deleteProductType')
    })
  }),
  graphql(SORT_PRODUCTTYPES, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      sortEntries: async data => {
        try {
          const {
            data: { sortProductTypes }
          } = await mutate({
            variables: { data }
          });

          if (sortProductTypes.errors) {
            return { errors: sortProductTypes.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(DELETEMANY_PRODUCTTYPES, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      deleteManyEntries: async where => {
        try {
          const {
            data: { deleteManyProductTypes }
          } = await mutate({
            variables: { where }
          });

          if (deleteManyProductTypes.errors) {
            return { errors: deleteManyProductTypes.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(UPDATEMANY_PRODUCTTYPES, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      updateManyEntries: async (data, where) => {
        try {
          const {
            data: { updateManyProductTypes }
          } = await mutate({
            variables: { data: removeEmpty(data), where }
          });

          if (updateManyProductTypes.errors) {
            return { errors: updateManyProductTypes.errors };
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
)(ProductType);
