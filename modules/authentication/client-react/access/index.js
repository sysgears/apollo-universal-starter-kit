import React from 'react';
import PropTypes from 'prop-types';

import jwt from './jwt';
import session from './session';

import AccessModule from './AccessModule';

import PageReloader from '../common/PageReloader';

const ref = React.createRef();

const resetApolloCacheAndRerenderApp = async client => {
  await client.clearStore();
  ref.current.reloadPage();
};

const login = async client => {
  await resetApolloCacheAndRerenderApp(client);
};

const logout = async client => {
  await resetApolloCacheAndRerenderApp(client);
};

const AuthPageReloader = ({ children }) => <PageReloader ref={ref}>{children}</PageReloader>;

AuthPageReloader.propTypes = {
  children: PropTypes.node
};

export { default as DataRootComponent } from './jwt/DataRootComponent';

export default new AccessModule(jwt, session, {
  dataRootComponent: [AuthPageReloader],
  login: [login],
  logout: [logout]
});
