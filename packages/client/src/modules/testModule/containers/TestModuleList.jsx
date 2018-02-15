import React from 'react';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import { ListView } from '../../common/components/crud';
import { TestModuleSchema } from '../../../../../server/src/modules/testModule/schema';
import TESTMODULES_QUERY from '../graphql/TestModulesQuery.graphql';
import UPDATE_TESTMODULE from '../graphql/UpdateTestModule.graphql';
import DELETE_TESTMODULE from '../graphql/DeleteTestModule.graphql';
import SORT_TESTMODULES from '../graphql/SortTestModules.graphql';
import DELETEMANY_TESTMODULES from '../graphql/DeleteManyTestModules.graphql';
import UPDATEMANY_TESTMODULES from '../graphql/UpdateManyTestModules.graphql';

class TestModule extends React.Component {
  customTableColumns = {};

  render() {
    return <ListView {...this.props} customTableColumns={this.customTableColumns} schema={TestModuleSchema} />;
  }
}

const TestModuleWithApollo = compose(
  graphql(TESTMODULES_QUERY, {
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
    props: ({ data: { loading, testModulesConnection, refetch, error, fetchMore } }) => {
      const loadMoreRows = () => {
        return fetchMore({
          variables: {
            offset: testModulesConnection.edges.length
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.testModulesConnection.edges;
            const pageInfo = fetchMoreResult.testModulesConnection.pageInfo;

            return {
              testModulesConnection: {
                edges: [...previousResult.testModulesConnection.edges, ...newEdges],
                pageInfo,
                __typename: 'TestModulesConnection'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return {
        loading,
        data: testModulesConnection,
        loadMoreRows,
        refetch,
        errors: error ? error.graphQLErrors : null
      };
    }
  }),
  graphql(UPDATE_TESTMODULE, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      updateEntry: async (data, where) => {
        try {
          const { data: { updateTestModule } } = await mutate({
            variables: { data, where }
          });

          if (updateTestModule.errors) {
            return { errors: updateTestModule.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(DELETE_TESTMODULE, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      deleteEntry: async where => {
        try {
          const { data: { deleteTestModule } } = await mutate({
            variables: { where }
          });

          if (deleteTestModule.errors) {
            return { errors: deleteTestModule.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(SORT_TESTMODULES, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      sortEntries: async data => {
        try {
          const { data: { sortTestModules } } = await mutate({
            variables: { data }
          });

          if (sortTestModules.errors) {
            return { errors: sortTestModules.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(DELETEMANY_TESTMODULES, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      deleteManyEntries: async where => {
        try {
          const { data: { deleteManyTestModules } } = await mutate({
            variables: { where }
          });

          if (deleteManyTestModules.errors) {
            return { errors: deleteManyTestModules.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(UPDATEMANY_TESTMODULES, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      updateManyEntries: async (data, where) => {
        try {
          const { data: { updateManyTestModules } } = await mutate({
            variables: { data, where }
          });

          if (updateManyTestModules.errors) {
            return { errors: updateManyTestModules.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(TestModule);

export default connect(
  state => ({
    link: state.testModule.link,
    limit: state.testModule.limit,
    searchText: state.testModule.searchText,
    orderBy: state.testModule.orderBy
  }),
  dispatch => ({
    onOrderBy(orderBy) {
      dispatch({
        type: 'TESTMODULE_ORDER_BY',
        value: orderBy
      });
    }
  })
)(TestModuleWithApollo);
