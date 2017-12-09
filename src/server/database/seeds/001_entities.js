import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import bcrypt from 'bcryptjs';
import truncateTables from '../../../common/db';
import settings from '../../../../settings';

let entitiesConfig = settings.entities;
export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['serviceaccounts', 'users', 'groups', 'orgs']);

  if (entitiesConfig.orgs.enabled === true) {
    for (let org of entitiesConfig.orgs.seeds) {
      console.log('ORG', org);
      // create org
      const [oid] = await knex('orgs')
        .returning('id')
        .insert({
          uuid: uuidv4(),
          name: org.name,
          domain: org.domain,
          is_active: true
        });

      // map over org groups
      for (let group of org.groups) {
        let groupSeed = _.find(entitiesConfig.groups.seeds, g => {
          return g.name === group.name;
        });
        console.log('GROUP', group, groupSeed);

        // save group
        const [gid] = await knex('groups')
          .returning('id')
          .insert({
            uuid: uuidv4(),
            name: groupSeed.name,
            is_active: true
          });

        // create org-group membership
        await knex('orgs_groups').insert({
          org_id: oid,
          group_id: gid
        });

        // create users
        for (let user of groupSeed.users) {
          let userSeed = _.find(entitiesConfig.users.seeds, u => {
            return u.email == user;
          });
          console.log('USER', user, userSeed);

          // rewrite domain name in email
          let parts = userSeed.email.split('@');
          let email = parts[0] + '@' + org.domain;

          // save user
          const [uid] = await knex('users')
            .returning('id')
            .insert({
              uuid: uuidv4(),
              email: email,
              is_active: true
            });

          // save user password
          await knex('user_password').insert({
            user_id: uid,
            password: await bcrypt.hash(userSeed.password, 12)
          });

          // save group-user membership
          await knex('groups_users').insert({
            group_id: gid,
            user_id: uid
          });
        }
      }
    }
  }
}
