export interface Product {
  archived: boolean;
  displayPrice: number;
  category: string;
  createdAt: number;
  description: string;
  image: {
    imageURL: string;
  };
  multiplePriceOptions: boolean;
  name: string;
  priceOptions: { [key: string]: { price: number } };
}
export interface CartItem {
    productId: string;
    price: number;
    name: string;
    quantity: number;
    priceOption: string;
}
interface PaymentMethod {
    brand: string;
    expMonth: number;
    expYear: number;
    id: string;
    last4: string;
}
export interface OrderData {
  cartItems: CartItem[];
  customerData: {
      name: string;
      email: string;
      phone: string;
  }
}
export interface OrderItem extends CartItem {
  imageURL: string;
}
export interface StagedOrder {
  orderItems: OrderItem[];
  orderTotal: number;
  orderSubtotal: number;
  email: string;
  phone: string;
  customerName: string;
  createdAt: number;
  couponData: { code: string; discount: number } | null;
}
export enum PaidOrderStatuses {
  UNFULFILLED = "Unfulfilled",
  FULFILLED = "Fulfilled",
}
export interface PaidOrder extends StagedOrder {
  paymentIntentId: string;
  chargeId: string;
  status: PaidOrderStatuses;
  paymentMethod: PaymentMethod;
}
export interface Coupon {
  enabled: boolean;
  redemptions: number;
  type: "Dollar Amount" | "Percentage";
  amount: number;
  code: string;
}
