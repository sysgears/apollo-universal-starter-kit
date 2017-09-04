/*eslint-disable no-unused-vars*/
// React
import React from 'react';
import PropTypes from 'prop-types';

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

export default compose()(User);
