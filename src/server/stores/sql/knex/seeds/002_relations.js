import _ from 'lodash';
import settings from '../../../../../../settings';

import orgs from '../../../seeds/data/entities/orgs';
import groups from '../../../seeds/data/entities/groups';

let config = settings.entities;

export async function seed(knex) {
  if (config.orgs.enabled === true) {
    await createOrgsRels(knex, orgs);
    return;
  }

  if (config.groups.enabled === true) {
    let shorts = ['owners', 'admins', 'subscribers', 'users'];
    await createGroupsRels(knex, shorts);
  }
}

async function createOrgsRels(knex, orgs) {
  for (let org of orgs) {
    if (org.name === 'root') {
      continue;
    }
    console.log('Creating Relations for org:', org.name);

    // create org -> group -> user / service account relationshiprs
    await createOrgGroupRels(knex, org, _.map(org.groups, g => g.name));

    await createOrgUserRels(knex, org, _.map(org.users, u => u.name));
    await createOrgGroupUserRels(knex, org);

    if (config.serviceaccounts.enabled) {
      await createOrgServiceAccountRels(knex, org, _.map(org.serviceaccounts, s => s.name));
      await createOrgGroupServiceAccountRels(knex, org);
    }
  }
}

async function createOrgGroupRels(knex, org, groupShorts) {
  const [oid] = await knex
    .select('id')
    .from('orgs')
    .where('name', '=', org.name);

  for (let short of groupShorts) {
    console.log(' - org-group: ', org.name, short);
    const [gid] = await knex
      .select('id')
      .from('groups')
      .where('name', '=', org.name + ':' + short);

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
    console.log(' - org-user: ', org.name, short);
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
    console.log(' - org-sa: ', org.name, short);
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

async function createOrgGroupUserRels(knex, org) {
  for (let G of org.groups) {
    const [gid] = await knex
      .select('id')
      .from('groups')
      .where('name', '=', org.name + ':' + G.name);

    for (let R of G.roles) {
      if (R.users) {
        for (let short of R.users) {
          console.log(' - org-group-user: ', org.name, short);
          const [uid] = await knex
            .select('id')
            .from('users')
            .where('email', '=', short + '@' + org.profile.domain);

          await knex('groups_users').insert({
            group_id: gid.id,
            user_id: uid.id
          });
        }
      }
    } // end loop over group-roles
  } // end loop over groups
}

async function createOrgGroupServiceAccountRels(knex, org) {
  for (let G of org.groups) {
    const [gid] = await knex
      .select('id')
      .from('groups')
      .where('name', '=', org.name + ':' + G.name);

    for (let R of G.roles) {
      if (R.serviceaccounts) {
        for (let short of R.serviceaccounts) {
          console.log(' - org-group-sa: ', org.name, short);
          const [sid] = await knex
            .select('id')
            .from('serviceaccounts')
            .where('email', '=', short + '@' + org.profile.domain);

          await knex('groups_serviceaccounts').insert({
            group_id: gid.id,
            serviceaccount_id: sid.id
          });
        }
      }
    } // end loop over group-roles
  } // end loop over groups
}

async function createGroupsRels(knex, shorts) {
  for (let short of shorts) {
    console.log('creating groupRels', short);
    let G = _.find(groups, g => {
      return g.name === short;
    });
    console.log(G);
    const [gid] = await knex
      .select('id')
      .from('groups')
      .where('name', '=', G.name);

    console.log('gid', gid);

    if (G.users) {
      for (let short of G.users) {
        const [uid] = await knex
          .select('id')
          .from('users')
          .where('email', '=', short + '@' + 'example.com');

        console.log('uid', uid);
        await knex('groups_users').insert({
          group_id: gid.id,
          user_id: uid.id
        });
      }
    }

    if (config.serviceaccounts.enabled == true && G.serviceaccounts) {
      for (let short of G.serviceaccounts) {
        const [sid] = await knex
          .select('id')
          .from('serviceaccounts')
          .where('email', '=', short + '@' + 'example.com');

        await knex('groups_serviceaccounts').insert({
          group_id: gid.id,
          serviceaccount_id: sid.id
        });
      }
    }
  } // end loop over groups
}
