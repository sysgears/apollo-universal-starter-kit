import React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { reset } from 'redux-form';

import ForgotPasswordView from '../components/ForgotPasswordView';

import FORGOT_PASSWORD from '../graphql/ForgotPassword.graphql';

class ForgotPassword extends React.Component {
  render() {
    return <ForgotPasswordView {...this.props} />;
  }
}

const ForgotPasswordWithApollo = compose(
  graphql(FORGOT_PASSWORD, {
    props: ({ mutate }) => ({
      forgotPassword: async ({ email }) => {
        try {
          const { data: { forgotPassword } } = await mutate({
            variables: { input: { email } }
          });

          if (forgotPassword.errors) {
            return { errors: forgotPassword.errors };
          }

          return forgotPassword;
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  connect(null, dispatch => ({
    onFormSubmitted() {
      dispatch(reset('forgotPassword'));
    }
  }))
)(ForgotPassword);

export default ForgotPasswordWithApollo;
