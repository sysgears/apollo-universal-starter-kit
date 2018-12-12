// React
import React from 'react';
import { translate } from '@module/i18n-client-react';
import { FieldError } from '@module/validation-common-react';
// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import RegisterView from '../components/RegisterView';

import REGISTER from '../graphql/Register.graphql';

class Register extends React.Component {
  onSubmit = async values => {
    const { register, t } = this.props;
    const errors = new FieldError((await register(values)).errors);

    throw { ...errors.errors, registrationErr: t('reg.errorMsg') };
  };

  render() {
    return <RegisterView {...this.props} onSubmit={this.onSubmit} />;
  }
}

const RegisterWithApollo = compose(
  graphql(REGISTER, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      register: async ({ username, email, password }) => {
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
)(Register);

export default translate('user')(RegisterWithApollo);
