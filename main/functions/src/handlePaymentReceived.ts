import { Request, Response } from "firebase-functions";
import { firestore } from "firebase-admin";
import { get } from "lodash";
import { stripe } from "./utils";
import { STRIPE_WEBHOOK_SECRET } from "./config";
import { StagedOrder, PaidOrder, PaidOrderStatuses } from "./types";
import { COUPONS, PAID_ORDERS, STAGED_ORDERS } from "./constants";

export default async (
  request: Request & { rawBody: any },
  response: Response<any>
) => {
  try {
    const sig = request.headers["stripe-signature"] as
      | string
      | string[]
      | Buffer;
    stripe.webhooks.constructEvent(request.rawBody, sig, STRIPE_WEBHOOK_SECRET);
    const paymentIntentId = get(request, "body.data.object.id");
    const doc = await firestore()
      .collection(STAGED_ORDERS)
      .doc(paymentIntentId)
      .get();
    if (!doc.exists) {
      throw new Error("Staged order not found");
    }
    const stagedOrder = doc.data() as StagedOrder;
    const [charge] = get(request, "body.data.object.charges.data");
    const chargeId = charge.id;
    const paymentMethod = {
      id: charge.payment_method,
      brand: charge.payment_method_details.card.brand,
      last4: charge.payment_method_details.card.last4,
      expMonth: charge.payment_method_details.card.exp_month,
      expYear: charge.payment_method_details.card.exp_year,
    };
    const paidOrder: PaidOrder = {
      ...stagedOrder,
      chargeId,
      paymentIntentId,
      paymentMethod,
      status: PaidOrderStatuses.UNFULFILLED,
    };
    const promises: Promise<any>[] = [
      firestore().collection(PAID_ORDERS).add(paidOrder),
      firestore().collection(STAGED_ORDERS).doc(paymentIntentId).delete(),
    ];
    if (paidOrder.couponData) {
      promises.push(
        firestore()
          .collection(COUPONS)
          .doc(paidOrder.couponData.code)
          .update({ redemptions: firestore.FieldValue.increment(1) })
      );
    }
    await Promise.all(promises);
    response.status(200).end();
  } catch (err) {
    console.error(err);
    response.status(500).end();
  }
};
