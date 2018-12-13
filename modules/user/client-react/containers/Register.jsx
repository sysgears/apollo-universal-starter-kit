// React
import React from 'react';
import { translate } from '@module/i18n-client-react';
// Apollo
import { graphql, compose } from 'react-apollo';
import withSubmit from './withSubmit';
// Components
import RegisterView from '../components/RegisterView';

import REGISTER from '../graphql/Register.graphql';

class Register extends React.Component {
  render() {
    return <RegisterView {...this.props} />;
  }
}

const RegisterWithApollo = compose(
  translate('user'),
  graphql(REGISTER, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      handleRequest: async ({ username, email, password }) => {
        try {
          const {
            data: { register }
          } = await mutate({
            variables: { input: { username, email, password } }
          });

          if (register.errors) {
            return { errors: register.errors };
          } else if (history) {
            history.push('/profile');
          } else if (navigation) {
            navigation.goBack();
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(withSubmit(Register, 'reg'));

export default RegisterWithApollo;
