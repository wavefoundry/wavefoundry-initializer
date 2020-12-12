import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CART, CHECKOUT_ROUTE } from "../constants";
import { CheckoutFormData, CheckoutFormItemWrapperProps } from "../types";
import { getLocalStorage, getOrderTotals } from "../utils";
import { STRIPE_PUBLISHABLE_KEY } from "../config";
import CheckoutLogo from "./CheckoutLogo";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import CheckoutFormCustomerData from "./CheckoutFormCustomerData";
import CheckoutFormPaymentMethod from "./CheckoutFormPaymentMethod";
import CheckoutFormReviewOrder from "./CheckoutFormReviewOrder";
import CompletedFormCustomerData from "./CompletedFormCustomerData";
import Layout from "./Layout";
import LayoutContainer from "./LayoutContainer";
import CheckoutFormItem from "./CheckoutFormItem";
import CompletedFormPaymentMethod from "./CompletedFormPaymentMethod";
import CheckoutCouponForm from "./CheckoutCouponForm";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
declare var require: any;
const SmoothScroll =
  typeof window !== "undefined" ? require("smooth-scroll") : null;
const scroll = SmoothScroll ? new SmoothScroll() : undefined;

const CheckoutPage: React.FC = () => {
  React.useEffect(() => {
    window.onbeforeunload = () => "You have unsaved changes";
  }, []);
  const initCartItems = getLocalStorage(CART) || [];
  const [checkoutFormData, setCheckoutFormData] = React.useState<
    CheckoutFormData
  >({
    cartItems: initCartItems,
    customerData: null,
    paymentMethod: null,
    stagedOrder: null,
    clientUpdatedFormData: true,
    couponData: null
  });
  const [currentStep, setCurrentStep] = React.useState(0);
  const formItemRefs = React.useRef<HTMLDivElement[]>([]);
  React.useEffect(() => {
    if (currentStep > 0 && scroll) {
      scroll.animateScroll(formItemRefs.current[currentStep]);
    }
  }, [currentStep]);
  const orderTotals = getOrderTotals(checkoutFormData.cartItems, checkoutFormData.couponData);
  const checkoutFormItems: CheckoutFormItemWrapperProps[] = [
    {
      FormComponent: CheckoutFormCustomerData,
      CompletedSectionComponent: CompletedFormCustomerData,
      label: "Customer Information",
      completed: checkoutFormData.customerData !== null,
    },
    {
      FormComponent: CheckoutFormPaymentMethod,
      CompletedSectionComponent: CompletedFormPaymentMethod,
      label: "Payment Method",
      completed: checkoutFormData.paymentMethod !== null,
    },
    {
      FormComponent: CheckoutFormReviewOrder,
      label: "Review Order",
      completed: false,
    },
  ];
  return (
    <Layout
      pageTitle="Secure Checkout"
      pageURL={CHECKOUT_ROUTE}
      pageDescription="Secure checkout"
      hideNavbar
      hideFooter
    >
      <>
        <header className="bg-primary-700 text-white relative h-12 flex items-center">
          <div className="relative z-10">
            <LayoutContainer>
              <div>
                <a href="/" className="w-12 block">
                  <CheckoutLogo />
                </a>
              </div>
            </LayoutContainer>
          </div>
          <h5 className="text-2xl font-bold absolute left-0 top-0 h-full w-full z-0 flex items-center justify-center">
            CHECKOUT
          </h5>
        </header>
        <section className="py-8">
          <LayoutContainer>
            <div className="m-auto max-w-screen-md lg:max-w-screen-lg">
              <div className="flex -mx-4 flex-row flex-wrap lg:flex-row-reverse lg:flex-nowrap">
                <div className="w-full lg:w-96 flex-shrink-0">
                  <div className="mb-4 hidden lg:block px-4">
                    <CheckoutOrderSummary
                      cartItems={checkoutFormData.cartItems}
                      orderTotals={orderTotals}
                      couponData={checkoutFormData.couponData}
                    />
                  </div>
                  <CheckoutCouponForm checkoutFormData={checkoutFormData} setCheckoutFormData={setCheckoutFormData} />
                </div>
                <Elements stripe={stripePromise}>
                  <div className="flex-grow px-4">
                    {checkoutFormItems.map((item, index) => {
                      return (
                        <CheckoutFormItem
                          key={item.label}
                          {...item}
                          currentStep={currentStep}
                          setCurrentStep={setCurrentStep}
                          checkoutFormData={checkoutFormData}
                          setCheckoutFormData={setCheckoutFormData}
                          index={index}
                          orderTotals={orderTotals}
                          formItemRefs={formItemRefs}
                        />
                      );
                    })}
                  </div>
                </Elements>
              </div>
            </div>
          </LayoutContainer>
        </section>
      </>
    </Layout>
  );
};

export default CheckoutPage;
