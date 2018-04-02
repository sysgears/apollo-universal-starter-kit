import Stripe from 'stripe';

import SubscriptionDAO from './sql';
import mailer from '../mailer/mailer';
import UserDAO from '../user/sql';
import settings from '../../../../../settings';

const Subscription = new SubscriptionDAO();
const User = new UserDAO();
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
        const user = await User.getUser(userId);

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

        const url = `${req.protocol}://${req.get('host')}/subscription`;

        mailer.sendMail({
          from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: 'Subscription Canceled',
          html: `Your subscription has been canceled. To resubscribe click here: <a href="${url}">${url}</a>`
        });
      }
    }

    if (event.type === 'invoice.payment_failed') {
      const response = event.data.object;
      const subscription = await Subscription.getSubscriptionByStripeCustomerId(response.customer);
      if (subscription) {
        const { userId } = subscription;
        const user = await User.getUser(userId);

        const url = `${req.protocol}://${req.get('host')}/profile`;

        mailer.sendMail({
          from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: 'Charge Failed',
          html: `We are having trouble charging your card. Please update your card details here: <a href="${url}">${url}</a>`
        });
      }
    }

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
