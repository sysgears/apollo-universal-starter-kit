/*eslint-disable no-unused-vars*/
// React
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import UserShow from '../components/user_show';

class User extends React.Component {

  render() {
    return <UserShow/>;
  }
}

User.propTypes = {
};

const UserWithApollo = compose()(User);

export default connect(
  (state) => ({}),
  (dispatch) => ({}),
)(UserWithApollo);
