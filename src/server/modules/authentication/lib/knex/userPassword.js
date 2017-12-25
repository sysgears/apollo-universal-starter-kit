/*eslint-disable no-unused-vars*/
import bcrypt from 'bcryptjs';
import { camelizeKeys } from 'humps';
import uuidv4 from 'uuid';
import _ from 'lodash';

import settings from '../../../../../../settings';
import log from '../../../../../common/log';

import knex from '../../../../stores/sql/knex/client';
import { orderedFor } from '../../../../stores/sql/knex/helpers/batching';

import User from '../../../user/lib';

import { createPassword } from './userBase';

const entities = settings.entities;
const authn = settings.auth.authentication;
const authz = settings.auth.authorization;
const staticUserScopes = authz.userScopes;
const staticGroupScopes = authz.groupScopes;
const staticOrgScopes = authz.orgScopes;

export async function registerNewUser(newUser) {
  try {
    let user = null;

    // Use a transaction during registration
    knex.transaction(trx => {
      // Finally wait on the transaction to complete, potentially rolling back
      registerUser(newUser)
        .then(createdUser => {
          user = createdUser;
        })
        .then(trx.commit)
        .catch(trx.rollback);
    });

    return user;
  } catch (e) {
    log.error('Error in Auth.registerNewUser', e);
    throw e;
  }
}

export async function registerUser(newUser, trx) {
  try {
    const id = await User.create(
      {
        email: newUser.email,
        isActive: newUser.isActive
      },
      trx
    );

    if (newUser.profile) {
      await User.createProfile(id, newUser.profile, trx);
    }

    await createPassword(id, newUser.password, trx);

    // TODO set role, based on method enabled
    // let ret = await createUserRole(id, 'user');

    const user = await User.get(id, trx);

    return user;
  } catch (e) {
    log.error('Error in Auth.searchUserByEmail', e);
    throw e;
  }
}

export async function searchUserByEmail(email, trx) {
  try {
    let builder = knex
      .select('u.id', 'u.is_active', 'u.email')
      .from('users AS u')
      .whereIn('u.email', email)
      .first();

    if (trx) {
      builder.transacting(trx);
    }

    let row = await builder;

    return camelizeKeys(row);
  } catch (e) {
    log.error('Error in Auth.searchUserByEmail', e);
    throw e;
  }
}

export async function getUserPasswordFromEmail(email, trx) {
  try {
    console.log('Auth.getUserPasswordFromEmail', email);
    let builder = knex
      .select('u.id', 'u.is_active', 'u.email', 'a.password')
      .from('users AS u')
      .whereIn('u.email', email)
      .leftJoin('user_password AS a', 'a.user_id', 'u.id')
      .first();

    if (trx) {
      console.log('transacting!');
      builder.transacting(trx);
    }

    let row = await builder;

    let ret = camelizeKeys(row);
    return ret;
  } catch (e) {
    log.error('Error in Auth.getUserPasswordFromEmail', e);
    throw e;
  }
}
