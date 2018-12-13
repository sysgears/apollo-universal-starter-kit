// React
import React from 'react';
import { translate } from '@module/i18n-client-react';
import { FieldError } from '@module/validation-common-react';
// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import RegisterView from '../components/RegisterView';

import REGISTER from '../graphql/Register.graphql';

const catchErr = async (handleReq, values, type, t) => {
  const errors = new FieldError((await handleReq(values)).errors);

  if (errors.hasAny()) return { ...errors.errors, messageErr: t(`${type}.errorMsg`) };
};

class Register extends React.Component {
  onSubmit = async values => {
    const { register, t } = this.props;

    throw await catchErr(register, values, 'reg', t);
  };

  render() {
    return <RegisterView {...this.props} onSubmit={this.onSubmit} />;
  }
}

const RegisterWithApollo = compose(
  translate('user'),
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

export default RegisterWithApollo;
