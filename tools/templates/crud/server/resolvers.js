/*eslint-disable no-unused-vars*/
import parseFields from 'graphql-parse-fields';
import { createBatchResolver } from 'graphql-resolve-batch';
import FieldError from '../../../../common/FieldError';

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
    create$Module$: async (obj, { data }, { $Module$ }, info) => {
      try {
        const e = new FieldError();
        e.throwIf();

        const [id] = await $Module$.create(data);
        const $module$ = await $Module$.get({ where: { id } }, parseFields(info).node);

        return { node: $module$ };
      } catch (e) {
        return { errors: e };
      }
    },
    update$Module$: async (obj, { data, where }, { $Module$ }, info) => {
      try {
        const e = new FieldError();
        e.throwIf();

        await $Module$.update(data, where);
        const $module$ = await $Module$.get({ where }, parseFields(info).node);
        return { node: $module$ };
      } catch (e) {
        return { errors: e };
      }
    },
    delete$Module$: async (obj, { where }, { $Module$ }, info) => {
      try {
        const e = new FieldError();

        const $module$ = await $Module$.get({ where }, parseFields(info).node);
        if (!$module$) {
          e.setError('delete', '$MoDuLe$ does not exist.');
          e.throwIf();
        }

        const isDeleted = await $Module$.delete(where);
        if (isDeleted) {
          return { node: $module$ };
        } else {
          e.setError('delete', 'Could not delete $MoDuLe$. Please try again later.');
          e.throwIf();
        }
      } catch (e) {
        return { errors: e };
      }
    },
    sort$Module$s: async (obj, { data }, { $Module$ }, info) => {
      try {
        const e = new FieldError();
        e.throwIf();

        const [sortCount] = await $Module$.sort(data);
        if (sortCount.affectedRows > 0) {
          return { count: sortCount.affectedRows };
        } else {
          e.setError('sort', 'Could not sort $MoDuLe$. Please try again later.');
          e.throwIf();
        }
      } catch (e) {
        return { errors: e };
      }
    },
    deleteMany$Module$s: async (obj, { ids }, { $Module$ }) => {
      try {
        const e = new FieldError();

        const deleteCount = await $Module$.deleteMany(ids);
        if (deleteCount > 0) {
          return { count: deleteCount };
        } else {
          e.setError('delete', 'Could not delete any of selected $MoDuLe$. Please try again later.');
          e.throwIf();
        }
      } catch (e) {
        return { errors: e };
      }
    }
  },
  Subscription: {}
});
