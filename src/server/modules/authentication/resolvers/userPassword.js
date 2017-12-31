// import { authSwitch } from '../../../../common/auth/server';
// import FieldError from '../../../../common/FieldError';

import { setTokenHeaders } from '../flow/token';
import { passwordRegister, passwordLogin, sendPasswordResetEmail, passwordReset } from '../flow/password';
import { sendConfirmAccountEmail } from '../flow/confirm';

import settings from '../../../../../settings';

const authn = settings.auth.authentication;

/*eslint-disable no-unused-vars*/

export default function addResolvers(obj) {
  obj = addMutations(obj);

  return obj;
}

function addMutations(obj) {
  obj.Mutation.register = async function(obj, { input }, context) {
    try {
      let tokens = null;
      let user = await passwordRegister(input);

      if (authn.password.confirm) {
        if (context.mailer && authn.password.sendConfirmationEmail) {
          // async email sending
          sendConfirmAccountEmail(context.mailer, user);
        } else {
          console.log('Ugh Oh');
        }
      } else {
        console.log('Not Requiring Confirmation');
        tokens = await passwordLogin(input);
        if (context.req) {
          setTokenHeaders(context.req, tokens);
        }
      }

      return { user, tokens, errors: null };
    } catch (e) {
      return { user: null, tokens: null, errors: e };
    }
  };

  obj.Mutation.login = async function(obj, { input }, context) {
    console.log('Authn.login', input);
    try {
      const tokens = await passwordLogin(input);
      console.log('Authn.login - tokens', tokens);
      if (context.req) {
        setTokenHeaders(context.req, tokens);
      }
      return { tokens, errors: null };
    } catch (e) {
      return { tokens: null, errors: e };
    }
  };

  obj.Mutation.registerPassword = async function(obj, { input }, context) {
    try {
      let tokens = null;
      let user = await passwordRegister(input);

      if (authn.password.confirm) {
        console.log('Requiring Confirmation');
        if (context.mailer && authn.password.sendConfirmationEmail) {
          // async email sending
          sendConfirmAccountEmail(context.mailer, user);
        } else {
          console.log('Ugh Oh');
        }
      } else {
        console.log('Not Requiring Confirmation');
        tokens = await passwordLogin(input);
        if (context.req) {
          setTokenHeaders(context.req, tokens);
        }
      }

      return { user, tokens, errors: null };
    } catch (e) {
      return { user: null, tokens: null, errors: e };
    }
  };

  obj.Mutation.loginPassword = async function(obj, { input }, context) {
    try {
      const tokens = await passwordLogin(input);
      if (context.req) {
        setTokenHeaders(context.req, tokens);
      }
      return { tokens, errors: null };
    } catch (e) {
      return { tokens: null, errors: e };
    }
  };

  obj.Mutation.forgotPassword = async function(obj, args, context) {
    const { input } = args;
    try {
      if (context.mailer) {
        await sendPasswordResetEmail(context.mailer, input);
      }
      return true;
    } catch (e) {
      console.log('error', e);
      // always return true so you can't discover users this way
      return true;
    }
  };

  obj.Mutation.resetPassword = async function(obj, { input }, context) {
    try {
      await passwordReset(input);
      return { errors: null };
    } catch (e) {
      return { errors: e };
    }
  };

  return obj;
}
