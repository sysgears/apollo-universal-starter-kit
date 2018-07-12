import React from 'react';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import { removeTypename, removeEmpty } from '../../../../../common/utils';
import { ListView } from '../../common/components/crud';
import { updateEntry, deleteEntry } from '../../common/crud';
import { ProductSchema } from '../../../../../server/src/modules/product/schema';

import PRODUCT_STATE_QUERY from '../graphql/ProductStateQuery.client.graphql';
import UPDATE_ORDER_BY from '../graphql/UpdateOrderBy.client.graphql';
import PRODUCTS_QUERY from '../graphql/ProductsQuery.graphql';
import UPDATE_PRODUCT from '../graphql/UpdateProduct.graphql';
import DELETE_PRODUCT from '../graphql/DeleteProduct.graphql';
import SORT_PRODUCTS from '../graphql/SortProducts.graphql';
import DELETEMANY_PRODUCTS from '../graphql/DeleteManyProducts.graphql';
import UPDATEMANY_PRODUCTS from '../graphql/UpdateManyProducts.graphql';
import PRODUCTS_SUBSCRIPTION from '../graphql/ProductsSubscription.graphql';

function AddProduct(prev, node) {
  return update(prev, {
    productsConnection: {
      totalCount: {
        $set: prev.productsConnection.totalCount + 1
      },
      edges: {
        $set: [...prev.productsConnection.edges, node]
      }
    }
  });
}

class Product extends React.Component {
  static propTypes = {
    subscribeToMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidMount() {
    this.initCommentListSubscription();
  }

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
      this.subscription = null;
    }
  }

  initCommentListSubscription() {
    if (!this.subscription) {
      this.subscribeToProductsList();
    }
  }

  subscribeToProductsList = () => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: PRODUCTS_SUBSCRIPTION,
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              productsUpdated: { mutation, node }
            }
          }
        }
      ) => {
        let newResult = prev;

        if (mutation === 'CREATED') {
          newResult = AddProduct(prev, node);
        }
        return newResult;
      }
    });
  };

  render() {
    return <ListView {...this.props} schema={ProductSchema} />;
  }
}

export default compose(
  graphql(PRODUCT_STATE_QUERY, {
    props({ data: { productState } }) {
      return removeTypename(productState);
    }
  }),
  graphql(PRODUCTS_QUERY, {
    options: ({ limit, orderBy, filter }) => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: { limit, orderBy, filter: removeEmpty(filter) }
      };
    },
    props: ({ data: { loading, productsConnection, refetch, error, fetchMore, subscribeToMore } }) => {
      const loadMoreRows = () => {
        return fetchMore({
          variables: {
            offset: productsConnection.edges.length
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.productsConnection.edges;
            const pageInfo = fetchMoreResult.productsConnection.pageInfo;

            return {
              productsConnection: {
                edges: [...previousResult.productsConnection.edges, ...newEdges],
                pageInfo,
                __typename: 'ProductsConnection'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return {
        loading,
        data: productsConnection,
        loadMoreRows,
        refetch,
        subscribeToMore,
        errors: error ? error.graphQLErrors : null
      };
    }
  }),
  graphql(UPDATE_PRODUCT, {
    props: props => ({
      updateEntry: args => updateEntry(props, args, 'updateProduct')
    })
  }),
  graphql(DELETE_PRODUCT, {
    props: props => ({
      deleteEntry: args => deleteEntry(props, args, 'deleteProduct')
    })
  }),
  graphql(SORT_PRODUCTS, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      sortEntries: async data => {
        try {
          const {
            data: { sortProducts }
          } = await mutate({
            variables: { data }
          });

          if (sortProducts.errors) {
            return { errors: sortProducts.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(DELETEMANY_PRODUCTS, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      deleteManyEntries: async where => {
        try {
          const {
            data: { deleteManyProducts }
          } = await mutate({
            variables: { where }
          });

          if (deleteManyProducts.errors) {
            return { errors: deleteManyProducts.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(UPDATEMANY_PRODUCTS, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      updateManyEntries: async (data, where) => {
        try {
          const {
            data: { updateManyProducts }
          } = await mutate({
            variables: { data: removeEmpty(data), where }
          });

          if (updateManyProducts.errors) {
            return { errors: updateManyProducts.errors };
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
)(Product);
