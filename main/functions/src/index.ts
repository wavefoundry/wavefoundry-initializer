import { firestore, https } from 'firebase-functions';
import * as admin from 'firebase-admin';
import handlePaymentReceivedFunction from './handlePaymentReceived';
import createStagedOrderFunction from './createStagedOrder';
import handlePaidOrderCreatedFunction from './handlePaidOrderCreated';
import refundOrderFunction from './refundOrder';
import contactUsFunction from './contactUs';
import { PAID_ORDERS } from './constants';

admin.initializeApp();

export const createStagedOrder = https.onCall(createStagedOrderFunction);
export const handlePaymentReceived = https.onRequest(handlePaymentReceivedFunction);
export const handlePaidOrderCreated = firestore.document(`${PAID_ORDERS}/{paidOrderId}`).onCreate(handlePaidOrderCreatedFunction);
export const refundOrder = https.onCall(refundOrderFunction);
export const contactUs = https.onCall(contactUsFunction);