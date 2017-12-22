import jwt from 'jsonwebtoken';

import AuthDAO from '../lib';

import settings from '../../../../../settings';

import { refreshToken, setTokenHeaders } from './token';

const SECRET = settings.auth.secret;
const authn = settings.auth.authentication;

/*
 * Extracts a user from the connection, looks in the order:
 *  - jwt-token
 *  - apikey
 *  - certificate
 */
const parseUser = async ({ req, connectionParams, webSocket }) => {
  if (
    connectionParams &&
    connectionParams.token &&
    connectionParams.token !== 'null' &&
    connectionParams.token !== 'undefined'
  ) {
    try {
      const { user } = jwt.verify(connectionParams.token, SECRET);
      return user;
    } catch (err) {
      const newToken = await refreshToken(connectionParams.token, connectionParams.refreshToken, SECRET);
      if (req) {
        setTokenHeaders(req, newToken);
      }
      return newToken.user;
    }
  } else if (req) {
    if (req.user) {
      return req.user;
    }
    if (authn.apikey.enabled) {
      let apikey = '';
      // in case you need to access req headers
      if (req.headers['apikey']) {
        apikey = req.headers['apikey'];
      }

      if (apikey !== '') {
        const Auth = new AuthDAO();
        const user = await Auth.getUserFromApiKey(apikey);
        if (user) {
          return user;
        }
      }
    }

    if (authn.certificate.enabled) {
      let serial = '';
      // in case you need to access req headers
      if (req.headers['x-serial']) {
        serial = req.headers['x-serial'];
      }

      if (serial !== '') {
        const Auth = new AuthDAO();
        const user = await Auth.getUserFromSerial(serial);
        if (user) {
          return user;
        }
      }
    }
  } else if (webSocket) {
    if (authn.apikey.enabled) {
      let apikey = '';
      // in case you need to access req headers
      if (webSocket.upgradeReq.headers['apikey']) {
        apikey = webSocket.upgradeReq.headers['apikey'];
      }

      if (apikey !== '') {
        const Auth = new AuthDAO();
        const user = await Auth.getUserFromApiKey(apikey);
        if (user) {
          return user;
        }
      }
    } else if (authn.certificate.enabled) {
      let serial = '';
      // in case you need to access req headers
      if (webSocket.upgradeReq.headers['x-serial']) {
        serial = webSocket.upgradeReq.headers['x-serial'];
      }

      if (serial !== '') {
        const Auth = new AuthDAO();
        const user = await Auth.getUserFromSerial(serial);
        if (user) {
          return user;
        }
      }
    }
  }
};

export default parseUser;
