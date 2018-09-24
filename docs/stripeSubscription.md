# Apollo Universal Starter Kit Subscription Module with Stripe

The Apollo Starter Kit subscription module is a great starting point for your application when you want to implement 
subscription plans and, therefore, when you need to charge users for access to certain features or services available
through your application.

The subscription module is based on a popular payment processor [Stripe], and it provides a basic example of using 
subscriptions in a real production application. Moreover, the subscription module also implements specific functionality 
to help you simulate a real production-ready payment service in _the development mode_.

### Getting Started

1. Sign in with [Stripe Dashboard] to your developer account.
2. Enable subscription module in `config/payments.js` by setting the `stripe.subscription.enable` property to `true`.

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

3. Add your Stripe publishable key into the `config/stripeSubscription.js` configuration file.
4. Add your Stripe secret key into the `packages/server/.env` file.

The Stripe endpoint secret isn't required to run the application in the development mode.

5. Run `yarn stripe:setup` from the root project directory.

This will create a subscription a product and plan using the Stripe API. The subscription plan and product are configured
in the `config/payments.js` file.

6. [Start the application], and sign in as `user@example.com` (or create a new user).
7. Visit the `localhost:8080/subscriber-page` page and subscribe. The subscription page has default Stripe data that you 
can use.
8. Once the payment is processed, visit `localhost:8080/subscriber-page` page to view the secret number. The subscription 
information is available in the user profile `localhost:8080/profile`.

## Subscription Features

The subscription module in Apollo Universal Starter Kit provides a few important features, and you can build upon them 
adding functionality to implement subscription for your particular application.

Currently, the feature list includes the following:

* Monthly subscription plan (which you can configure in config/stripeSubscription.js)
* Managing credit card details from the user profile
* Subscription cancellation
* Notification functionality to inform users when their subscription failed or was canceled
* Creation of products and plans using the Stripe API from the command line interface.
* Protection of application pages with `SubscriptionRoute`. Non-subscribers are redirected to the subscription page
* Double authentication to protect endpoints
* Implemented Stripe Elements in React for web application
* Implemented Stripe subscription for mobile app with [React Native Credit Card Input]
* **[stripe-local]** is used to query Stripe for events and to post them to the webhook endpoint

Internally, the page that non-subscribers want to access is protected. To notify the user of any changes of the 
subscriptions&mdash;failure or cancellation&mdash;the user will be notified with webhooks.

What is this -- Double authentication to protect endpoints: basic user authentication and subscription auth which 
protects subscription endpoints only for subscribers.
What is this -- Implemented Stripe subscription for mobile with [React Native Credit Card Input] and manually sending 
requests for credit card token via fetch.

What is this - `Webhook` - this is an Express middleware which handles request from the Stripe 

The two events from the Stripe currently supported in Apollo Universal Starter Kit:

- `customer.subscription.deleted` - cancel subscription (If user exists then delete source from Stripe and update database, 
also send email to the user).
- `invoice.payment_failed` - payment was failed (sends email to the user about failed payment).

### Simulation of Full Subscription Functionality in Development Mode

If you've already used Stripe, you might know that Stripe doesn't allow you to get information about the subscription if
you're using the development mode.

The payment process for a production application looks as follows: 

1. The user subscribes on the website 
2. Stripe gets payment data, generates a token, and sends token to your client application
3. The client application sends the token to your server application
4. Your server application gets the token, creates the user and subscribes them to your service.

Once you charge the client in your server application, the money may not be withdrawn immediately. You just send a 
request to Stripe and you "hope" that you charged your client. 
 
If Stripe couldn't charge the user, it will send a new request to your server application (to the endpoint&mdash;a
webhook&mdash;that you registered with Stripe). The request will contains such data as the customer was deleted, or 
customer payment failed, or other data, and you can create controllers to handle such situations. 

Such flow, however, is only possible in a production application with a real domain.

When you work on your application in development mode on your computer, Stripe can't send any data to `localhost:port`.
Therefore, in order to get full subscription functionality&mdash;to be able to work around payment problems&mdash;we 
used a small library `stripe-local`, which sends a request to Stripe every 15 seconds to verify if any new events were 
registered when you tried to subscribe in the development mode.

If there are any new events, `stripe-local` will get them and send them to your application on `localhost:port`. Simply
put, you can consider `stripe-local` a proxy between your application and Stripe.

#### Configuring stripe-local

Tell how a developer can configure stripe-local with Apollo Universal Starter Kit.

```javascript
import stripeLocal from 'stripe-local';

if (__DEV__ && enabled && secretKey) {
  log.debug('Starting stripe local proxy');
  stripeLocal({ secretKey, webhookUrl: `http://localhost:${__SERVER_PORT__}${webhookUrl}` });
}
```
## Subscription Module Settings

To use the subscription module, you need an active Stripe developers account. You need to save your Stripe API keys in 
the `packages/server/.env` file.   
There are few settings that you can change when using the subscription module. The subscription settings are located in
the file `config/stripeSubscription.js`.

```dotenv
# Stripe API keys
STRIPE_SECRET_KEY=
STRIPE_ENDPOINT_SECRET=
```

You can consult the table below to know about the possible properties and their values:

| Property       | Value   | Purpose |
| -------------- | ------- | ------- |
| stripe         | object  | Contains a reference to the subscription object with global settings for Stripe module      |
| subscription   | object  | Contains concrete properties that store various settings for the Stripe subscription modle  |
| enabled        | Boolean | Enables or disables the subscription module. Defaults to `false`                            |
| webhookUrl     | String  | Stores a URL for your webhook that's used by Stripe |
| publicKey      | String  | Stores the [publishable key] generated by Stripe for your application |
| secretKey      | String  | Stores the [secret key]. The actual key must be stored in the `packages/server/.env` file |
| endpointSecret | String  | Stores the [endpoint secret key]. The actual key must be stored in the `packages/server/.env` file |
| [product]      | Object  | Stores the product properties. Has two properties: `name` and `type`. You can set these  properties to any value |
| [plan]         | Object  | Stores the description of the subscription plan |

## Deployment with Apollo Starter Kit Subscription Module

1. Create a [webhook endpoint] inside the Stripe dashboard with the `webhookUrl` property set `config/payments.js`.
2. Add your live publishable key from Stripe in `config/payments.js`.
3. Add your live secret key from Stripe in the `packages/server/.env`.
4. Set up [webhook signatures] to prevent fraudulent webhooks from being processed. 
5. Add stripe signing secret key from your stripe webhook in `packages/server/.env`. 
6. Run `yarn stripe:setup` from the root directory to create a subscription plan using Stripe API.
7. [Deploy your application].

[Stripe]: https://stripe.com
[Start the application]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Getting-Started#installing-and-running-apollo-universal-starter-kit
[Deploy your application]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Getting-Started#deploying-apollo-starter-kit-application-to-production
[stripe-local]: https://github.com/jsonmaur/stripe-local
[React Native Credit Card Input]: https://github.com/sbycrosz/react-native-credit-card-input
[Stripe Dashboard]: https://dashboard.stripe.com/login
[publishable key]: https://stripe.com/docs/keys
[secret key]: https://stripe.com/docs/keys
[endpoint secret key]: https://stripe.com/docs/webhooks/signatures
[webhook signatures]: https://stripe.com/docs/webhooks/signatures
[Webhook endpoint]: https://stripe.com/docs/webhooks