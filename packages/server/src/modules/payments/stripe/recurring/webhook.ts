import Stripe from 'stripe';

import StripeRecurrentDAO from './sql';
import mailer from '../../../mailer/mailer';
import User from '../../../user/sql';
import settings from '../../../../../../../settings';

const StripeRecurrent = new StripeRecurrentDAO();
const stripe = new Stripe(settings.subscription.stripeSecretKey);

const sendEmailToUser = async (userId: number, subject: string, html: string) => {
  const { email }: any = await User.getUser(userId);

  mailer.sendMail({
    from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html
  });
};

const deleteSubscription = async (event: any, rootUrl: string) => {
  const subscription = await StripeRecurrent.getStripeRecurrentByStripeRecurrentId(event.data.object.id);

  if (subscription) {
    const { userId, stripeCustomerId, stripeSourceId } = subscription;
    const url = `${rootUrl}/subscription`;

    await stripe.customers.deleteSource(stripeCustomerId, stripeSourceId);
    await StripeRecurrent.editStripeRecurrent({
      userId,
      active: false,
      stripeSourceId: null,
      stripeSubscriptionId: null,
      expiryMonth: null,
      expiryYear: null,
      last4: null,
      brand: null
    });

    await sendEmailToUser(
      userId,
      'Subscription Canceled',
      `Your subscription has been canceled. To resubscribe click here: <a href="${url}">${url}</a>`
    );
  }
};

const notifyFailedSubscription = async (event: any, rootUrl: string) => {
  const subscription = await StripeRecurrent.getStripeRecurrentByStripeCustomerId(event.data.object.customer);

  if (subscription) {
    const { userId } = subscription;
    const url = `${rootUrl}/profile`;

    await sendEmailToUser(
      userId,
      'Charge Failed',
      `We are having trouble charging your card. Please update your card details here: <a href="${url}">${url}</a>`
    );
  }
};

/**
 * Webhook middleware.
 * Endpoint which provides works with Stripe events
 */
export default async (req: any, res: any) => {
  try {
    const rootUrl = `${req.protocol}://${req.get('host')}`;
    let event;

    if (settings.subscription.stripeEndpointSecret) {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'],
        settings.subscription.stripeEndpointSecret
      );
    } else {
      event = req.body;
    }

    if (event.type === 'customer.subscription.deleted') {
      await deleteSubscription(event, rootUrl);
    } else if (event.type === 'invoice.payment_failed') {
      await notifyFailedSubscription(event, rootUrl);
    }

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
