import React from 'react';
import PropTypes from 'prop-types';
import { withApollo, graphql } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { withCookies, Cookies } from 'react-cookie';

import { Link } from 'react-router-dom';
import { NavItem } from 'reactstrap';

import CURRENT_USER from '../graphql/current_user.graphql';

const logoutHelper = (cookies) => {
  cookies.remove('x-token');
  cookies.remove('x-refresh-token');
  window.localStorage.setItem('token', null);
  window.localStorage.setItem('refreshToken', null);
};

class AuthNav extends React.Component {

  constructor(props) {
    super(props);
  }

  logout = async () => {
    const { cookies } = this.props;

    await logoutHelper(cookies);

    this.props.client.resetStore();

    //this.props.data.refetch();
  };

  render() {
    const { currentUser } = this.props.data;

    if (currentUser) {
      return (
        <NavItem onClick={this.logout}><Link to="/">Logout</Link></NavItem>
      );
    } else {
      return (
          <NavItem><Link to="/login">Login</Link></NavItem>
      );
    }
  }
}

AuthNav.propTypes = {
  client: PropTypes.instanceOf(ApolloClient),
  cookies: PropTypes.instanceOf(Cookies),
  data: PropTypes.object,
};

export default withApollo(withCookies(graphql(CURRENT_USER, {
  options: { fetchPolicy: 'network-only' },
  //props: ({ data: { loading, currentUser } }) => ({
  //  loading, currentUser,
  //}),
})(AuthNav)));