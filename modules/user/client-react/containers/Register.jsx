// React
import React from 'react';
import { translate } from '@module/i18n-client-react';
// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import { FormikMessageHandler } from '@module/validation-common-react';
import RegisterView from '../components/RegisterView';

import REGISTER from '../graphql/Register.graphql';

class Register extends React.Component {
  onSubmit = async values => {
    const { t, register, history, navigation, handleError } = this.props;

    await handleError(() => register(values), t('reg.errorMsg'));

    if (history) {
      history.push('/profile');
    } else if (navigation) {
      navigation.goBack();
    }
  };

  render() {
    return <RegisterView {...this.props} onSubmit={this.onSubmit} />;
  }
}

const RegisterWithApollo = compose(
  translate('user'),
  FormikMessageHandler,
  graphql(REGISTER, {
    props: ({ mutate }) => ({
      register: async ({ username, email, password }) => {
        try {
          const {
            data: { register }
          } = await mutate({ variables: { input: { username, email, password } } });

          return register;
        } catch (e) {
          throw e;
        }
      }
    })
  })
)(Register);
export default RegisterWithApollo;
