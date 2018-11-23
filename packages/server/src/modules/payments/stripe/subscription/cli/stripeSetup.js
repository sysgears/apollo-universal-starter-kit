require('@babel/register')({ cwd: __dirname + '/../../../../../../../..' });
require('@babel/polyfill');
require('dotenv/config');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const settings = require('../../../../../../../../settings').default;

const { product, plan, enabled } = settings.stripe.subscription;

if (enabled && process.env.STRIPE_SECRET_KEY) {
  /**
   * Creates Stripe product if it hasn't been already created or if parameters of product were changed
   *
   * @return {Promise<void>} - Stripe product
   */
  const createProduct = async () => {
    const stripeProducts = await stripe.products.list({ limit: 100 });
    let [stripeProduct] = stripeProducts.data.filter(stripeProduct => stripeProduct.name === product.name);

    if (!stripeProduct || (stripeProduct && stripeProduct.type !== product.type)) {
      stripeProduct = await stripe.products.create(product);
      console.log(`Product - OK -->  '${stripeProduct.name}' with id '${stripeProduct.id}' has been created`);
    } else {
      console.log(
        `Product - OK -->  '${stripeProduct.name}' with id '${stripeProduct.id}' has been already created before`
      );
    }

    return stripeProduct;
  };

  /**
   * Creates Stripe plan if it hasn't been already created or if parameters of plan were changed
   *
   * @param product - Stripe product
   * @return {Promise<void>} - Stripe plan
   */
  const createPlan = async product => {
    const stripePlans = await stripe.plans.list({ limit: 100 });
    let [stripePlan] = stripePlans.data.filter(stripePlan => stripePlan.id === plan.id);

    if (stripePlan) {
      if (
        // check if plan is the same
        stripePlan.nickname === plan.nickname &&
        stripePlan.amount === plan.amount &&
        stripePlan.interval === plan.interval &&
        stripePlan.currency === plan.currency &&
        stripePlan.product === product.id
      ) {
        console.log(
          `Plan - OK -->  '${stripePlan.nickname}' with product id
          '${stripePlan.product}' has been already created before`
        );
      } else {
        // if plan was changed then delete existing stripe plan
        await stripe.plans.del(plan.id);
        stripePlan = await stripe.plans.create({ product: product.id, ...plan });
        console.log(`Plan - OK -->  '${stripePlan.nickname}' with product id '${stripePlan.product}' has been created`);
      }
    } else {
      stripePlan = await stripe.plans.create({ product: product.id, ...plan });
      console.log(`Plan - OK -->  '${stripePlan.nickname}' with product id '${stripePlan.product}' has been created`);
    }

    return stripePlan;
  };

  /**
   * Initializes the Stripe: creates product and plan.
   */
  const initStripe = async () => {
    try {
      console.log('--------------------------------------------------------------------------------------------------');

      const product = await createProduct();
      const plan = await createPlan(product);

      console.log(`-----`);
      console.log(`Subscribers will be charged $${plan.amount / 100} a ${plan.interval}`);
      console.log(
        'You will need to configure a webhook endpoint manually in the Stripe dashboard when ready to deploy'
      );
      console.log('This webhook will enable automatic cancellation and automated emails about failed charges');
      console.log(
        '----------------------------------------------------------------------------------------------------'
      );
    } catch (err) {
      console.log('ERROR!!!!');
      console.log(err);
      console.log('--------------------------------------------------------------------------------------------------');
    }
  };

  initStripe();
}
