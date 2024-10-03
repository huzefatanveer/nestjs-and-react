// src/stripeConfig.js
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51OzH82P9qbSqpsNt1xSQoLz935KJNOhr1jc2xWozRBHjtjxVw6N973Y5B9geDJRcwdrNWs4l0dnEBI3jxzx5mmYa003vtCjuFQ');

export default stripePromise;