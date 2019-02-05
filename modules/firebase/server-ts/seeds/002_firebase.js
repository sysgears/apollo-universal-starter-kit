import firebase from 'firebase-admin';

import settings from '../../../../settings';

export async function seed() {
  if (!settings.firebase.config.admin.private_key) return;
  const firebaseApp = firebase.initializeApp(
    {
      credential: firebase.credential.cert(settings.firebase.config.admin),
      databaseURL: process.env.DB_FIREBASE
    },
    'seed'
  );
  firebaseApp.firestore().settings({ timestampsInSnapshots: true });
  try {
    const { uid, passwordHash } = await firebaseApp.auth().createUser({
      email: 'admin@example.com',
      emailVerified: true,
      password: 'admin123',
      displayName: 'admin',
      disabled: false
    });
    await firebaseApp
      .firestore()
      .collection('users')
      .doc(uid)
      .set({
        id: uid,
        email: 'admin@example.com',
        isActive: true,
        password: passwordHash,
        username: 'admin',
        role: 'admin'
      });
  } catch (e) {
    console.log('Firebase user exsist', e);
  }
  try {
    const { uid, passwordHash } = await firebaseApp.auth().createUser({
      email: 'user@example.com',
      emailVerified: true,
      password: 'user1234',
      displayName: 'user',
      disabled: false
    });
    await firebaseApp
      .firestore()
      .collection('users')
      .doc(uid)
      .set({
        id: uid,
        email: 'user@example.com',
        isActive: true,
        password: passwordHash,
        username: 'user',
        role: 'user'
      });
  } catch (e) {
    console.log('Firebase user exsist', e);
  }
}
