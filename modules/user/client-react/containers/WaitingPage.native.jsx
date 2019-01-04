import React from 'react';
import { graphql } from 'react-apollo';

import Waiting from '../components/WaitingPage';
import ACTIVATE_USER from '../graphql/ActivateUser.graphql';

class WaitingPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.activate();
  }

  activate = () => {
    try {
      const { url } = this.props.navigation.state.params;
      const [, token] = url.split('/confirmation/');
      this.props.activateUser(token, this.props.navigation);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return <Waiting {...this.props} />;
  }
}
export default graphql(ACTIVATE_USER, {
  props: ({ ownProps: { history, navigation }, mutate }) => ({
    activateUser: async token => {
      try {
        const res = await mutate({
          variables: { token }
        });
        if (res.data.activateUser.success) {
          if (navigation) {
            return navigation.navigate('Login');
          }
          if (history) {
            return history.push('/login/');
          }
        } else {
          console.log('activation error');
        }
        return;
      } catch (e) {
        console.log('e', e.graphQLErrors);
      }
    }
  })
})(WaitingPage);
