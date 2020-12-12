import { CallableContext } from "firebase-functions/lib/providers/https";
import { firestore } from 'firebase-admin';
import { ADMIN_EMAILS, ADMIN_UID, PAID_ORDERS } from "./constants";
import { handleError, sendEmail, stripe } from "./utils";
import { PaidOrder } from "./types";

export default async (data: any, context: CallableContext) => {
    try {
        if (!context.auth || context.auth.uid !== ADMIN_UID) {
            throw new Error('You are not authorized to use this resource');
        }
        if (!data.refundAmount || typeof data.refundAmount !== "number") {
            throw new Error('Must include a valid refund amount');
        }
        if (!data.orderId) {
            throw new Error('Must include an order ID');
        }
        if (!data.refundReason) {
            throw new Error('Must include a refund reason');
        }
        const orderDoc = await firestore().collection(PAID_ORDERS).doc(data.orderId).get();
        if (!orderDoc.exists) {
            throw new Error('Order does not exist');
        }
        const order = orderDoc.data() as PaidOrder;
        await stripe.refunds.create({
            payment_intent: order.paymentIntentId,
            amount: data.refundAmount
        })
        await firestore().collection(PAID_ORDERS).doc(data.orderId).update({
            refundedAt: Date.now(),
            refundReason: data.refundReason,
            refundAmount: data.refundAmount
        });
        await Promise.all([order.email, ...ADMIN_EMAILS].map(recipient => {
            return sendEmail(recipient, `We've issued a refund for your order`, "");
        }));
    }
    catch (err) {
        handleError(err);
    }
    return;
}