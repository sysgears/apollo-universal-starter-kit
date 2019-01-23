import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';

import ActivateUser from '../components/ActivateUser';
import ACTIVATE_USER from '../graphql/ActivateUser.graphql';

class Activate extends React.Component {
  componentDidMount() {
    this.activate();
  }

  activate = () => {
    try {
      const { history, navigation, activateUser } = this.props;
      if (history) {
        const {
          match: {
            params: { token }
          }
        } = this.props;
        activateUser(token);
      } else {
        const {
          state: { params }
        } = navigation;
        const [, token] = params.split('/confirmation/');
        activateUser(token);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  render() {
    return <ActivateUser {...this.props} />;
  }
}
Activate.propTypes = {
  history: PropTypes.object,
  navigation: PropTypes.object,
  activateUser: PropTypes.func,
  match: PropTypes.object
};

export default graphql(ACTIVATE_USER, {
  props: ({ ownProps: { history, navigation }, mutate }) => ({
    activateUser: async token => {
      try {
        const {
          data: {
            activateUser: { user }
          }
        } = await mutate({
          variables: { token }
        });
        const navigationScreen = user ? 'Login' : 'Counter';
        const navigationUrl = user ? '/login' : '/';
        navigation && navigation.navigate(navigationScreen);
        history && history.push(navigationUrl);
      } catch (e) {
        console.log('e', e.graphQLErrors);
      }
    }
  })
})(Activate);
