/* eslint-disable no-unused-vars */
import decode from 'jwt-decode';

import settings from '../../settings';

const authz = settings.auth.authorization;

/*
 * taken from 'graphql-auth' so that the front and back ends can use the same authorization semantics
 */

export class ContextError extends Error {
  constructor(message = '`auth` property not found on context!') {
    super(message);
    this.message = message;
    this.name = 'ContextError';
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'Permission Denied!') {
    super(message);
    this.message = message;
    this.name = 'AuthorizationError';
  }
}

export function validateScope(required, provided) {
  // console.log("validateScope:", required, provided)
  return validateScope_v1(required, provided);
}

function validateScope_v1(required, provided) {
  if (!provided) {
    return false;
  }

  for (let perm of provided) {
    let permReStr = '^' + perm.replace('*', '.*') + '$';
    var permRe = new RegExp(permReStr);
    for (let scope of required) {
      // user:* -> user:create, user:view:self
      if (permRe.exec(scope)) {
        return `${perm} >> ${scope} (${permReStr})`;
      }
    }
  }

  return false;
}

function validateScope_v2(required, provided) {
  let hasScope = false;

  required.forEach(scope => {
    provided.forEach(function(perm) {
      // user:* -> user:create, user:view:self
      var permRe = new RegExp('^' + perm.replace('*', '.*') + '$');
      if (permRe.exec(scope)) hasScope = true;
    });
  });

  return hasScope;
}

export const withAuth = (scope, callback) => {
  const next = callback ? callback : scope;
  let requiredScope = callback ? scope : null;

  return async function(_, __, context, info) {
    if (!context.auth) return new ContextError();
    if (!context.auth.isAuthenticated) return new AuthorizationError('Not Authenticated!');

    if (requiredScope && typeof requiredScope === 'function')
      requiredScope = await Promise.resolve().then(() => requiredScope(_, __, context, info));

    if (
      (requiredScope && requiredScope.length && !context.auth.scope) ||
      (requiredScope && requiredScope.length && !validateScope(requiredScope, context.auth.scope))
    ) {
      return new AuthorizationError();
    }

    return next(_, __, context, info);
  };
};

// Client Side Authorization check
export const checkAuth = (cookies, requiredScopes, context, params) => {
  // console.log("CHECK AUTH:", requiredScopes, context, params)
  // first check token
  let token = null;
  let refreshToken = null;

  // one or both of these is returning the string 'undefined' when there are no tokens... >:[
  if (cookies && cookies.get('r-token')) {
    token = cookies.get('r-token');
    refreshToken = cookies.get('r-refresh-token');
  }
  if (__CLIENT__ && window.localStorage.getItem('token')) {
    token = window.localStorage.getItem('token');
    refreshToken = window.localStorage.getItem('refreshToken');
  }

  // If we have no token, return false
  const noAuth =
    !token ||
    !refreshToken ||
    token === null ||
    refreshToken === null ||
    token === undefined ||
    refreshToken === undefined ||
    token === 'undefined' ||
    refreshToken === 'undefined';

  // No Auth
  if (noAuth) {
    return false;
  }

  // So we have a token for auth
  // Unrestricted Content ?
  const isUnrestricted = !requiredScopes || requiredScopes.length === 0;
  if (isUnrestricted) {
    // console.log("unrestricted")
    return true;
  }

  // Otherwise, Restricted Content
  // decode token, grab scopes, and compare to required
  try {
    const { exp } = decode(refreshToken);

    if (exp < new Date().getTime() / 1000) {
      return false;
    }
    const { user: { id, email, roles } } = decode(token);

    // console.log('decoded:', roles, email, id);
    if (!roles) {
      return validateScope(requiredScopes, null);
    }

    for (let role of roles.userRoles) {
      // console.log("checking", role)
      let can = validateScope(requiredScopes, role.scopes);
      // console.log("  can?", can)
      if (can) {
        // console.log("Can with role:", role)
        return true;
      }
    }

    const yesTheyCan2 = validateScope(requiredScopes, roles.groupScopes);
    const yesTheyCan3 = validateScope(requiredScopes, roles.orgScopes);
    return yesTheyCan2 || yesTheyCan3;
  } catch (e) {
    console.log(e);
    return false;
  }
};
