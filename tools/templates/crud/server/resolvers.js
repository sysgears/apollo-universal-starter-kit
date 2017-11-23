/*eslint-disable no-unused-vars*/
import joinMonster from 'join-monster';
import FieldError from '../../../common/FieldError';
import knex from '../../../server/sql/connector';

export default pubsub => ({
  Query: {
    $module$s: (obj, args, context, info) => {
      return joinMonster(info, args, sql => knex.raw(sql));
    },
    $module$: (obj, args, context, info) => {
      return joinMonster(info, args, sql => knex.raw(sql));
    }
  },
  Mutation: {
    add$Module$: async (obj, { input }, { $Module$ }, info) => {
      const e = new FieldError();
      e.throwIf();

      const [id] = await $Module$.add$Module$(input);

      return joinMonster(info, { id }, sql => knex.raw(sql));
    },
    edit$Module$: async (obj, { input }, { $Module$ }, info) => {
      const e = new FieldError();
      e.throwIf();

      await $Module$.edit$Module$(input);

      return joinMonster(info, { id: input.id }, sql => knex.raw(sql));
    },
    delete$Module$: async (obj, { id }, { $Module$ }, info) => {
      const e = new FieldError();
      const $module$ = await joinMonster(info, { id }, sql => knex.raw(sql));
      if (!$module$) {
        e.setError('delete', '$Module$ does not exist.');
        e.throwIf();
      }

      const isDeleted = await $Module$.delete$Module$(id);
      if (isDeleted) {
        return { id };
      } else {
        e.setError('delete', 'Could not delete $module$. Please try again later.');
        e.throwIf();
      }
    }
  },
  Subscription: {}
});
