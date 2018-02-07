import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';

import { EditView } from '../../common/components/crud';
import { pickInputFields } from '../../common/util';
import { CustomerSchema } from '../../../../../server/src/modules/customer/schema';
import CUSTOMER_QUERY from '../graphql/CustomerQuery.graphql';
import CREATE_CUSTOMER from '../graphql/CreateCustomer.graphql';
import UPDATE_CUSTOMER from '../graphql/UpdateCustomer.graphql';

class CustomerEdit extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    createEntry: PropTypes.func.isRequired,
    updateEntry: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
  };

  onSubmit = async values => {
    const { data: { node }, createEntry, updateEntry, title } = this.props;
    let result = null;
    const insertValues = pickInputFields(CustomerSchema, values, node);

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
      throw new SubmissionError(submitError);
    }
  };

  render() {
    return <EditView {...this.props} onSubmit={this.onSubmit} schema={CustomerSchema} />;
  }
}

const CustomerEditWithApollo = compose(
  graphql(CUSTOMER_QUERY, {
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
    props({ data: { loading, customer } }) {
      return { loading, data: customer };
    }
  }),
  graphql(CREATE_CUSTOMER, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      createEntry: async data => {
        try {
          const { data: { createCustomer } } = await mutate({
            variables: { data }
          });

          if (createCustomer.errors) {
            return { errors: createCustomer.errors };
          }

          if (history) {
            return history.push('/customer');
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
  graphql(UPDATE_CUSTOMER, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      updateEntry: async (data, where) => {
        try {
          const { data: { updateCustomer } } = await mutate({
            variables: { data, where }
          });

          if (updateCustomer.errors) {
            return { errors: updateCustomer.errors };
          }

          if (history) {
            return history.push('/customer');
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
)(CustomerEdit);

export default connect(state => ({
  title: state.customer.title,
  link: state.customer.link
}))(CustomerEditWithApollo);
