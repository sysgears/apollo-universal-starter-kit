import { removeTokenHeaders, refreshToken as refreshTokenFunc } from '../flow/token';

export default function addResolvers(obj) {
  obj = addMutations(obj);

  return obj;
}

function addMutations(obj) {
  obj.Mutation.logout = async function(obj, args, context) {
    if (context.req) {
      removeTokenHeaders(context.req);
    }

    return true;
  };

  obj.Mutation.refreshToken = async function(obj, { token, refreshToken }, context) {
    try {
      const tokens = await refreshTokenFunc(token, refreshToken, context.SECRET);
      return { tokens, errors: null };
    } catch (e) {
      return { tokens: null, errors: e };
    }
  };

  return obj;
}
