import firebase from 'firebase-admin';
// import { FieldError } from '@module/validation-common-react';

// import access from '../../access';
// import User from '../../sql';
// import settings from '../../../../../settings';

export default () => ({
  Mutation: {
    async login(
      obj,
      {
        input: { usernameOrEmail }
      }
    ) {
      try {
        const user = await firebase.auth().getUserByEmail(usernameOrEmail);
        // await validateUserPassword(user, password, req.t);
        // const tokens = await firebase.auth().currentUser;
        console.log('1111111111111111111111111111111', user);
        // console.log('222222222222222222222222222222', tokens);
        // return { user };
      } catch (e) {
        // return { errors: e };
      }
    }
  }
});
