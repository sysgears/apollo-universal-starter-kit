import React from 'react';
import PropTypes from 'prop-types';

import settings from '@gqlapp/config';

import jwt from './jwt';
import session from './session';

import AccessModule from './AccessModule';

import PageReloader from '../common/PageReloader';
import DataRootComponentJWT from './jwt/DataRootComponent';
import DataRootComponentSession from './session/DataRootComponent';

const DataRootComponent = settings.auth.session.enabled ? DataRootComponentSession : DataRootComponentJWT;

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

export { DataRootComponent };

export default new AccessModule(jwt, session, {
  dataRootComponent: [AuthPageReloader],
  login: [login],
  logout: [logout]
});
