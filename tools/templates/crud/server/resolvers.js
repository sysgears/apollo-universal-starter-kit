/*eslint-disable no-unused-vars*/
import FieldError from '../../../common/FieldError';

export default pubsub => ({
  Query: {
    $module$s: async (obj, args, { $Module$ }) => {
      const $module$s = await $Module$.get$Module$s(args);
      const { count } = await $Module$.getTotal();

      return {
        edges: $module$s,
        pageInfo: {
          totalCount: count,
          hasNextPage: $module$s.length === args.limit
        }
      };
    },
    $module$: (obj, args, { $Module$ }) => {
      return $Module$.get$Module$(args);
    }
  },
  Mutation: {
    add$Module$: async (obj, { input }, { $Module$ }) => {
      try {
        const e = new FieldError();
        e.throwIf();

        const [id] = await $Module$.add$Module$(input);
        const $module$ = await $Module$.get$Module$({ id });

        return { $module$ };
      } catch (e) {
        return { errors: e };
      }
    },
    edit$Module$: async (obj, { input }, { $Module$ }) => {
      try {
        const e = new FieldError();
        e.throwIf();

        await $Module$.edit$Module$(input);

        const $module$ = await $Module$.get$Module$({ id: input.id });

        return { $module$ };
      } catch (e) {
        return { errors: e };
      }
    },
    delete$Module$: async (obj, { id }, { $Module$ }) => {
      try {
        const e = new FieldError();
        const $module$ = await $Module$.get$Module$({ id });
        if (!$module$) {
          e.setError('delete', '$Module$ does not exist.');
          e.throwIf();
        }

        const isDeleted = await $Module$.delete$Module$(id);
        if (isDeleted) {
          return { $module$ };
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
