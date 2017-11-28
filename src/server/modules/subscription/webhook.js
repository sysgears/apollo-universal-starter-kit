import Stripe from 'stripe';

import SubscriptionDAO from './sql';
import settings from '../../../../settings';

const Subscription = new SubscriptionDAO();
const stripe = Stripe(settings.subscription.stripeSecretKey);

export default async (req, res) => {
  try {
    const { stripeEndpointSecret } = settings.subscription;
    let event;

    if (stripeEndpointSecret) {
      const sig = req.headers['stripe-signature'];
      event = stripe.webhooks.constructEvent(req.body, sig, settings.subscription.stripeEndpointSecret);
    } else {
      event = req.body;
    }

    if (event.type === 'customer.subscription.deleted') {
      const response = event.data.object;
      const subscription = await Subscription.getSubscriptionByStripeSubscriptionId(response.id);
      if (subscription) {
        const { userId, stripeCustomerId, stripeSourceId } = subscription;

        await stripe.customers.deleteSource(stripeCustomerId, stripeSourceId);
        await Subscription.editSubscription({
          userId: userId,
          subscription: {
            active: false,
            stripeSourceId: null,
            stripeSubscriptionId: null,
            expiryMonth: null,
            expiryYear: null,
            last4: null,
            brand: null
          }
        });
      }
    }

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
