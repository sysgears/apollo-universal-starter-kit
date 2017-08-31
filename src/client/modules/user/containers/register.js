/*eslint-disable no-unused-vars*/
// React
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import RegisterShow from '../components/register_show.web';

class User extends React.Component {

  render() {
    return <RegisterShow/>;
  }
}

User.propTypes = {
};

const UserWithApollo = compose()(User);

export default connect(
  (state) => ({}),
  (dispatch) => ({}),
)(UserWithApollo);
