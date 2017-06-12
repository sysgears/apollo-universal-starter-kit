import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';

import [Module]Show from '../components/[module]_show';

class [Module] extends React.Component {

  render() {
    return <[Module]Show/>;
  }
}

[Module].propTypes = {
};

const [Module]WithApollo = compose()([Module]);

export default connect(
  (state) => ({}),
  (dispatch) => ({}),
)([Module]WithApollo);
