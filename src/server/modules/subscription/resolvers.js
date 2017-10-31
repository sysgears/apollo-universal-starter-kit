/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import FieldError from '../../../common/FieldError';

export default pubsub => ({
  Query: {
    subscription(obj, args, context) {
      if (context.user) {
        return context.Subscription.getSubscription(context.user.id);
      } else {
        return null;
      }
    }
  },
  Mutation: {
    async subscribe(obj, { input }, context) {
      try {
        const e = new FieldError();
        const data = pick(input, ['nameOnCard', 'cardNumber', 'cvv']);
        const { user } = context;

        if (data.nameOnCard.length === 0) {
          e.setError('nameOnCard', 'Name cannot be blank.');
        }

        if (data.cardNumber.length === 0) {
          e.setError('cardNumber', 'Card number cannot be blank.');
        }

        if (data.cvv.length === 0) {
          e.setError('cvv', 'CVV cannot be blank.');
        }
        e.throwIf();

        // TODO payment processor logic

        if (user) {
          await context.Subscription.createSubscription(user.id);
        }

        return { active: true, errors: null };
      } catch (e) {
        return { active: false, errors: e };
      }
    }
  },
  Subscription: {}
});
