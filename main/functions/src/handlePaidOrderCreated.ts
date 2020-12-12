
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { EventContext } from 'firebase-functions';
import { PaidOrder } from './types';
import { sendEmail } from './utils';
import { ADMIN_EMAILS } from './constants';

export default async (doc: DocumentSnapshot, context: EventContext) => {
    try {
        const order = doc.data() as PaidOrder;
        await Promise.all([order.email, ...ADMIN_EMAILS].map(recipient => {
            return sendEmail(recipient, `We have received your order!`, "<p>Got it</p>");
        }));
    }
    catch (err) {
        console.log(err);
    }
    return;
}