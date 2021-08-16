/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async tourId => {
  try {
    const stripe = Stripe('pk_test_51JO9DgG6wsiCeDnnKBqMkEaJ3ecRToIV1dpfPuTXz38BosNHQGuu0X7N5hXOkXDvwcw0f6NHqpQJJKo3P8ZtODAu00sNHcQhNQ');
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });

  } catch(err) {
      console.log(err);
      showAlert('error', err);
  }
};
