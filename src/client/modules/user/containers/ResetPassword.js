import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { reset } from 'redux-form';

import ResetPasswordView from '../components/ResetPasswordView';

import RESET_PASSWORD from '../graphql/ResetPassword.graphql';

class ResetPassword extends React.Component {
  render() {
    return <ResetPasswordView {...this.props} />;
  }
}

ResetPassword.propTypes = {
  resetPassword: PropTypes.func.isRequired
};

const ResetPasswordWithApollo = compose(
  graphql(RESET_PASSWORD, {
    props: ({ mutate }) => ({
      resetPassword: async ({ email }) => {
        try {
          const { data: { resetPassword } } = await mutate({
            variables: { input: { email } }
          });

          if (resetPassword.errors) {
            return { errors: resetPassword.errors };
          }

          return resetPassword;
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  connect(null, dispatch => ({
    onFormSubmitted() {
      dispatch(reset('resetPassword'));
    }
  }))
)(ResetPassword);

export default ResetPasswordWithApollo;
