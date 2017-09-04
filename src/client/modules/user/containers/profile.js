/*eslint-disable no-unused-vars*/
// React
import React from 'react';
import PropTypes from 'prop-types';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import ProfileShow from '../components/profile_show';

import CURRENT_USER from '../graphql/current_user.graphql';

class Profile extends React.Component {

  render() {
    return <ProfileShow {...this.props} />;
  }
}

Profile.propTypes = {
  loading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
};

export default compose(
  graphql(CURRENT_USER, {
    props({ data: { loading, currentUser } }) {
      return { loading, currentUser };
    }
  }),
)(Profile);
