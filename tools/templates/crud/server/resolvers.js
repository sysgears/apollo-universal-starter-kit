/*eslint-disable no-unused-vars*/
import parseFields from 'graphql-parse-fields';
import { createBatchResolver } from 'graphql-resolve-batch';
import FieldError from '../../../common/FieldError';

export default pubsub => ({
  Query: {
    $module$s: async (obj, args, { $Module$ }, info) => {
      const $module$s = await $Module$.getPaginated(args, parseFields(info).edges);
      const { count } = await $Module$.getTotal();

      return {
        edges: $module$s,
        pageInfo: {
          totalCount: count,
          hasNextPage: $module$s && $module$s.length === args.limit
        }
      };
    },
    $module$: async (obj, args, { $Module$ }, info) => {
      const $module$ = await $Module$.get(args, parseFields(info).node);
      return { node: $module$ };
    }
  },
  $Module$Data: {
    // order data
    // end order data
  },
  // schema batch resolvers
  // end schema batch resolvers
  Mutation: {
    add$Module$: async (obj, { input }, { $Module$ }, info) => {
      try {
        const e = new FieldError();
        e.throwIf();

        const [id] = await $Module$.add(input);
        const $module$ = await $Module$.get({ id }, parseFields(info).node);

        return { node: $module$ };
      } catch (e) {
        return { errors: e };
      }
    },
    edit$Module$: async (obj, { input }, { $Module$ }, info) => {
      try {
        const e = new FieldError();
        e.throwIf();

        await $Module$.edit(input);

        const $module$ = await $Module$.get({ id: input.id }, parseFields(info).node);

        return { node: $module$ };
      } catch (e) {
        return { errors: e };
      }
    },
    delete$Module$: async (obj, { id }, { $Module$ }, info) => {
      try {
        const e = new FieldError();
        const $module$ = await $Module$.get({ id }, parseFields(info).node);
        if (!$module$) {
          e.setError('delete', '$Module$ does not exist.');
          e.throwIf();
        }

        const isDeleted = await $Module$.delete(id);
        if (isDeleted) {
          return { node: $module$ };
        } else {
          e.setError('delete', 'Could not delete $module$. Please try again later.');
          e.throwIf();
        }
      } catch (e) {
        return { errors: e };
      }
    }
  },
  Subscription: {}
});
