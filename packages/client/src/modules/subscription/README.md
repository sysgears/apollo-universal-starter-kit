# Subscription Module

The purpose of this module is to provide a starting point for applications that wish to charge users a monthly subscription fee for access to certain features of the site. This is implemented using [Stripe](https://stripe.com).

### Features Supported

- After registering an account, users will be redirected to the page for subscribing using a credit card.
- Pages protected by `SubscriptionRoute` will be redirected to the subscribe page if no subscription is found.
- Navigation items using the `SubscriptionNav` component will only appear to active subscribers.
- Subscribers in this boilerplate are provided access to a super special magic number, whose GraphQL query is protected and available only to subscribers.
- After subscribing, the user will be charged $10 a month.
- Users can update their card details from the profile page.
- Users can cancel their subscription.
- When a subscription charge fails, an email is sent to the user via a webhook.
- When a subscription is canceled after several failed attempts to charge, an email is sent to the user via a webhook.
- In development, [stripe-local](https://github.com/jsonmaur/stripe-local) is used to query for Stripe events and POSTs them to the webhook endpoint.

### Getting Started

1. Sign up for a [Stripe](https://stripe.com) developer account.
2. Ensure subscriptions are enabled in `config/subscription.js`.
3. Place your Stripe publishable key in `config/subscription.js`.
4. Place your Stripe secret key in your `.env` file (stripe endpoint secret not needed right away).
5. Run `yarn stripe:setup`, which will create a subscription plan for you using Stripe's API.
6. Start the app, register a new user, and go through the subscription creation process.

### Deployment

Before deploying, you will need to create an actual webhook endpoint inside the Stripe management console (cannot be automated). The two events currently supported are `customer.subscription.deleted` and `invoice.payment_failed`. At this point, you could choose to provide a stripe endpoint secret in your `.env` file, but it is not necessary. It helps prevent fraudulent webhooks from being processed.
