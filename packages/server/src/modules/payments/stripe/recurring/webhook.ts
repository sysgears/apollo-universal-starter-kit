import Stripe from 'stripe';

import StripeRecurringDAO from './sql';
import mailer from '../../../mailer/mailer';
import User from '../../../user/sql';
import settings from '../../../../../../../settings';

const { secretKey, endpointSecret } = settings.payments.stripe.recurring;
const StripeRecurring = new StripeRecurringDAO();
const stripe = new Stripe(secretKey);

const sendEmailToUser = async (userId: number, subject: string, html: string) => {
  const { email }: any = await User.getUser(userId);

  mailer.sendMail({
    from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html
  });
};

const deleteSubscription = async (stripeEvent: any, rootUrl: string) => {
  const recurring = await StripeRecurring.getRecurringByStripeRecurringId(stripeEvent.data.object.id);

  if (recurring) {
    const { userId, stripeCustomerId, stripeSourceId } = recurring;
    const url = `${rootUrl}/subscription`;

    await stripe.customers.deleteSource(stripeCustomerId, stripeSourceId);
    await StripeRecurring.editRecurring({
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

const notifyFailedSubscription = async (stripeEvent: any, websiteUrl: string) => {
  const recurring = await StripeRecurring.getRecurringByStripeCustomerId(stripeEvent.data.object.customer);

  if (recurring) {
    const { userId } = recurring;
    const url = `${websiteUrl}/profile`;

    await sendEmailToUser(
      userId,
      'Charge Failed',
      `We are having trouble charging your card. Please update your card details here: <a href="${url}">${url}</a>`
    );
  }
};

/**
 * Webhook middleware.
 * This Endpoint handles Stripe events
 */
export default async (req: any, res: any) => {
  try {
    const websiteUrl = `${req.protocol}://${req.get('host')}`;
    const stripeEvent = endpointSecret
      ? stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], endpointSecret)
      : req.body;

    if (stripeEvent.type === 'customer.subscription.deleted') {
      await deleteSubscription(stripeEvent, websiteUrl);
    } else if (stripeEvent.type === 'invoice.payment_failed') {
      await notifyFailedSubscription(stripeEvent, websiteUrl);
    }

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
