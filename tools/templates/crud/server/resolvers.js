/*eslint-disable no-unused-vars*/
import FieldError from '../../../common/FieldError';

export default pubsub => ({
  Query: {
    $module$s: (obj, args, { $Module$ }) => {
      return $Module$.get$Module$s();
    },
    $module$: (obj, { id }, { $Module$ }) => {
      return $Module$.get$Module$(id);
    }
  },
  Mutation: {
    add$Module$: async (obj, { input }, { $Module$ }) => {
      try {
        const e = new FieldError();
        e.throwIf();

        const [id] = await $Module$.add$Module$(input);
        const $module$ = await $Module$.get$Module$(id);

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

        const $module$ = await $Module$.get$Module$(input.id);

        return { $module$ };
      } catch (e) {
        return { errors: e };
      }
    },
    delete$Module$: async (obj, { id }, { $Module$ }) => {
      try {
        const e = new FieldError();
        const $module$ = await $Module$.get$Module$(id);
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
