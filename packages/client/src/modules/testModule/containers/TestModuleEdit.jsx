import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import { EditView } from '../../common/components/crud';
import { pickInputFields } from '../../common/util';
import { TestModuleSchema } from '../../../../../server/src/modules/testModule/schema';
import TESTMODULE_QUERY from '../graphql/TestModuleQuery.graphql';
import CREATE_TESTMODULE from '../graphql/CreateTestModule.graphql';
import UPDATE_TESTMODULE from '../graphql/UpdateTestModule.graphql';

class TestModuleEdit extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    createEntry: PropTypes.func.isRequired,
    updateEntry: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
  };

  onSubmit = async values => {
    const { data: { node }, createEntry, updateEntry, title } = this.props;
    let result = null;
    const insertValues = pickInputFields(TestModuleSchema, values, node);

    if (node) {
      result = await updateEntry(insertValues, { id: node.id });
    } else {
      result = await createEntry(insertValues);
    }

    if (result && result.errors) {
      let submitError = {
        _error: `Edit ${title} failed!`
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw new submitError();
    }
  };

  render() {
    return <EditView {...this.props} onSubmit={this.onSubmit} schema={TestModuleSchema} />;
  }
}

export default compose(
  graphql(TESTMODULE_QUERY, {
    options: props => {
      let id = 0;
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        fetchPolicy: 'cache-and-network',
        variables: { where: { id } }
      };
    },
    props({ data: { loading, testModule } }) {
      return { loading, data: testModule };
    }
  }),
  graphql(CREATE_TESTMODULE, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      createEntry: async data => {
        try {
          const { data: { createTestModule } } = await mutate({
            variables: { data }
          });

          if (createTestModule.errors) {
            return { errors: createTestModule.errors };
          }

          if (history) {
            return history.push('/testModule');
          }
          if (navigation) {
            return navigation.goBack();
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(UPDATE_TESTMODULE, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      updateEntry: async (data, where) => {
        try {
          const { data: { updateTestModule } } = await mutate({
            variables: { data, where }
          });

          if (updateTestModule.errors) {
            return { errors: updateTestModule.errors };
          }

          if (history) {
            return history.push('/testModule');
          }
          if (navigation) {
            return navigation.goBack();
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(TestModuleEdit);
