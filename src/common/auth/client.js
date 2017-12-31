/* eslint-disable no-unused-vars */
import decode from 'jwt-decode';

import { validateScope } from './validate';

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

export function dummy() {
  console.log('not sure why eslint is being a pain with this one file and default exports');
}
