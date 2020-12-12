import { firestore } from "firebase-admin";
import { CallableContext } from "firebase-functions/lib/providers/https";
import { COUPONS, PRODUCTS, STAGED_ORDERS } from "./constants";
import {
  CartItem,
  Product,
  OrderItem,
  StagedOrder,
  OrderData,
  Coupon,
} from "./types";
import { stripe, handleError, convertCentsToCurrency } from "./utils";

function validate(data: any) {
  if (!data.cartItems) {
    throw new Error("No cart items were included");
  }
  const cartItems = data.cartItems as CartItem[];
  for (const item of cartItems) {
    if (!item.quantity || item.quantity < 1) {
      throw new Error("Each cart item must have a valid quantity");
    }
    if (!item.productId) {
      throw new Error("Each cart item must have a product ID");
    }
    if (!item.priceOption) {
      throw new Error("Each cart item must have a price option");
    }
    if (!item.price) {
      throw new Error("Each cart item must have a price");
    }
  }
  if (!data.customerData) {
    throw new Error("No customer data included");
  }
}
interface ReturnData {
  clientSecret: string | null;
  orderTotal: number;
  serverCheckoutItems: { [key: string]: { price: number } };
  itemExceptions: string[];
  couponData: { code: string; discount: number } | null;
}

export default async (data: any, context: CallableContext) => {
  try {
    validate(data);
    const orderData = data as OrderData;
    const orderItems: OrderItem[] = [];
    const itemExceptions: string[] = [];
    let orderSubtotal = 0;
    for (const cartItem of orderData.cartItems) {
      const { productId, quantity, priceOption, name, price } = cartItem;
      const doc = await firestore().collection(PRODUCTS).doc(productId).get();
      if (doc.exists) {
        const product = doc.data() as Product;
        if (!product.priceOptions[priceOption]) {
          throw new Error(
            `No option could be found with the name ${priceOption}`
          );
        }
        const option = product.priceOptions[priceOption];
        const itemSubtotal = quantity * option.price;
        orderSubtotal += itemSubtotal;
        const orderItem: OrderItem = {
          name,
          price: option.price,
          productId,
          priceOption,
          imageURL: product.image.imageURL,
          quantity,
        };
        orderItems.push(orderItem);
        if (price !== option.price) {
          itemExceptions.push(
            `Price for ${name} has been changed to $${convertCentsToCurrency(
              option.price
            )}`
          );
        }
      } else {
        itemExceptions.push(
          `Product ${name} is no longer available - it has been removed from your order`
        );
      }
    }
    const serverCheckoutItems = orderItems.reduce(
      (a: ReturnData["serverCheckoutItems"], b) => {
        a[b.productId] = { price: b.price };
        return a;
      },
      {}
    );
    let orderTotal = orderSubtotal;
    let couponData: ReturnData["couponData"] = null;
    if (data.couponData) {
      let couponError = `Coupon code ${data.couponData.code} is not valid`;
      const couponDoc = await firestore()
        .collection(COUPONS)
        .doc(data.couponData.code)
        .get();
      if (couponDoc.exists) {
        const coupon = couponDoc.data() as Coupon;
        if (coupon.enabled) {
          const discount =
            coupon.type === "Percentage"
              ? Math.ceil((coupon.amount * orderSubtotal) / 100)
              : coupon.amount;
          orderTotal -= discount;
          couponData = {
            code: coupon.code,
            discount,
          };
          couponError = ""; // Coupon is valid, remove error
        }
      }
      if (couponError) {
        itemExceptions.push(couponError);
      }
    }
    const returnData: ReturnData = {
      clientSecret: null,
      orderTotal,
      serverCheckoutItems,
      itemExceptions,
      couponData,
    };
    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderTotal,
      currency: "usd",
      payment_method_types: ["card"],
    });

    const stagedOrder: StagedOrder = {
      email: data.customerData.email,
      phone: data.customerData.phone,
      customerName: data.customerData.name,
      orderItems,
      orderSubtotal,
      orderTotal,
      createdAt: Date.now(),
      couponData
    };
    await firestore()
      .collection(STAGED_ORDERS)
      .doc(paymentIntent.id)
      .set(stagedOrder);
    returnData.clientSecret = paymentIntent.client_secret;
    return returnData;
  } catch (err) {
    return handleError(err);
  }
};
