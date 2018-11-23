# Resolvers

- How to write
- Best practices


----


### Batching

You can use either DataLoader, `graphql-resolve-batch` (GRB), or intermix the two.



#### Reconciling batches with `graphql-resolve-batch`

The following is based off of experiences using the library
in the auth-upgrades branch, particularly around org/group membership and the roles/permissions/grants relations (1-1, 1-N, N-N)

GRB has some particulars to it.
The library introspects the query to batch
requests to the same resolver.
It provides you with an array of sources
and expects an array of results returned,
which is of the same length and order.

Now, two things can happen.

1) It will present you with the same ID multiple times, and you need to fill in the results multiple times.
2) If one of the sources doesn't have data returned, you need to fill in a placeholer (null, [], something, anything really...)

So this can make things a little complicated when making queries and filling resolver results.
An example of (1) will happen if you ask for the users for multiple groups, and ask for their profile.
If a user is in multiple groups, their ID will be presented multiple times, for each group they are in.
You will only get one result from the database, so you must repeat the profile data each time it appears in the source.
(2) will happen in this case if a user doesn't have a profile.

There are three helpers provided to assist
specifically with `graphql-resolve-batch`.
They are in `src/server/sql/batch.js`.

- reconcileBatchOneToOne( sources, results, matchField )
- reconcileBatchOneToMany( sources, results, matchField )
- reconcileBatchManyToMany( sources, matches, results, sourcesField, resultsField )

##### reconcileBatchOneToOne( sources, results, matchField )

Let's say we have User and UserProfile objects.
They are separate tables in the database with a one-to-one
relationship. `user_id` is a foreign key in the `user_profile` table.

```
  async getProfileMany(ids, trx) {
    try {
      let builder = knex
        .select('*')
        .from('user_profile')
        .whereIn('user_id', ids);

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in User.getProfileMany', e);
      throw e;
    }
  }
```

This returns one profile for each user that has a profile.
It is a single dimension array of objects. (`[{user_profile},...]`)

This is how we use the `reconcileBatchOneToOne` in a User.profile resolver.

```
import { createBatchResolver } from 'graphql-resolve-batch';
import { reconcileBatchOneToOne } from '../../sql/batch';

export default pubsub => ({

  ...

  User: {
    profile: createBatchResolver(async (source, args, context) => {
      // Get unique set of Ids
      let ids = _.uniq(source.map(s => s.userId));

      // Get profiles from database
      const profiles = await context.User.getProfileMany(ids);

      // match and map the results to the sources, fill in empty spots when needed
      const ret = reconcileBatchOneToOne(source, profiles, 'userId');
      return ret;
    })
  }

  ...

})
```

##### reconcileBatchOneToMany( sources, results, matchField )

Let's new say our users can have multiple apikeys.

```
function getApiKeysForUsers(ids, trx) {
  try {
    let builder = knex
      .select('*')
      .from('user_apikeys')
      .whereIn('user_id', ids);

    if (trx) {
      builder.transacting(trx);
    }

    let rows = await builder;

    let ret = _.filter(rows, row => row.name !== null);
    ret = camelizeKeys(ret);
    ret = orderedFor(ret, ids, 'userId', false);  // <--- orderedFor to gather apikeys per users
    return ret
  } catch (e) {
    log.error('Error in Authn.UserApikey.getApiKeysForUsers', e);
    throw e;
  }
}
```

Notice the use of `orederedFor` helper, to order the apikeys for the user.

This returns an array of apikeys for each user that has a profile.
It is a single dimension array of objects. (`[[{user_apikey},...],...]`)

```
  ...

  User: {
    apikeys: createBatchResolver(async (source, args, context) => {
      // get unique id list
      let ids = _.uniq(source.map(s => s.userId));

      // get apikeys per user
      const apikeys = await context.Auth.getApiKeysForUsers(ids);

      // match and map the results to the sources
      const ret = reconcileBatchOneToMany(source, apikeys, 'userId');
      return ret;
    }),
  ...
```


##### reconcileBatchManyToMany( sources, matches, results, sourcesField, resultsField )

Let's say we have users and groups, and that users can belong to more than one group.
There is a table for `users`, `groups`, and `groups_users` which has two ids for columns
and holds the many-to-many relationship data.

```
  async getGroupIdsForUserIds(ids, trx) {
    try {
      let builder = knex
        .select('*')
        .from('groups_users')
        .whereIn('user_id', ids);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let ret = _.filter(rows, row => row.groupId !== null);
      ret = camelizeKeys(ret);
      ret = orderedFor(ret, ids, 'userId', false);
      return ret;
    } catch (e) {
      log.error('Error in User.getGroupsIdsForUserId', e);
      throw e;
    }
  }

  async getUserIdsForGroupIds(ids, trx) {
    try {
      let builder = knex
        .select('*')
        .from('groups_users')
        .whereIn('group_id', ids);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let ret = _.filter(rows, row => row.userId !== null);
      ret = camelizeKeys(ret);
      ret = orderedFor(ret, ids, 'groupId', false);
      return ret;
    } catch (e) {
      log.error('Error in Group.getUserIdsForGroupIds', e);
      throw e;
    }
  }
```

Both of these returns an array of arrays of objects.
The difference from the one-to-many is that we need to


This could also be done differently with a single, specific DB call with a join.

This is how the above functions can be used with the reconcileBatchManyToMany.
In this case there are more parameters to the function call.
We pass the sources, results, _and_ the matching table data.
We also need to pass the two id fields used for matching

```
  // User.group resolver
  User: {
    groups: createBatchResolver(async (source, args, context) => {
      const uids = _.uniq(source.map(s => s.userId));
      const userGroups = await context.Group.getGroupIdsForUserIds(uids);

      const gids = _.uniq(_.map(_.flatten(userGroups), u => u.groupId));
      const groups = await context.Group.getMany(gids);

      let ret = reconcileBatchManyToMany(source, userGroups, groups, 'userId', 'groupId');
      return ret;
    })
  },

  // Group.user resolver
  Group: {
    users: createBatchResolver(async (source, args, context) => {
      const gids = _.uniq(source.map(s => s.groupId));
      const groupUsers = await context.Group.getUserIdsForGroupIds(gids);

      const uids = _.uniq(_.map(_.flatten(groupUsers), u => u.userId));
      const users = await context.User.getMany(uids);

      let ret = reconcileBatchManyToMany(source, groupUsers, users, 'groupId', 'userId');
      return ret;
    })
  },
```

