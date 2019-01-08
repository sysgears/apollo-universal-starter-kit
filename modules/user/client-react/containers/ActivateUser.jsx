import React from 'react';
import { graphql } from 'react-apollo';

import ActivateUser from '../components/ActivateUser';
import ACTIVATE_USER from '../graphql/ActivateUser.graphql';

class Activate extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.activate();
  }

  activate = () => {
    try {
      if (this.props.history) {
        const token = this.props.match.params.token;
        this.props.activateUser(token, this.props.history);
      } else {
        const { url } = this.props.navigation.state.params;
        const [, token] = url.split('/confirmation/');
        this.props.activateUser(token, this.props.navigation);
      }
    } catch (error) {
      console.log(error);
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
          data: { activateUser }
        } = await mutate({
          variables: { token }
        });
        if (activateUser.success) {
          if (navigation) {
            return navigation.navigate('Login');
          }
          if (history) {
            return history.push('/login/');
          }
        } else {
          if (navigation) {
            return navigation.navigate('Counter');
          }
          if (history) {
            return history.push('/');
          }
        }
      } catch (e) {
        console.log('e', e.graphQLErrors);
      }
    }
  })
})(Activate);
