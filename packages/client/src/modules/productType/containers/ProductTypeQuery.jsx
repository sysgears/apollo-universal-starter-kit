import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import PRODUCTTYPES_QUERY from '../graphql/ProductTypesQuery.graphql';

class ProductTypesQuery extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object,
    errors: PropTypes.object
  };

  render() {
    const { loading, data, errors } = this.props;
    return this.props.children({ loading, data, errors });
  }
}

export default graphql(PRODUCTTYPES_QUERY, {
  options: ({ limit, orderBy, filter }) => ({ variables: { limit, orderBy, filter } }),
  props: ({ data: { loading, productTypesConnection, error } }) => {
    if (error) throw new Error(error);
    return { loading, data: productTypesConnection, errors: error ? error.graphQLErrors : null };
  }
})(ProductTypesQuery);
