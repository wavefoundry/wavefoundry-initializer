import Stripe from 'stripe';
import * as mailgun from 'mailgun-js';
import { MAILGUN_API_KEY, STRIPE_PRIVATE_KEY } from '../config';
import { HttpsError } from 'firebase-functions/lib/providers/https';

export const stripe = new Stripe(STRIPE_PRIVATE_KEY, { apiVersion: '2020-08-27' });

export const handleError = (err: Error) => {
    throw new HttpsError('internal', err.message, err.message);
}

export function convertCentsToCurrency(cents: number) {
    return `${(cents/100).toFixed(2)}`;
}

const DOMAIN = "www.wavefoundry.io";
const FROM = `Wavefoundry <noreply@${DOMAIN}>`;
const mg = mailgun({ apiKey: MAILGUN_API_KEY, domain: DOMAIN });

export const sendEmail = async (to: string, subject: string, html: string) => {
    const message = await mg.messages().send({
        from: FROM,
        to,
        subject,
        html
    })
    return message;
}