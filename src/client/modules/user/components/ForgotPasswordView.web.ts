import { Component } from '@angular/core';
import ForgotPasswordService from '../containers/ForgotPassword';

@Component({
  selector: 'Forgot-password-view',
  template: `
    <div id="content" class="container">
      <h1>Forgot password!</h1>
      <forgot-password-form [onSubmit]="onSubmit" [sent]="sent" [submitting]="submitting"></forgot-password-form>
    </div>
  `
})
export default class ForgotPasswordView {
  public sent: boolean = false;
  public submitting: boolean = false;

  constructor(private forgotPasswordService: ForgotPasswordService) {}

  public onSubmit = (email: string) => {
    this.submitting = true;
    this.forgotPasswordService.forgotPassword(email, ({ data: { forgotPassword } }: any) => {
      this.sent = true;
      this.submitting = false;

      if (forgotPassword.errors) {
        return { errors: forgotPassword.errors };
      }

      return forgotPassword;
    });
  };
}

// // Web only component
//
// // React
// import React from 'react';
// import PropTypes from 'prop-types';
// import Helmet from 'react-helmet';
// import { SubmissionError } from 'redux-form';
// import { PageLayout } from '../../common/components/web';
// import ForgotPasswordForm from '../components/ForgotPasswordForm';
//
// class ForgotPasswordView extends React.Component {
//   state = {
//     sent: false
//   };
//
//   onSubmit = ({ forgotPassword, onFormSubmitted }) => async values => {
//     const result = await forgotPassword(values);
//
//     if (result.errors) {
//       let submitError = {
//         _error: 'Reset password failed!'
//       };
//       result.errors.map(error => (submitError[error.field] = error.message));
//       throw new SubmissionError(submitError);
//     }
//
//     this.setState({ sent: result });
//     onFormSubmitted();
//   };
//
//   render() {
//     const { forgotPassword, onFormSubmitted } = this.props;
//
//     const renderMetaData = () => (
//       <Helmet
//         title="Forgot Password"
//         meta={[
//           {
//             name: 'description',
//             content: 'Forgot password page'
//           }
//         ]}
//       />
//     );
//
//     return (
//       <PageLayout>
//         {renderMetaData()}
//         <h1>Forgot password!</h1>
//         <ForgotPasswordForm onSubmit={this.onSubmit({ forgotPassword, onFormSubmitted })} sent={this.state.sent} />
//       </PageLayout>
//     );
//   }
// }
//
// ForgotPasswordView.propTypes = {
//   forgotPassword: PropTypes.func.isRequired,
//   onFormSubmitted: PropTypes.func.isRequired
// };
//
// export default ForgotPasswordView;
