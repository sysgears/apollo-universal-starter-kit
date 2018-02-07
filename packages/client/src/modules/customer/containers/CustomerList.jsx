import React from 'react';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import { ListView } from '../../common/components/crud';
import { CustomerSchema } from '../../../../../server/src/modules/customer/schema';
import CUSTOMERS_QUERY from '../graphql/CustomersQuery.graphql';
import UPDATE_CUSTOMER from '../graphql/UpdateCustomer.graphql';
import DELETE_CUSTOMER from '../graphql/DeleteCustomer.graphql';
import SORT_CUSTOMERS from '../graphql/SortCustomers.graphql';
import DELETEMANY_CUSTOMERS from '../graphql/DeleteManyCustomers.graphql';
import UPDATEMANY_CUSTOMERS from '../graphql/UpdateManyCustomers.graphql';

class Customer extends React.Component {
  customTableColumns = {};

  render() {
    return <ListView {...this.props} customTableColumns={this.customTableColumns} schema={CustomerSchema} />;
  }
}

const CustomerWithApollo = compose(
  graphql(CUSTOMERS_QUERY, {
    options: ({ limit, orderBy, searchText }) => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          limit: limit,
          orderBy: orderBy,
          filter: { searchText }
        }
      };
    },
    props: ({ data: { loading, customersConnection, refetch, error, fetchMore } }) => {
      const loadMoreRows = () => {
        return fetchMore({
          variables: {
            offset: customersConnection.edges.length
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.customersConnection.edges;
            const pageInfo = fetchMoreResult.customersConnection.pageInfo;

            return {
              customersConnection: {
                edges: [...previousResult.customersConnection.edges, ...newEdges],
                pageInfo,
                __typename: 'CustomersConnection'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return { loading, data: customersConnection, loadMoreRows, refetch, errors: error ? error.graphQLErrors : null };
    }
  }),
  graphql(UPDATE_CUSTOMER, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      updateEntry: async (data, where) => {
        try {
          const { data: { updateCustomer } } = await mutate({
            variables: { data, where }
          });

          if (updateCustomer.errors) {
            return { errors: updateCustomer.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(DELETE_CUSTOMER, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      deleteEntry: async where => {
        try {
          const { data: { deleteCustomer } } = await mutate({
            variables: { where }
          });

          if (deleteCustomer.errors) {
            return { errors: deleteCustomer.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(SORT_CUSTOMERS, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      sortEntries: async data => {
        try {
          const { data: { sortCustomers } } = await mutate({
            variables: { data }
          });

          if (sortCustomers.errors) {
            return { errors: sortCustomers.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(DELETEMANY_CUSTOMERS, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      deleteManyEntries: async where => {
        try {
          const { data: { deleteManyCustomers } } = await mutate({
            variables: { where }
          });

          if (deleteManyCustomers.errors) {
            return { errors: deleteManyCustomers.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(UPDATEMANY_CUSTOMERS, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      updateManyEntries: async (data, where) => {
        try {
          const { data: { updateManyCustomers } } = await mutate({
            variables: { data, where }
          });

          if (updateManyCustomers.errors) {
            return { errors: updateManyCustomers.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(Customer);

export default connect(
  state => ({
    link: state.customer.link,
    limit: state.customer.limit,
    searchText: state.customer.searchText,
    orderBy: state.customer.orderBy
  }),
  dispatch => ({
    onOrderBy(orderBy) {
      dispatch({
        type: 'CUSTOMER_ORDER_BY',
        value: orderBy
      });
    }
  })
)(CustomerWithApollo);
