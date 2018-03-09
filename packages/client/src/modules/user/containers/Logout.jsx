import React from 'react';
import PropTypes from 'prop-types';
import { View, Button } from 'react-native';
import { withLogout } from './AuthBase';

class LogoutView extends React.Component {
  render() {
    const { logout } = this.props;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Button onPress={logout} title="Log Out" />
      </View>
    );
  }
}

LogoutView.propTypes = {
  logout: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default withLogout(LogoutView);
