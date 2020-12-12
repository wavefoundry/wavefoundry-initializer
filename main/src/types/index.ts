import { FluidObject } from "gatsby-image";

export interface CartItem {
  name: string;
  multiplePriceOptions: boolean;
  productId: string;
  productImage: {
    childImageSharp: { fluid: FluidObject };
  };
  price: number;
  priceOption: string;
  quantity: number;
}

export interface Product {
  id: string;
  displayPrice: number;
  multiplePriceOptions: boolean;
  name: string;
  priceOptionArray: { price: number; key: string }[];
  productImage: {
    childImageSharp: { fluid: FluidObject };
  };
}

export interface CartPageProps {
  addToCart?: (cartItem: CartItem) => void;
  cartItemObject?: { [key: string]: CartItem };
}

export interface PaymentMethod {
  brand: string;
  expMonth: number;
  expYear: number;
  last4: string;
  id: string;
}
interface StagedOrder {
  clientSecret: string;
  itemExceptions: string[];
}
export interface CheckoutFormData {
  cartItems: CartItem[];
  customerData: {
    name: string;
    email: string;
    phone: string;
  } | null;
  couponData: {
    code: string;
    discount: number;
  } | null;
  paymentMethod: PaymentMethod | null;
  stagedOrder: StagedOrder | null;
  clientUpdatedFormData: boolean;
}
export interface OrderTotals {
  couponData: CheckoutFormData["couponData"];
  orderTotal: number;
  orderSubtotal: number;
}
export interface CheckoutFormItemWrapperProps {
  FormComponent: React.FC<CheckoutFormItemProps>;
  CompletedSectionComponent?: React.FC<CheckoutFormData>;
  label: string;
  completed: boolean;
}
export interface CheckoutFormItemProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  checkoutFormData: CheckoutFormData;
  setCheckoutFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
  orderTotals: OrderTotals;
}
