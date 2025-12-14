const stripe = require("stripe");
const { STRIPE_SECRET_KEY } = require("../../config/env");

if (!STRIPE_SECRET_KEY) {
  console.warn(
    "STRIPE_SECRET_KEY not found in environment variables. Stripe integration will not work."
  );
}

const stripeClient = stripe(STRIPE_SECRET_KEY);

module.exports = stripeClient;

