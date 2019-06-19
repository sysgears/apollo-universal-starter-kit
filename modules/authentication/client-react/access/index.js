import React, { useState } from 'react';
import PropTypes from 'prop-types';

import jwt from './jwt';
import session from './session';

import AccessModule from './AccessModule';

let reloadPage = () => null;

const resetApolloCacheAndRerenderApp = async client => {
  await client.clearStore();
  reloadPage();
};

const login = async client => {
  await resetApolloCacheAndRerenderApp(client);
};

const logout = async client => {
  await resetApolloCacheAndRerenderApp(client);
};

const PageReloader = ({ children }) => {
  const [key, setKey] = useState(1);
  reloadPage = () => setKey(key + 1);

  return React.cloneElement(children, { key });
};

PageReloader.propTypes = {
  children: PropTypes.node
};

export default new AccessModule(jwt, session, {
  dataRootComponent: [PageReloader],
  login: [login],
  logout: [logout]
});
