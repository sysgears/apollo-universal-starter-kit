/* eslint-disable no-unused-vars */
import { validateScope } from './validate';

import { ContextError, AuthorizationError } from './errors';

import settings from '../../../settings';

const authz = settings.auth.authorization;

export const authSwitch = scopingList => {
  const localScopings = scopingList;

  return async function(_, __, context, info) {
    // check for the auth object on the context
    if (!context.auth) return new ContextError();
    if (!context.auth.isAuthenticated) return new AuthorizationError('Not Authenticated!');

    // loop ever scoping elements
    let pass = false;
    for (let scoping of localScopings) {
      /// some local vars
      let localRequiredScopes = scoping.requiredScopes;
      let localPresentedScopes = scoping.presentedScopes;
      let localCallback = scoping.callback;

      // We've already passed validation, now the work is being passed down the line
      if (pass === 'next') {
        // hot potato
        if (localCallback === 'next') {
          continue;
        }

        // finally, drop into a callback and do some authenticated work
        // seems out of place considering all the checking happens next
        // see below for the initiation of this section of code
        return localCallback(_, __, context, info);
      }

      // check for custom scope validation (i.e. scopes is a function to determine requred Scopes)
      if (localRequiredScopes && typeof localRequiredScopes === 'function') {
        // user the required Scope callback
        localRequiredScopes = await Promise.resolve().then(() => localRequiredScopes(_, __, context, info));
      }
      if (localPresentedScopes && typeof localRequiredScopes === 'function') {
        // user the required Scope callback
        localPresentedScopes = await Promise.resolve().then(() => localPresentedScopes(_, __, context, info));
      }

      // Check that there are requirements, but no scope presented
      const presentedScopes = localPresentedScopes ? localPresentedScopes(_, __, context, info) : context.auth.scope;
      if (localRequiredScopes && localRequiredScopes.length && !presentedScopes) {
        return new AuthorizationError();
      }

      // Now check validate the presented scopes against the required scopes
      //   returns false or a string. string can be deny, skip, or the successful scope matching
      pass = validateScope(localRequiredScopes, presentedScopes);
      if (pass) {
        // Stop immediately and return bad news
        if (pass === 'deny') {
          return false;
        }

        // Do nothing and let the pipeline continue
        if (pass === 'skip') {
          pass = false;
          continue;
        }

        // We've passed go, now lets collect 200BTC
        context.auth.validation = pass;

        // leave it for the next guy
        if (localCallback === 'next') {
          pass = 'next';
          continue;
        }

        // or call our callback
        return localCallback(_, __, context, info);
      } // else, pass was false, which is the default, and we look at the next scoping
    } // End scoping loop

    // Otherwise, none of the mappings passed, so return authz error
    return new AuthorizationError();
  };
};

export default authSwitch;
