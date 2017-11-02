/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import FieldError from '../../../common/FieldError';

export default pubsub => ({
  Query: {
    subscription(obj, args, context) {
      return context.subscription;
    }
  },
  Mutation: {
    async subscribe(obj, { input }, context) {
      try {
        const e = new FieldError();
        const data = pick(input, ['nameOnCard', 'cardNumber', 'cvv', 'expiryMonth', 'expiryYear']);
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

        if (data.expiryMonth.length === 0) {
          e.setError('expiryMonth', 'Expiration month cannot be blank.');
        }

        if (data.expiryYear.length === 0) {
          e.setError('expiryYear', 'Expiration year cannot be blank.');
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
