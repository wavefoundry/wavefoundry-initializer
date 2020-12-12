import React from "react";
import { Formik, Form } from "formik";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import FormStripeCardField from "./FormStripeCardField";
import FormSubmitButton from "./FormSubmitButton";
import { CheckoutFormItemProps, PaymentMethod } from "../types";
import { convertCentsToCurrency } from "../utils";
import CompletedFormPaymentMethod from "./CompletedFormPaymentMethod";

const CheckoutFormPaymentMethod: React.FC<CheckoutFormItemProps> = ({
  setCurrentStep,
  setCheckoutFormData,
  orderTotals,
  checkoutFormData,
}) => {
  const [cardError, setCardError] = React.useState(
    "Your card number is incomplete."
  );
  const stripe = useStripe();
  const elements = useElements();
  const handleRemove = () => {
    setCheckoutFormData(currentData => {
      return {
        ...currentData,
        paymentMethod: null,
      };
    });
  };
  return (
    <div>
      {checkoutFormData.paymentMethod ? (
        <div className="flex pl-10 items-center">
          <div>
            <CompletedFormPaymentMethod {...checkoutFormData} />
          </div>
          <div className="pl-4">
            <button
              onClick={handleRemove}
              className="focus:outline-black border rounded border-gray-300 text-gray-800 text-sm px-2 transition-colors bg-white hover:bg-gray-100"
            >
              REMOVE
            </button>
          </div>
        </div>
      ) : (
        <Formik
          initialValues={{ card: "" }}
          onSubmit={async () => {
            try {
              if (!stripe || !elements) {
                throw new Error("Card form not available");
              }
              const card = elements.getElement(CardElement);
              if (!card) {
                throw new Error("Card could not be saved");
              }
              const paymentMethodData = await stripe.createPaymentMethod({
                type: "card",
                card,
              });
              if (
                paymentMethodData &&
                paymentMethodData.paymentMethod &&
                paymentMethodData.paymentMethod.card
              ) {
                const paymentMethod: PaymentMethod = {
                  id: paymentMethodData.paymentMethod.id,
                  brand: paymentMethodData.paymentMethod.card.brand,
                  last4: paymentMethodData.paymentMethod.card.last4,
                  expMonth: paymentMethodData.paymentMethod.card.exp_month,
                  expYear: paymentMethodData.paymentMethod.card.exp_year,
                };
                setCheckoutFormData(currentData => {
                  return {
                    ...currentData,
                    paymentMethod,
                  };
                });
                setCurrentStep(2);
              } else {
                throw new Error("Card could not be processed - please enter card information");
              }
            } catch (err) {
              setCardError(err.message);
            }
          }}
        >
          {({ setFieldTouched, touched, submitCount, isSubmitting }) => {
            return (
              <Form>
                <FormStripeCardField
                  setCardError={setCardError}
                  cardError={cardError}
                  hasError={Boolean(
                    (touched.card || submitCount > 0) && cardError
                  )}
                  handleBlur={() => setFieldTouched("card", true)}
                />
                <div className="flex justify-between mt-3">
                  <div>
                    <FormSubmitButton
                      isSubmitting={isSubmitting}
                      defaultText="REVIEW ORDER"
                    />
                  </div>
                  <div className="leading-none text-right block lg:hidden">
                    <p>Order Total</p>
                    <p className="text-lg font-bold">
                      ${convertCentsToCurrency(orderTotals.orderTotal)}
                    </p>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default CheckoutFormPaymentMethod;
