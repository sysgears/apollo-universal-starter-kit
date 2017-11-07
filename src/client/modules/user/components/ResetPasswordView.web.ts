import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import ResetPasswordService from '../containers/ResetPassword';

@Component({
  selector: 'reset-password-view',
  template: `
    <div id="content" class="container">
      <h1>Reset password!</h1>
      <reset-password-form [onSubmit]="onSubmit" [sent]="sent" [submitting]="submitting"></reset-password-form>
    </div>
  `
})
export default class ResetPasswordView implements OnInit {
  public sent: boolean = false;
  public submitting: boolean = false;
  private token: string;

  constructor(private route: ActivatedRoute, private resetPasswordService: ResetPasswordService) {}

  public ngOnInit(): void {
    this.route.params.subscribe((p: any) => {
      this.token = p.token;
    });
  }

  public onSubmit = ({ password, passwordConfirmation }: any) => {
    if (this.token) {
      this.submitting = true;
      this.resetPasswordService.resetPassword(
        password,
        passwordConfirmation,
        this.token,
        ({ data: { resetPassword } }: any) => {
          this.sent = true;
          this.submitting = false;

          if (resetPassword.errors) {
            return { errors: resetPassword.errors };
          }

          return resetPassword;
        }
      );
    }
  };
}

// import React from 'react';
// import PropTypes from 'prop-types';
// import Helmet from 'react-helmet';
// import { SubmissionError } from 'redux-form';
// import { PageLayout } from '../../common/components/web';
// import ResetPasswordForm from '../components/ResetPasswordForm';
//
// class ResetPasswordView extends React.Component {
//   onSubmit = resetPassword => async values => {
//     const result = await resetPassword({
//       ...values,
//       token: this.props.match.params.token
//     });
//
//     if (result.errors) {
//       let submitError = {
//         _error: 'Reset Password failed!'
//       };
//       result.errors.map(error => (submitError[error.field] = error.message));
//       throw new SubmissionError(submitError);
//     }
//   };
//
//   render() {
//     const { resetPassword } = this.props;
//
//     const renderMetaData = () => (
//       <Helmet
//         title="Reset Password"
//         meta={[
//           {
//             name: 'description',
//             content: 'Reset password page'
//           }
//         ]}
//       />
//     );
//
//     return (
//       <PageLayout>
//         {renderMetaData()}
//         <h1>Reset password!</h1>
//         <ResetPasswordForm onSubmit={this.onSubmit(resetPassword)} />
//       </PageLayout>
//     );
//   }
// }
//
// ResetPasswordView.propTypes = {
//   resetPassword: PropTypes.func.isRequired,
//   match: PropTypes.shape({
//     params: PropTypes.shape({
//       token: PropTypes.string.isRequired
//     }).isRequired
//   }).isRequired
// };
//
// export default ResetPasswordView;
