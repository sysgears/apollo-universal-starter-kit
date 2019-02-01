import firebase, { auth, firestore } from 'firebase-admin';

import { admin } from '../../../../config/firebase';

export async function seed() {
  firebase.initializeApp({
    credential: firebase.credential.cert(admin),
    databaseURL: process.env.DB_FIREBASE
  });
  firestore().settings({ timestampsInSnapshots: true });
  try {
    const { uid, passwordHash } = await auth().createUser({
      email: 'admin@example.com',
      emailVerified: true,
      password: 'admin123',
      displayName: 'admin',
      disabled: false
    });
    await firestore()
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
    const { uid, passwordHash } = await auth().createUser({
      email: 'user@example.com',
      emailVerified: true,
      password: 'user1234',
      displayName: 'user',
      disabled: false
    });
    await firestore()
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
