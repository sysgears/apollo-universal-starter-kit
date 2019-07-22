# Apollo Universal Starter Kit Payments Module with Stripe

The Apollo Universal Starter Kit payments module is a great starting point when you want to charge users for access to
paid features or services available through your application. With the starter kit payments module, you can develop the
_recurring billing_ functionality more rapidly than if you would have started from scratch.

The payment module is based on a popular payment processor [Stripe], and the module provides an example of using [Stripe
subscriptions] in a real production application. Moreover, the payments module also implements specific functionality to
help you simulate a real production-ready payment service in _development mode_ as well thanks to [stripe-local], a
simple JavaScript library.

The payments module code is located under the `packages/server/src/modules/payments/stripe/` directory. (When talking
about the payments module files, we'll omit the long `packages/server/src/modules/payments/` part for brevity, and will
simply start the path with `stripe/`. If a path doesn't start with `stripe/`, you should look for a respective file or
directory **from the project root**.)

### Running the App in Development Mode

1. Sign in to [Stripe Dashboard].

2. Enable the subscription module in `config/stripe/subscription.js` by setting the `stripe.subscription.enable`
property to `true`:

```javascript
export default {
  enabled: true,
  // other code is omitted for brevity
};
```

3. Replace `process.env.STRIPE_PUBLIC_KEY` with your Stripe publishable key for **development mode** in
`config/stripe/subscription.js`:

```javascript
export default {
   enabled: true,
   publicKey: process.env.STRIPE_PUBLIC_KEY, // Set to your 'Stripe_publishable_key' for development mode
};
```

4. Add your [Stripe secret key] into the `packages/server/.env` file:

```
# Stripe
STRIPE_SECRET_KEY="your_Stripe_secret_key"
```

**NOTE**: In `packages/server/.env`, you'll also see the `STRIPE_ENDPOINT_SECRET` environment variable. You don't need
to set this variable to run the application in development mode. You need to specify `STRIPE_ENDPOINT_SECRET` only when
you're deploying your Apollo Starter Kit-based application. For more information about deployment, consult the
[deployment section](#deployment-with-apollo-starter-kit-subscription-module).

5. Run `yarn stripe:setup` from the root project directory.

This command will create a product and plan using the Stripe API according to the default subscription plan and product
configured in the `config/stripe/subscription.js` file.

6. Start the application:

```bash
yarn seed && yarn watch
```

**NOTE**: If you're already using Apollo Universal Starter Kit, we recommend that you run `yarn migrate` instead of
`yarn seed`. Otherwise, the data that's already stored in the database will be overwritten.

7. Sign in to the application with the email `user@example.com` and password `user1234`.

(Apollo Universal Starter Kit provides two demo users; their login details can be found on the `/login` page in the
application. You can also create a new user to subscribe.)

8. Visit the `/subscriber-page` page and subscribe. The subscription page provides a few test credit cards that you can
use to test Stripe subscription.

9. Once the payment is processed, visit `/subscriber-page` again to view the secret number. The subscription information
is available on the `/profile` page.

## Implemented Stripe Subscription Features

The payments module in Apollo Universal Starter Kit provides a few features to help you build your specific payments
functionality upon them for your particular application.

Currently, Apollo Universal Starter Kit includes the following payments features:

* Subscription cancellation
* A default monthly subscription plan
* Editing credit card details in the user profile
* Authentication of subscription endpoints on the server
* Notification functionality for canceled or failed payments
* Integration with [Stripe Elements in React] for the web application
* Integration with [React Native Credit Card Input] for the mobile app
* Creation of subscriptions products and plans from the command line with `yarn stripe:setup`
* Integration with **stripe-local** to query Stripe for events and to post them to the webhook endpoint
* Protection of application routes with `SubscriptionRoute` (non-subscribers are redirected to the subscription page)

## Webhook

The Apollo Starter Kit payments module uses our custom webhook middleware for Express to handle requests from Stripe and
to notify users about any changes to their subscription. You can have a look at the `stripe/subscription/webhook.ts`
file for the code that manages requests and notifies users about subscription changes.

Currently, Apollo Universal Starter Kit supports two Stripe events:

* `customer.subscription.deleted`. If the user exists in the database, then the application deletes the [source] from
Stripe and updates the database. After that, an email is sent to the user to confirm the cancellation.
* `invoice.payment_failed`. An email will be sent to the user if their payment failed.

## Simulation of Full Subscription Functionality in Development Mode

If you've already used Stripe, you might know that Stripe doesn't allow you to get subscription information if you're
running the application in development mode.

In a production application, upon any changes of the subscription status, Stripe sends requests to the endpoint &ndash;
a webhook &ndash; that you registered with Stripe. These requests typically contain data about the subscription
cancellation or payment failure, and you need to handle these events in your production application.

The described flow, however, is only possible in a production application with a _real domain_.

When you work on your application in development mode, Stripe simply can't send any data to `localhost:port` (in fact,
Stripe still sends requests to the webhook that you registered, but the requests will never reach your application).

Therefore, in order to get full subscription functionality &ndash; to be able to test various payment problems in
development mode &ndash; we integrated a small library _stripe-local_ into the Apollo Starter Kit payments module.

stripe-local sends requests to Stripe every 15 seconds to verify if any new events were registered when you tried to
subscribe in development mode. If there are any new events, stripe-local will get them and send them to your application
on `localhost:port`. Simply put, you can consider stripe-local as a _proxy_ between your application and Stripe.

![Notification flow between Stripe and your application in development flow with the stripe-local library](https://user-images.githubusercontent.com/21691607/54425396-e5690700-471d-11e9-8e5f-dcca07513509.png)

### Configuring stripe-local

You can change the [stripe-local options] in the `stripe/subscription/index.ts` file. As shown in the example below, you
can add the stripe-local properties to the object attribute passed to `stripeLocal()`:

```javascript
// Other code is omitted
import stripeLocal from 'stripe-local';

if (__DEV__ && enabled && process.env.STRIPE_SECRET_KEY) {
  log.debug('Starting stripe-local proxy');
  stripeLocal({
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookUrl: `http://localhost:${__SERVER_PORT__}${webhookUrl}`
  });
}
// Other code is omitted
```

## Subscription Module Settings

To use the payments module, you need to add your Stripe keys into the `packages/server/.env` file and configure the
module in the `config/stripe/subscription.js` file.

First, add your Stripe secret and endpoint keys to the `packages/server/.env` file:

```dotenv
# Stripe API keys
STRIPE_SECRET_KEY=
STRIPE_ENDPOINT_SECRET=
```

To configure the payments module, you can change the settings listed in the table below in
`config/stripe/subscription.js`:

| Property       | Value   | Purpose                                                                     |
| -------------- | ------- | --------------------------------------------------------------------------- |
| enabled        | Boolean | Enables or disables the payments module. Defaults to `false`                |
| webhookUrl     | String  | Stores the URL for the webhook that you registered with Stripe              |
| publicKey      | String  | Stores the [publishable key] generated by Stripe for your application       |
| product        | Object  | Stores the _product_ properties. Consult Stripe documentation for [product] |
| plan           | Object  | Stores the _subscription plan_. Consult Stripe documentation for [plan]     |

## Deployment with Apollo Starter Kit Payments Module

1. Create a [webhook endpoint] in the [Stripe dashboard]. The webhook URLs that are set in the Stripe dashboard and in
the `config/stripe/subscription.js` file must be the same.

By default, `webhookUrl` is set to `/stripe/webhook` in `config/stripe/subscription.js`, therefore, in the Stripe
dashboard you need to set the webhook endpoint to `https://your-website-name.com/stripe/webhook`. Otherwise, use your
own URLs.

2. Add your live publishable key from Stripe into `config/stripe/subscription.js`.

3. Add your live secret key from Stripe into `packages/server/.env`.

4. Add the Stripe secret endpoint key from your Stripe webhook ([webhook signatures]) in `packages/server/.env` to
prevent fraudulent webhooks from being processed.

5. Run `yarn stripe:setup` from the root directory of Apollo Starter kit to create a subscription plan and product. The
default plan and product are configured in the `config/stripe/subscription.js` file.

6. [Deploy your application].

## Deployment to Heroku

1. Create a [webhook endpoint] in [Stripe Dashboard]. The webhook URLs that are set in the Stripe dashboard and the
`config/stripe/subscription.js` file must be the same.

By default, `webhookUrl` is set to `/stripe/webhook` in `config/stripe/subscription.js`. Therefore, in the Stripe
dashboard you need to set the webhook endpoint to `https://your-website-name.com/stripe/webhook`. Otherwise, use your
own URLs.

2. Add your live publishable key, secret key, and secret endpoint key from Stripe to your deployment configuration
 variables in [Heroku Dashboard].

| Variable                | Value                      |
| ----------------------- | -------------------------- |
| STRIPE_PUBLIC_KEY       | 'your_public_key'          |
| STRIPE_SECRET_KEY       | 'your_secret_key'          |
| STRIPE_ENDPOINT_SECRET  | 'your_secret_endpoint_key' |

`STRIPE_ENDPOINT_SECRET` is the secret endpoint key that's necessary to prevent fraudulent webhooks from being
processed. You can consult [webhook signatures] for more information about the secret endpoint key.

**NOTE**: The command `yarn stripe:setup` will be run automatically by [Heroku] to create a subscription plan and
product using the Stripe API. The default plan and product are configured in the `config/stripe/subscription.js` file.

3. [Deploy your application].

[stripe]: https://stripe.com
[stripe subscriptions]: https://stripe.com/us/billing
[stripe-local]: https://github.com/jsonmaur/stripe-local
[stripe dashboard]: https://dashboard.stripe.com/
[secret key]: https://stripe.com/docs/keys
[stripe elements in react]: https://stripe.com/docs/recipes/elements-react
[react native credit card input]: https://github.com/sbycrosz/react-native-credit-card-input
[source]: https://stripe.com/docs/sources/cards
[stripe-local options]: https://www.npmjs.com/package/stripe-local#options
[start the application]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Getting-Started#installing-and-running-apollo-universal-starter-kit
[publishable key]: https://stripe.com/docs/keys
[product]: https://stripe.com/docs/api#service_products
[plan]: https://stripe.com/docs/api#plans
[webhook endpoint]: https://stripe.com/docs/webhooks
[heroku dashboard]: https://dashboard.heroku.com/apps
[webhook signatures]: https://stripe.com/docs/webhooks/signatures
[deploy your application]: /docs/deployment.md
[heroku]: https://heroku.com
