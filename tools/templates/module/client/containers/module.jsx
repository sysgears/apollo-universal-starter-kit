/*eslint-disable no-unused-vars*/
// React
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import [Module]Show from '../components/[module]_show';

class [Module] extends React.Component {

  render() {
    return <[Module]Show {...this.props} />;
  }
}

[Module].propTypes = {
};

const [Module]WithApollo = compose()([Module]);

export default connect(
  (state) => ({}),
  (dispatch) => ({}),
)([Module]WithApollo);
