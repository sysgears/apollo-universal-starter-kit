import React from 'react';
import { graphql } from 'react-apollo';

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
        activateUser(token, history);
      } else {
        const { url } = navigation.state.params;
        const [, token] = url.split('/confirmation/');
        activateUser(token, navigation);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  render() {
    return <ActivateUser {...this.props} />;
  }
}
export default graphql(ACTIVATE_USER, {
  props: ({ ownProps: { history, navigation }, mutate }) => ({
    activateUser: async token => {
      try {
        const {
          data: {
            activateUser: { success }
          }
        } = await mutate({
          variables: { token }
        });
        const mobileActions = success ? navigation.navigate('Login') : navigation.navigate('Counter');
        const webActions = success ? history.push('/login/') : history.push('/');
        return navigation ? mobileActions : webActions;
      } catch (e) {
        console.log('e', e.graphQLErrors);
      }
    }
  })
})(Activate);
