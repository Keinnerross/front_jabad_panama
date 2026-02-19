import { StripeProvider } from './stripe-provider.js';
import { PayarcProvider } from './payarc-provider.js';

const providerName = (process.env.PAYMENT_PROVIDER || 'stripe').toLowerCase();

let providerInstance = null;

export function getPaymentProvider() {
  if (providerInstance) return providerInstance;

  if (providerName === 'payarc') {
    providerInstance = new PayarcProvider();
  } else {
    providerInstance = new StripeProvider();
  }

  return providerInstance;
}

export function getProviderName() {
  return providerName;
}
