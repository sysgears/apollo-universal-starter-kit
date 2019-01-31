import Stripe from 'stripe';
import { TranslationFunction } from 'i18next';
import { mailer } from '@gqlapp/mailer-server-ts';

import StripeSubscriptionDAO from './sql';
import settings from '../../../../../settings';

const { User } = require('@gqlapp/user-server-ts');
const StripeSubscription = new StripeSubscriptionDAO();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Gets a user email from the database and sends an email.
 *
 * @param userId - The user ID.
 * @param subject - The email title.
 * @param html - The email body.
 */
const sendEmailToUser = async (userId: number, subject: string, html: string) => {
  const { email }: any = await User.getUser(userId);

  mailer.sendMail({
    from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html
  });
};

/**
 * Deletes a subscription and notifies the user that the subscription was canceled.
 *
 * @param stripeEvent - A Stripe event.
 * @param websiteUrl - The URL of the subscription page to be sent in the email.
 * @param t - The translate function.
 */
const deleteSubscription = async (stripeEvent: any, websiteUrl: string, t: TranslationFunction) => {
  const subscription = await StripeSubscription.getSubscriptionByStripeSubscriptionId(stripeEvent.data.object.id);

  if (subscription) {
    const { userId, stripeCustomerId, stripeSourceId } = subscription;
    const url = `${websiteUrl}/subscription`;

    await stripe.customers.deleteSource(stripeCustomerId, stripeSourceId);
    await StripeSubscription.editSubscription({
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
      t('stripeSubscription:deleteEmail.subject'),
      `${t('stripeSubscription:deleteEmail.text')} <a href="${url}">${url}</a>`
    );
  }
};

/**
 * Notifies the user via email about the failed payment.
 *
 * @param stripeEvent - A Stripe event.
 * @param websiteUrl - The URL of the subscription page to be sent in the email.
 * @param t - The translate function.
 */
const notifyFailedSubscription = async (stripeEvent: any, websiteUrl: string, t: TranslationFunction) => {
  const subscription = await StripeSubscription.getSubscriptionByStripeCustomerId(stripeEvent.data.object.customer);

  if (subscription) {
    const { userId } = subscription;
    const url = `${websiteUrl}/profile`;

    await sendEmailToUser(
      userId,
      t('stripeSubscription:failedEmail.subject'),
      `${t('stripeSubscription:failedEmail.text')} <a href="${url}">${url}</a>`
    );
  }
};

/**
 * Webhook middleware.
 * This endpoint handles Stripe events
 */
export default async (req: any, res: any) => {
  try {
    const websiteUrl = `${req.protocol}://${req.get('host')}`;
    const stripeEvent = process.env.STRIPE_ENDPOINT_SECRET
      ? stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_ENDPOINT_SECRET)
      : req.body;

    if (stripeEvent.type === 'customer.subscription.deleted') {
      await deleteSubscription(stripeEvent, websiteUrl, req.t);
    } else if (stripeEvent.type === 'invoice.payment_failed') {
      await notifyFailedSubscription(stripeEvent, websiteUrl, req.t);
    }

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
