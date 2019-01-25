import bcrypt from 'bcryptjs';
import { returnId, truncateTables } from '@gqlapp/database-server-ts';
import firebase from 'firebase-admin';

import serviceAccount from '../../../../packages/server/firebase-admin-sdk-data.json';
import settings from '../../../../settings';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, [
    'user',
    'user_profile',
    'auth_certificate',
    'auth_facebook',
    'auth_github',
    'auth_linkedin'
  ]);

  await returnId(knex('user')).insert({
    username: 'admin',
    email: 'admin@example.com',
    password_hash: await bcrypt.hash('admin123', 12),
    role: 'admin',
    is_active: true
  });

  await returnId(knex('user')).insert({
    username: 'user',
    email: 'user@example.com',
    password_hash: await bcrypt.hash('user1234', 12),
    role: 'user',
    is_active: true
  });
  if (settings.user.auth.firebase.enabled) {
    if (settings.user.auth.firebase.enabled) {
      firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount)
      });
    }
    try {
      await firebase.auth().createUser({
        email: 'admin@example.com',
        emailVerified: true,
        password: 'admin123',
        displayName: 'admin',
        disabled: false
      });
    } catch (e) {
      console.log('Firebase user exsist', e);
    }
    try {
      await firebase.auth().createUser({
        email: 'user@example.com',
        emailVerified: true,
        password: 'user1234',
        displayName: 'user',
        disabled: false
      });
    } catch (e) {
      console.log('Firebase user exsist', e);
    }
  }
}
