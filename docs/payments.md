## Apollo Universal Starter Kit payment Modules

In this review, you can find information about payments implemented modules available in Apollo Universal Starter Kit. 
You can follow to dedicated documents that give more details about: 
 - features and basic review about payment modules;
 - how to configure and quickly start using modules;
 - how to use modules;
 - how to configure modules for deployment;


# Stripe subscription Module

The purpose of this module is to provide a starting point for applications that 
wish to charge users a monthly subscription fee for access to certain features 
of the site. This is implemented using [Stripe](https://stripe.com).

Apollo Universal Starter Kit provides basic example how to use Stripe Subscription in real production application,
 also implements functionality for developing (shows how to imitate real production payment service in the developing mode).

#### Features
- After registering an account, users will be redirected to the page for subscribing using a credit card.
- After subscribing, the user will be charged $10 (according to the stripe plan) a month.
- Users can update their card details from the profile page.
- Users can cancel their subscription.
- Subscribers in this boilerplate are provided access to a super special magic number, whose GraphQL query is protected and available only to subscribers.
- When a subscription charge fails, an email is sent to the user via a webhook.
- When a subscription is canceled after several failed attempts to charge, an email is sent to the user via a webhook.
- Create products and plans via Stipe api from the CLI command (more information below).
- In development, [stripe-local](https://github.com/jsonmaur/stripe-local) is used to query for Stripe events and POSTs them to the webhook endpoint.
- On the client, pages protected by `SubscriptionRoute` will be redirected to the subscribe page if no subscription is found.
- On the server, subscription endpoints protected with double auth: basic user authentication and subscription auth which protects subscription endpoints only for subscribers.
- Implemented Stripe-react components for web. 
- Implemented Stripe Subscription for mobile via [React Native Credit Card Input](https://github.com/sbycrosz/react-native-credit-card-input) and manually sending requests for credit card token via fetch. 

`Webhook` - this is an Express middleware which handles request from the Stripe.
The two events from the Stripe currently supported in Apollo Universal Starter Kit:
- `customer.subscription.deleted` - cancel subscription (If user exists then delete source from Stripe and update database, also send email to the user).
- `invoice.payment_failed` - payment was failed (sends email to the user about failed payment).

 
### Getting Started

1. Sign up for a [Stripe](https://stripe.com) developer account.
2. Ensure subscriptions are enabled in `config/payments.js`, set `true` to `stripe.recurring.enable` property.
3. Place your Stripe publishable key in `config/payments.js`.
4. Place your Stripe secret key in your `.env` file (stripe endpoint secret not needed right away).
5. Run `yarn stripe:setup` in the server folder (`/packages/server/`), which will create a subscription plan for you using Stripe's API.
6. Start the app, register a new user or log in as `user@example.com`, and go through the subscription creation process.
6. Subscription info is displayed in the user profile.

### Deployment

In production mode module has no differences with development mode, except using real payment data.

1. Before deploying, you will need to create an actual webhook endpoint inside the Stripe management the same as in `config` file. For example `stripe/webhook`.
2. Place your Live Stripe publishable key in `config/payments.js`.
3. Place your Live Stripe secret key in your `.env`.
4. If you would like to validate the events from the Stripe to your webhook ([Checking Webhook Signatures](https://stripe.com/docs/webhooks/signatures)). It helps prevent fraudulent webhooks from being processed. Add stripe signing secret key from your stripe webhook in your `.env`. 
5. Run `yarn stripe:setup` in the server folder (`/packages/server/`), which will create a subscription plan for you using Stripe's API.
6. Deploy app.