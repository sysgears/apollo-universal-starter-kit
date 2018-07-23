import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import $MODULE$S_QUERY from '../graphql/$Module$sQuery.graphql';

class $Module$sQuery extends React.Component {
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

export default graphql($MODULE$S_QUERY, {
  options: ({ limit, orderBy, filter }) => ({ variables: { limit, orderBy, filter } }),
  props: ({ data: { loading, $module$sConnection, error } }) => {
    if (error) throw new Error(error);
    return { loading, data: $module$sConnection, errors: error ? error.graphQLErrors : null };
  }
})($Module$sQuery);
