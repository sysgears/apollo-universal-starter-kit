import { Component } from '@angular/core';
import LoginService from '../containers/Login';

import { Router } from '@angular/router';

@Component({
  selector: 'login-view',
  template: `
    <div id="content" class="container">
      <h1>Login page!</h1>
      <login-form [onSubmit]="onSubmit"></login-form>
      <a routerLink="/forgot-password">Forgot your password?</a>
      <hr/>
      <div class="card">
        <div class="card-block">
          <h4 class="card-title">Available logins:</h4>
          <p class="card-text">admin@example.com:admin</p>
          <p class="card-text">user@example.com:user</p>
        </div>
      </div>
    </div>
  `
})
export default class LoginView {
  constructor(private loginService: LoginService, private router: Router) {}

  public onSubmit = (loginInputs: any) => {
    this.loginService.login(loginInputs.email, loginInputs.password, ({ data: { login } }: any) => {
      if (login.errors) {
        return { errors: login.errors };
      }

      const { token, refreshToken } = login.tokens;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      this.router.navigateByUrl('profile');
      this.loginService.loginEvent();
    });
  };
}

// // Web only component
//
// // React
// import React from "react";
// import PropTypes from "prop-types";
// import Helmet from "react-helmet";
// import { Card, CardBlock, CardTitle, CardText } from "reactstrap";
//
// import PageLayout from "../../../app/PageLayout";
// import LoginForm from "../components/LoginForm";
//
// class LoginView extends React.PureComponent {
//   state = {
//     errors: []
//   };
//
//   onSubmit = login => async values => {
//     const result = await login(values);
//
//     if (result.errors) {
//       this.setState({ errors: result.errors });
//     }
//   };
//
//   render() {
//     const { login } = this.props;
//
//     const renderMetaData = () => (
//       <Helmet
//         title="Login"
//         meta={[
//           {
//             name: "description",
//             content: "Login page"
//           }
//         ]}
//       />
//     );
//
//     return (
//       <PageLayout>
//         {renderMetaData()}
//         <h1>Login page!</h1>
//         <LoginForm onSubmit={this.onSubmit(login)} errors={this.state.errors} />
//         <hr />
//         <Card>
//           <CardBlock>
//             <CardTitle>Available logins:</CardTitle>
//             <CardText>admin@example.com:admin</CardText>
//             <CardText>user@example.com:user</CardText>
//           </CardBlock>
//         </Card>
//       </PageLayout>
//     );
//   }
// }
//
// LoginView.propTypes = {
//   login: PropTypes.func.isRequired,
//   error: PropTypes.string
// };
//
// export default LoginView;
