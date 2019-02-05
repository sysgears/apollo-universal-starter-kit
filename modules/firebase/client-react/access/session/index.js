import firebase from 'firebase/app';
import 'firebase/auth';
import AccessModule from '../AccessModule';
import settings from '../../../../../settings';

import LOGOUT from './graphql/Logout.graphql';

const logout = client => {
  firebase.auth().signOut();
  return client.mutate({ mutation: LOGOUT });
};

export default (settings.firebase.session.enabled
  ? new AccessModule({
      logout: [logout]
    })
  : undefined);
