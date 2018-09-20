import Stripe from 'stripe';
import { TranslationFunction } from 'i18next';

import StripeSubscriptionDAO from './sql';
import mailer from '../../../mailer/mailer';
import User from '../../../user/sql';
import settings from '../../../../../../../settings';

const { secretKey, endpointSecret } = settings.payments.stripe.subscription;
const StripeSubscription = new StripeSubscriptionDAO();
const stripe = new Stripe(secretKey);

/**
 * Gets user email from database and sends email.
 *
 * @param userId - The user id.
 * @param subject - The title for email.
 * @param html - The body for email.
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
 * Deletes subscription and notifies user about canceling the subscription.
 *
 * @param stripeEvent - The stripe event.
 * @param websiteUrl - The website url for sending to email.
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
 * Notifies user via email about failed payment.
 *
 * @param stripeEvent - The stripe event.
 * @param websiteUrl - The website url for sending to email.
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
 * This Endpoint handles Stripe events
 */
export default async (req: any, res: any) => {
  try {
    const websiteUrl = `${req.protocol}://${req.get('host')}`;
    const stripeEvent = endpointSecret
      ? stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], endpointSecret)
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
