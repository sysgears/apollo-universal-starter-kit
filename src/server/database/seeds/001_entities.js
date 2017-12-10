import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import bcrypt from 'bcryptjs';
import truncateTables from '../../../common/db';
import settings from '../../../../settings';

import orgs from './data/entities/orgs';
import groups from './data/entities/groups';
import users from './data/entities/users';
import sa from './data/entities/sa';

let entitiesConfig = settings.entities;

export async function seed(knex, Promise) {
  // this should empty the other tables from cascading deletes
  await truncateTables(knex, Promise, ['serviceaccounts', 'users', 'groups', 'orgs']);

  if (entitiesConfig.orgs.enabled === true) {
    let createRels = true;
    await createOrgs(knex, orgs, createRels);
  }
}

async function createOrgs(knex, orgs, createRels) {
  for (let org of orgs) {
    console.log('Creating org:', org.name);

    // create org
    const [oid] = await knex('orgs')
      .returning('id')
      .insert({
        uuid: uuidv4(),
        name: org.name,
        is_active: true
      });

    org.id = oid;

    // create org profile
    if (org.profile !== null) {
      await knex('org_profile').insert({
        org_id: oid,
        domain: org.domain,
        display_name: org.profile.displayName,
        description: org.profile.description
      });
    }

    // create org groups
    await createGroups(knex, org.groups, org.name);

    // create org users
    await createUsers(knex, org.users, org.profile.domain);

    // create org service accounts
    await createServiceAccounts(knex, org.serviceaccounts, org.profile.domain);

    // create org -> group -> user / service account relationshiprs
    if (createRels) {
      await createOrgGroupRels(knex, org, org.groups);
      await createOrgUserRels(knex, org, org.users);
      await createOrgServiceAccountRels(knex, org, org.serviceaccounts);
    }
  }
}

async function createGroups(knex, shorts, namePrefix) {
  console.log('Creating groups with prefix:', namePrefix);
  for (let group of shorts) {
    // get the seed object by name
    let groupSeed = _.find(groups, g => {
      return g.name === group;
    });

    // save group
    const [gid] = await knex('groups')
      .returning('id')
      .insert({
        uuid: uuidv4(),
        name: (namePrefix ? namePrefix + ':' : '') + groupSeed.name,
        is_active: true
      });

    // save group profile
    if (groupSeed.profile !== null) {
      await knex('group_profile').insert({
        group_id: gid,
        display_name: groupSeed.profile.displayName,
        description: groupSeed.profile.description
      });
    }
  }
}

async function createUsers(knex, shorts, domain) {
  console.log('Creating users for domain:', domain);
  for (let user of shorts) {
    // get the actual seed object by short
    let userSeed = _.find(users, u => {
      return u.short == user;
    });

    // save user
    const [uid] = await knex('users')
      .returning('id')
      .insert({
        uuid: uuidv4(),
        email: userSeed.short + '@' + domain,
        is_active: true
      });

    // save user password
    await knex('user_password').insert({
      user_id: uid,
      password: await bcrypt.hash(userSeed.password, 12)
    });

    // save user profile
    if (userSeed.profile !== null) {
      await knex('user_profile').insert({
        user_id: uid,
        display_name: userSeed.profile.displayName,
        first_name: userSeed.profile.firstName,
        middle_name: userSeed.profile.middleName,
        last_name: userSeed.profile.lastName,
        suffix: userSeed.profile.suffix,
        locale: userSeed.profile.locale,
        language: userSeed.profile.language
      });
    }
  }
}

async function createServiceAccounts(knex, shorts, domain) {
  console.log('Creating service accounts for domain:', domain);
  for (let acct of shorts) {
    // get the actual seed object by short
    let acctSeed = _.find(sa, a => {
      return a.short == acct;
    });

    // save service account
    const [aid] = await knex('serviceaccounts')
      .returning('id')
      .insert({
        uuid: uuidv4(),
        email: acctSeed.short + '@' + domain,
        is_active: true
      });

    // save sa serial
    await knex('serviceaccount_certificates').insert({
      serviceaccount_id: aid,
      serial: acctSeed.serial + ':' + domain
    });

    // save sa profile
    if (acctSeed.profile !== null) {
      await knex('serviceaccount_profile').insert({
        serviceaccount_id: aid,
        display_name: acctSeed.profile.displayName,
        description: acctSeed.profile.description
      });
    }
  }
}

async function createOrgGroupRels(knex, org, groupShorts) {
  const [oid] = await knex
    .select('id')
    .from('orgs')
    .where('name', '=', org.name);

  for (let short of groupShorts) {
    const [gid] = await knex
      .select('id')
      .from('groups')
      .where('name', '=', org.name + ':' + short);

    console.log('O-G:', oid.id, gid.id, org.name + ':' + short);
    await knex('orgs_groups').insert({
      org_id: oid.id,
      group_id: gid.id
    });
  }
}

async function createOrgUserRels(knex, org, userShorts) {
  const [oid] = await knex
    .select('id')
    .from('orgs')
    .where('name', '=', org.name);

  for (let short of userShorts) {
    const [uid] = await knex
      .select('id')
      .from('users')
      .where('email', '=', short + '@' + org.profile.domain);

    await knex('orgs_users').insert({
      org_id: oid.id,
      user_id: uid.id
    });
  }
}

async function createOrgServiceAccountRels(knex, org, acctShorts) {
  const [oid] = await knex
    .select('id')
    .from('orgs')
    .where('name', '=', org.name);

  for (let short of acctShorts) {
    const [sid] = await knex
      .select('id')
      .from('serviceaccounts')
      .where('email', '=', short + '@' + org.profile.domain);

    await knex('orgs_serviceaccounts').insert({
      org_id: oid.id,
      serviceaccount_id: sid.id
    });
  }
}
