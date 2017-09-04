/*eslint-disable no-unused-vars*/
// React
import React from 'react';
import PropTypes from 'prop-types';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import ProfileShow from '../components/profile_show';

class Profile extends React.Component {

  render() {
    return <ProfileShow/>;
  }
}

Profile.propTypes = {
};

export default compose()(Profile);
