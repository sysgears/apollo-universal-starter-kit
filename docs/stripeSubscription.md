# Apollo Universal Starter Kit Subscription Module with Stripe

The Apollo Starter Kit subscription module is a great starting point for your application when you want to provide
subscription plans and, therefore, when you need to charge users for access to certain features or services available
through your application.

The subscription module is based on a popular payment processor [Stripe], and it provides a basic example of using
Stripe subscriptions in a real production application. Moreover, the subscription module also implements specific
functionality to help you simulate a real production-ready payment service in _the development mode_ thanks to
`stripe-local`.

The entire code for the Stripe subscription module is located under `packages/server/src/modules/payments/stripe/`
directory. (When talking about the module files, we'll omit the long `packages/server/src/modules/payments/` part for
brevity, and will simply start the path with `stripe/`. If a path doesn't start with `stripe/`, you should look for a
respective file or directory from the project root.)

### Getting Started

1. Sign into [Stripe Dashboard].
2. Enable the subscription module in `config/stripe/subscription.js` by setting the `stripe.subscription.enable` property
to `true`:
```javascript
export default {
  stripe: {
    subscription: {
      enabled: true,
      // other code is omitted for brevity
    }
  }
};
```
3. Add your Stripe publishable key into the `config/stripe/subscription.js` configuration file:
```javascript
export default {
  stripe: {
    subscription: {
      enabled: true,
      publicKey: 'your Stripe publishable key'
      // other code is omitted for brevity
    }
  }
};
```
or set Stripe publishable key value to environment variable `STRIPE_PUBLIC_KEY`
4. Add your Stripe secret key into the `packages/server/.env` file:

```
# Stripe
STRIPE_SECRET_KEY="your Stripe secret key"
```
**Note**: You don't need the Stripe endpoint secret key to run the application in development mode.

5. Run `yarn stripe:setup` from the root project directory.

This command will create a product and plan using the Stripe API according to the default subscription plan and product
that are configured in the `config/stripe/subscription.js` file.

6. [Start the application], and sign in as `user@example.com`. (Apollo Universal Starter Kit provides default username
and password that you can use to sign in. Alternatively, you can create a new user to subscribe.)
7. Visit the `/subscriber-page` page and subscribe. The subscription page provides test credit cards that you can use to
subscribe.
8. Once the payment is processed, visit the `/subscriber-page` page again to view the secret number. The subscription
information is available on the `/profile` page.

## Implemented Stripe Subscription Features

The subscription module in Apollo Universal Starter Kit implements a few features to help you build upon them and add
the specific functionality for your particular application.

Currently, Apollo Universal Starter Kit includes the following subscription features:

* A monthly subscription plan
* Subscription cancellation
* Managing credit card details in the user profile
* Notification functionality to inform users when their subscription failed or was canceled
* Creation of subscriptions products and plans using the Stripe API from the command line
* Protection of application routes with `SubscriptionRoute` (non-subscribers are redirected)
* Authentication of subscription endpoints on the server
* Integration with [Stripe Elements in React] for the web application
* Integration with [React Native Credit Card Input] to enable Stripe subscription for mobile. The requests for credit card
token are built manually and sent using the Fetch API.
* Integration with **[stripe-local]** to query Stripe for events and to post them to the webhook endpoint

## Webhook

The Apollo Starter Kit subscription module uses webhook, an Express middleware, to handle request that are coming from
Stripe and notify the user about the changes to their subscription. The code that manages requests and notifies users is
located in `stripe/subscription/webhook.ts`.

Currently, Apollo Universal Starter Kit supports two Stripe events:

* `customer.subscription.deleted`. If the user exists in the database, then the application deletes the [source] from
Stripe and updates the database. Finally, an email is sent to the user to confirm that their subscription was canceled.
* `invoice.payment_failed`. If a payment has failed, an email will be sent to the user.

### Simulation of Full Subscription Functionality in Development Mode

If you've already used Stripe, you might know that Stripe doesn't allow you to get information about the subscription if
you're running the application in development mode.

In a production application, if a payment was declined, Stripe sends a request to the endpoint&mdash;a webhook&mdash;that
you registered with Stripe. These requests typically contain such data about the subscription cancellation or payment
failure, and you handle such situations in your production application.

The described flow, however, is only possible in a production application with a _real domain_.

When you work on your application in development mode on your computer, Stripe can't send any data to `localhost:port`
(in fact, Stripe sends a request to the webhook that you registered, but the request never reaches your application).
Therefore, in order to get full subscription functionality&mdash;to be able to test various payment problems in
development mode&mdash;we integrated a small library `stripe-local` into the subscription module.

`stripe-local` sends a request to Stripe every 15 seconds to verify if any new events were registered when you tried to
subscribe in development mode. If there are any new events, `stripe-local` will get them and send them to your
application on `localhost:port`. Simply put, you can consider `stripe-local` a proxy between your application and
Stripe.

![stripe_local_diagram](https://user-images.githubusercontent.com/24529997/46010501-91188f00-c0cb-11e8-8bf0-58e21b125588.png)

#### Configuring stripe-local

You can change [stripe-local options] in the `stripe/subscription/index.ts` file. As shown in the example below, you can
add stripe-local properties to the object attribute passed to `stripeLocal()`:

```javascript
// Other code is omitted
import stripeLocal from 'stripe-local';

if (__DEV__ && enabled && secretKey) {
  log.debug('Starting stripe local proxy');
  stripeLocal({ secretKey, webhookUrl: `http://localhost:${__SERVER_PORT__}${webhookUrl}` });
}
// Other code is omitted
```

## Subscription Module Settings

To use the subscription module, you can add Stripe keys into the `packages/server/.env` file and configure the module
in the `config/stripe/subscription.js` file.

First, add your Stripe secret and endpoint keys to the `packages/server/.env` file:

```dotenv
# Stripe API keys
STRIPE_SECRET_KEY=
STRIPE_ENDPOINT_SECRET=
```
To configure the module, you can change the settings listed in the table below::

| Property       | Value   | Purpose                                                                                   |
| -------------- | ------- | ----------------------------------------------------------------------------------------- |
| subscription   | object  | Contains properties for various settings for the Stripe subscription module               |
| enabled        | Boolean | Enables or disables the subscription module. Defaults to `false`                          |
| webhookUrl     | String  | Stores a URL for your webhook that you registered with Stripe                             |
| publicKey      | String  | Stores the [publishable key] generated by Stripe for your application                     |
| secretKey      | String  | Stores the [secret key]. The actual key must be stored in `packages/server/.env`          |
| endpointSecret | String  | Stores the [endpoint secret key]. The actual key must be stored in `packages/server/.env` |
| product        | Object  | Stores the product properties. Consult Stripe documentation for the [product] object      |
| plan           | Object  | Stores the subscription plan. Consult Stripe documentation for the [plan] object          |

## Deployment with Apollo Starter Kit Subscription Module

1. Create a [webhook endpoint] inside the Stripe dashboard with the `webhookUrl` property set
`config/stripe/subscription.js`.
2. Add your live publishable key from Stripe in `config/stripe/subscription.js`.
3. Add your live secret key from Stripe in the `packages/server/.env`.
4. Set up [webhook signatures] to prevent fraudulent webhooks from being processed.
5. Add Stripe secret key from your Stripe webhook in `packages/server/.env`.
6. Run `yarn stripe:setup` from the root directory to create a subscription plan using Stripe API. The default plan is
configured in the `config/stripe/subscription.js` file.
7. [Deploy your application].

[stripe]: https://stripe.com
[stripe dashboard]: https://dashboard.stripe.com/
[start the application]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Getting-Started#installing-and-running-apollo-universal-starter-kit
[stripe elements in react]: https://stripe.com/docs/recipes/elements-react
[react native credit card input]: https://github.com/sbycrosz/react-native-credit-card-input
[stripe-local]: https://github.com/jsonmaur/stripe-local
[source]: https://stripe.com/docs/sources/cards
[stripe-local options]: https://www.npmjs.com/package/stripe-local#options
[publishable key]: https://stripe.com/docs/keys
[secret key]: https://stripe.com/docs/keys
[endpoint secret key]: https://stripe.com/docs/webhooks/signatures
[product]: https://stripe.com/docs/api#service_products
[plan]: https://stripe.com/docs/api#plans
[webhook endpoint]: https://stripe.com/docs/webhooks
[webhook signatures]: https://stripe.com/docs/webhooks/signatures
[deploy your application]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Getting-Started#deploying-apollo-starter-kit-application-to-production
